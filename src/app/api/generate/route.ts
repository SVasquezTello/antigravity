import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { buildPrompt } from '@/lib/prompts'
import { callGemini } from '@/lib/gemini'

export async function POST(req: Request) {
  try {
    const { appSlug, inputs } = await req.json()
    const supabase = await createClient()

    // 1. Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1.5 Verify Access Control
    const { data: roleData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (roleData?.role !== 'admin') {
      const { getUserAccessibleApps } = await import('@/lib/access');
      const accessibleApps = await getUserAccessibleApps(user.id);
      if (!accessibleApps.includes(appSlug)) {
        return NextResponse.json({ error: 'Forbidden: You do not have access to this application. Please upgrade your plan.' }, { status: 403 })
      }

      // Check Quota
      const { data: hasQuota, error: quotaError } = await supabase.rpc('check_user_quota', { p_user_id: user.id })
      if (quotaError) {
        console.error('Quota check error:', quotaError)
      } else if (hasQuota === false) {
        return NextResponse.json({ error: 'Quota Exceeded: You have reached your monthly limit. Please upgrade your plan for more generations.' }, { status: 402 })
      }
    }

    // 2. Fetch app details
    const { data: microApp, error: appError } = await supabase
      .from('micro_apps')
      .select('id, prompt_template')
      .eq('slug', appSlug)
      .single()

    if (appError || !microApp) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }

    // 3. GENERATE CONTENT SYNC (Bypasses missing UPDATE/DELETE policies)
    console.log('Sending prompt to Gemini (Synchronous fallback)...');
    const finalPrompt = buildPrompt(microApp.prompt_template, inputs)
    const resultText = await callGemini(finalPrompt)
    console.log('Gemini responded! Inserting final record...');

    try {
      const { data: execution, error: execError } = await supabase
        .from('app_executions')
        .insert({
          user_id: user.id,
          app_id: microApp.id,
          inputs: inputs,
          status: 'completed',
          result: { markdown: resultText },
          completed_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (execError || !execution) {
        console.error('Final insert failed:', JSON.stringify(execError, null, 2))
        // Still return the result text so the user isn't blocked by DB issues
        return NextResponse.json({ 
          executionId: 'fallback-' + Date.now(),
          result: { markdown: resultText }, 
          warning: 'Result generated but failed to save in history.'
        })
      }

      console.log('Generation Successful and Saved:', execution.id)
      return NextResponse.json({ executionId: execution.id })
    } catch (dbErr) {
      console.error('DB Catch error:', dbErr);
      return NextResponse.json({ 
        executionId: 'fallback-' + Date.now(),
        result: { markdown: resultText }
      });
    }

  } catch (err: any) {
    console.error('API Route error:', err)
    return NextResponse.json({ error: err?.message || 'Internal Server Error' }, { status: 500 })
  }
}
