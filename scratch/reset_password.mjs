import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function resetAdminPassword() {
  const email = 'gavanzadavid@gmail.com'
  const newPassword = 'Antigravity2024!'

  console.log(`Intentando resetear contraseña para: ${email}...`)

  // 1. Obtener el ID del usuario por su email
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error listando usuarios:', listError.message)
    return
  }

  const user = users.find(u => u.email === email)

  if (!user) {
    console.log(`Usuario ${email} no encontrado. Creándolo...`)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: newPassword,
      email_confirm: true,
      user_metadata: { first_name: 'David', last_name: 'Admin' }
    })
    
    if (createError) {
      console.error('Error creando usuario:', createError.message)
    } else {
      console.log('✅ Usuario creado exitosamente.')
    }
  } else {
    // 2. Actualizar la contraseña
    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    )

    if (error) {
      console.error('❌ Error al actualizar contraseña:', error.message)
    } else {
      console.log('✅ Contraseña actualizada correctamente a: Antigravity2024!')
    }
  }
}

resetAdminPassword()
