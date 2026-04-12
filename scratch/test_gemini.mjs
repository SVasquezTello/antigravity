import dotenv from 'dotenv';
import { callGemini } from '../src/lib/gemini.mjs'; // I'll create a .mjs copy for simple node execution

dotenv.config({ path: '.env.local' });

async function testGemini() {
  console.log('--- DIAGNÓSTICO DE GEMINI ---');
  const key = process.env.GEMINI_KEY;
  if (!key) {
    console.error('❌ ERROR: GEMINI_KEY no está definida en .env.local');
    return;
  }
  console.log('✅ GEMINI_KEY encontrada (empieza por: ' + key.substring(0, 10) + '...)');

  try {
    console.log('📡 Llamando a Gemini con un prompt de prueba...');
    const result = await callGemini('Hola Gemini, responde con la palabra "ACTIVO" si recibes esto.');
    console.log('🤖 RESPUESTA DE GEMINI:', result);
    if (result.includes('ACTIVO')) {
      console.log('✅ PRUEBA EXITOSA: Gemini está funcionando correctamente.');
    } else {
      console.log('⚠️ Gemini respondió algo inesperado, pero la conexión funciona.');
    }
  } catch (err) {
    console.error('❌ ERROR EN LLAMADA A GEMINI:', err.message);
  }
}

testGemini();
