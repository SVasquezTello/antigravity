import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listModels() {
  const apiKey = process.env.GEMINI_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('--- MODELOS DISPONIBLES ---');
    if (data.models) {
      data.models.forEach(m => {
        console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log('No se encontraron modelos o la clave es inválida:', JSON.stringify(data));
    }
  } catch (err) {
    console.error('Error al listar modelos:', err.message);
  }
}

listModels();
