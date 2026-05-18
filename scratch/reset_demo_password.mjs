import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load env vars
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function resetDemoPassword() {
  const email = 'gavanzadavid@gmail.com'
  const newPassword = 'Antigravity2024!'
  
  console.log(`Searching for user: ${email}...`)
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('Error listing users:', error)
    return
  }
  
  const targetUser = users.find(u => u.email === email)
  
  if (!targetUser) {
    console.log(`❌ User ${email} not found.`)
    return
  }
  
  console.log(`✅ User found. Updating password to matches quick access demo button...`)
  const { data, error: updateError } = await supabase.auth.admin.updateUserById(
    targetUser.id,
    { password: newPassword }
  )
  
  if (updateError) {
    console.error('❌ Failed to update password:', updateError)
  } else {
    console.log(`\n🎉 ¡CONTRASEÑA ACTUALIZADA PARA EL ACCESO RÁPIDO!`)
    console.log(`📧 Correo: ${email}`)
    console.log(`🔑 Nueva Contraseña: ${newPassword}`)
    console.log(`\n¡Ahora el usuario puede presionar el botón "⚡ Acceso Rápido (Demo)" e ingresar directamente!`)
  }
}

resetDemoPassword()
