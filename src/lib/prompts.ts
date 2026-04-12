/**
 * Utility to replace placeholders in a prompt template with provided inputs.
 * Template: "Hello {{name}}, you are {{age}} years old."
 * Inputs: { name: "David", age: 31 }
 */
export function buildPrompt(template: string, inputs: Record<string, any>) {
  let prompt = template;
  
  for (const [key, value] of Object.entries(inputs)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    prompt = prompt.replace(placeholder, String(value ?? ''));
  }
  
  return prompt;
}
