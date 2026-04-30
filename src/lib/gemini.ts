/**
 * Service to call the Gemini API
 */
export async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_KEY is not defined in environment variables');
  }

  const modelsToTry = [
    'gemini-3.1-flash-preview',
    'gemini-3-flash-preview',
    'gemini-2.5-flash-lite'
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    console.log(`Sending prompt to Gemini (${model})...`);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
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

      console.log(`Gemini (${model}) responded successfully`);
      return text;

    } catch (err: any) {
      console.warn(`Model ${model} failed:`, err.message);
      lastError = err;
      // If it's the last model, we will break and throw the error outside the loop
    }
  }

  // If we reach here, all models failed
  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);

}
