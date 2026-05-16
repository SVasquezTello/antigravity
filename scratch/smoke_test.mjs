import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function smokeTest() {
  console.log('🔥 INICIANDO PRUEBA DE HUMO (SMOKE TEST) - ANTIGRAVITY v2\n')
  
  let totalErrors = 0

  // 1. Verificar Conexión
  console.log('📡 [1/5] Verificando conexión con Supabase...')
  const { data: connData, error: connError } = await supabase.from('users').select('count').limit(1)
  if (connError) {
    console.error('❌ Error de conexión:', connError.message)
    totalErrors++
  } else {
    console.log('✅ Conexión establecida.')
  }

  // 2. Verificar Tabla Workspaces
  console.log('\n🏢 [2/5] Verificando tabla "workspaces"...')
  const { data: wData, error: wError } = await supabase.from('workspaces').select('*').limit(1)
  if (wError) {
    console.error('❌ Tabla "workspaces" NO ENCONTRADA. ¿Ejecutaste el SQL?')
    totalErrors++
  } else {
    console.log('✅ Tabla "workspaces" detectada correctamente.')
  }

  // 3. Verificar Tabla Offers
  console.log('\n💎 [3/5] Verificando tabla "offers"...')
  const { data: oData, error: oError } = await supabase.from('offers').select('*').limit(1)
  if (oError) {
    console.error('❌ Tabla "offers" NO ENCONTRADA.')
    totalErrors++
  } else {
    console.log('✅ Tabla "offers" detectada correctamente.')
  }

  // 4. Verificar Tabla User Status
  console.log('\n👤 [4/5] Verificando tabla "user_status"...')
  const { data: sData, error: sError } = await supabase.from('user_status').select('*').limit(1)
  if (sError) {
    console.error('❌ Tabla "user_status" NO ENCONTRADA.')
    totalErrors++
  } else {
    console.log('✅ Tabla "user_status" detectada correctamente.')
  }

  // 5. Verificar Integridad de Columnas
  console.log('\n🔗 [5/5] Verificando renombrado de columnas (client_id -> workspace_id)...')
  const { data: colData, error: colError } = await supabase.from('users').select('workspace_id').limit(1)
  if (colError) {
    console.error('❌ La columna "workspace_id" no existe en "users". El renombrado falló.')
    totalErrors++
  } else {
    console.log('✅ Columna "workspace_id" verificada en tabla "users".')
  }

  console.log('\n--- RESULTADO FINAL ---')
  if (totalErrors === 0) {
    console.log('🚀 SISTEMA LISTO PARA PRODUCCIÓN. Puedes activar y desplegar.')
  } else {
    console.log(`⚠️ SE DETECTARON ${totalErrors} ERRORES CRÍTICOS. No desplegar aún.`)
  }
}

smokeTest()
