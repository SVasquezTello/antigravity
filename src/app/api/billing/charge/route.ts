import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { token, planId, amount, email } = await req.json()
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 1. Llamada a Culqi para realizar el cargo
    // Reemplazar 'sk_test_...' con tu llave secreta real de Culqi
    const culqiResponse = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CULQI_SECRET_KEY || 'sk_test_PLACEHOLDER'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Culqi usa céntimos (S/ 49.00 = 4900)
        currency_code: 'PEN',
        email: email,
        source_id: token
      })
    })

    const culqiData = await culqiResponse.json()

    if (!culqiResponse.ok) {
      return NextResponse.json({ 
        error: culqiData.user_message || 'Error en el procesamiento del pago' 
      }, { status: 400 })
    }

    // 2. Si el pago es exitoso, actualizamos el plan en Supabase
    const { error: updateError } = await supabase.from('user_status').upsert({
      user_id: user.id,
      current_plan_id: planId,
      status: 'active',
      updated_at: new Date().toISOString()
    })

    if (updateError) throw updateError

    // 3. Opcional: Registrar la transacción en una tabla de auditoría
    // await supabase.from('transactions').insert({ ... })

    return NextResponse.json({ 
      success: true, 
      message: 'Pago procesado y plan activado correctamente' 
    })

  } catch (error: any) {
    console.error('Billing API Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
