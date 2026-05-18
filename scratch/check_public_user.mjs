import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load env vars
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkPublicUser() {
  const email = 'gavanzadavid@gmail.com'
  console.log(`Checking public schemas for user: ${email}...`)
  
  // 1. Get auth user id
  const { data: { users }, error: authErr } = await supabase.auth.admin.listUsers()
  if (authErr) {
    console.error('Auth check error:', authErr)
    return
  }
  
  const authUser = users.find(u => u.email === email)
  if (!authUser) {
    console.log(`User ${email} does not exist in Auth!`)
    return
  }
  
  console.log(`Auth User ID: ${authUser.id}`)
  
  // 2. Check public.users
  const { data: pubUser, error: pubErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle()
    
  console.log('public.users record:', pubErr ? `Error: ${pubErr.message}` : pubUser)
  
  // 3. Check public.user_status
  const { data: userStatus, error: statusErr } = await supabase
    .from('user_status')
    .select('*')
    .eq('user_id', authUser.id)
    .maybeSingle()
    
  console.log('public.user_status record:', statusErr ? `Error: ${statusErr.message}` : userStatus)
  
  // If public.users is missing, create it!
  if (!pubUser) {
    console.log('⚠️ public.users record is MISSING! Creating one now...')
    
    // Find or create workspace
    let workspaceId;
    const { data: workspaces } = await supabase.from('workspaces').select('*').limit(1)
    if (workspaces && workspaces.length > 0) {
      workspaceId = workspaces[0].id
    } else {
      const { data: newW, error: wErr } = await supabase.from('workspaces').insert({
        name: `${email.split('@')[0]}'s Workspace`,
        status: 'active'
      }).select('id').single()
      if (wErr) {
        console.error('Failed to create workspace:', wErr)
      } else {
        workspaceId = newW.id
      }
    }
    
    const { data: createdPub, error: insertErr } = await supabase.from('users').insert({
      id: authUser.id,
      email: email,
      role: 'super_admin', // Let's set it as super_admin/admin so they have full power!
      workspace_id: workspaceId,
      first_name: 'David',
      last_name: 'Vasquez'
    }).select().single()
    
    if (insertErr) {
      console.error('Failed to insert public.users record:', insertErr)
    } else {
      console.log('🎉 Successfully created public.users record!', createdPub)
    }
  } else {
    // Let's ensure role is set to super_admin or admin if needed, or check what it currently is.
    console.log(`Current role is: ${pubUser.role}`)
  }

  // If public.user_status is missing, create it!
  if (!userStatus && pubUser) {
    console.log('⚠️ public.user_status is MISSING! Creating one now...')
    
    // Let's find an offer to link
    const { data: offers } = await supabase.from('offers').select('id').limit(1)
    const planId = offers && offers.length > 0 ? offers[0].id : null
    
    const { data: createdStatus, error: statusInsertErr } = await supabase.from('user_status').insert({
      user_id: authUser.id,
      workspace_id: pubUser.workspace_id,
      current_plan_id: planId,
      status: 'active',
      updated_at: new Date().toISOString()
    }).select().single()
    
    if (statusInsertErr) {
      console.error('Failed to insert public.user_status record:', statusInsertErr)
    } else {
      console.log('🎉 Successfully created public.user_status record!', createdStatus)
    }
  }
}

checkPublicUser()
