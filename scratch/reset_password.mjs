import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load env vars
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function resetPassword() {
  const email = 'gavanzadavid@gmail.com'
  const newPassword = 'antigravity123'
  
  console.log(`Searching for user: ${email}...`)
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('Error listing users:', error)
    return
  }
  
  const targetUser = users.find(u => u.email === email)
  
  if (!targetUser) {
    console.log(`❌ User ${email} not found. Creating a new user instead...`)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: newPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'David',
        last_name: 'Vasquez'
      }
    })
    
    if (createError) {
      console.error('Failed to create new user:', createError)
    } else {
      console.log(`🎉 User ${email} created successfully with password: ${newPassword}`)
    }
    return
  }
  
  console.log(`✅ User found. Resetting password for: ${email}...`)
  const { data, error: updateError } = await supabase.auth.admin.updateUserById(
    targetUser.id,
    { password: newPassword }
  )
  
  if (updateError) {
    console.error('❌ Failed to update password:', updateError)
  } else {
    console.log(`\n🎉 ¡CONTRASEÑA RESTABLECIDA CON ÉXITO!`)
    console.log(`📧 Correo: ${email}`)
    console.log(`🔑 Nueva Contraseña Temporal: ${newPassword}`)
    console.log(`\nPor favor dile al usuario que inicie sesión con estas credenciales.`)
  }
}

resetPassword()
