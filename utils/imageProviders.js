import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const DALLE = 'dalle';
export const STABILITY = 'stability';
export const VALID_PROVIDERS = [DALLE, STABILITY];

async function generateWithDallE({ prompt, size = '1024x1024' }) {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    size,
    quality: 'standard',
    n: 1,
    response_format: 'b64_json',
  });
  const item = response.data[0];
  return {
    buffer: Buffer.from(item.b64_json, 'base64'),
    model: 'dall-e-3',
    revisedPrompt: item.revised_prompt,
  };
}

async function generateWithStability({ prompt, size = '1024x1024' }) {
  if (!process.env.STABILITY_API_KEY) {
    throw new Error('STABILITY_API_KEY not configured');
  }
  const [width, height] = size.split('x').map(Number);
  const response = await axios.post(
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
    {
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height,
      width,
      samples: 1,
      steps: 30,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );
  const artifact = response.data.artifacts?.[0];
  if (!artifact) {
    throw new Error('Stability API returned no artifacts');
  }
  return {
    buffer: Buffer.from(artifact.base64, 'base64'),
    model: 'stable-diffusion-xl-1024-v1-0',
    seed: String(artifact.seed),
  };
}

export async function generateImage({ prompt, provider = DALLE, size = '1024x1024' }) {
  if (!prompt || prompt.trim().length < 3) {
    throw new Error('Prompt must be at least 3 characters');
  }
  if (prompt.length > 1000) {
    throw new Error('Prompt must be 1000 characters or fewer');
  }
  switch (provider) {
    case DALLE:
      return generateWithDallE({ prompt, size });
    case STABILITY:
      return generateWithStability({ prompt, size });
    default:
      throw new Error(`Unknown image provider: ${provider}. Valid: ${VALID_PROVIDERS.join(', ')}`);
  }
}
