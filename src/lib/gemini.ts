/**
 * Service to call the Gemini API
 */
export async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_KEY is not defined in environment variables');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  console.log('Sending prompt to Gemini (gemini-2.5-flash)...');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API Error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('No content returned from Gemini');
  }

  console.log('Gemini responded successfully');
  return text;
}
