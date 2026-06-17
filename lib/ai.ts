/**
 * Anthropic Claude API helper.
 * Uses fetch directly so it works in the Electron renderer without Node.js deps.
 * API key is fetched from user_credentials in Supabase (per user).
 */
import { supabase } from './supabase';

let cachedKey: string | null = null;

export async function getAnthropicKey(): Promise<string | null> {
  if (cachedKey) return cachedKey;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from('user_credentials')
      .select('anthropic_api_key')
      .eq('user_id', user.id)
      .maybeSingle();
    cachedKey = data?.anthropic_api_key ?? null;
    return cachedKey;
  } catch {
    return null;
  }
}

export function clearKeyCache() {
  cachedKey = null;
}

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function anthropicFetch(
  apiKey: string,
  system: string,
  messages: AnthropicMessage[],
  opts?: { model?: string; maxTokens?: number }
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: opts?.model ?? 'claude-sonnet-4-6',
      max_tokens: opts?.maxTokens ?? 2048,
      system,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const block = data.content?.[0];
  return block?.type === 'text' ? block.text : '';
}

export async function callClaude(
  systemPrompt: string,
  userMessage: string,
  opts?: { model?: string; maxTokens?: number }
): Promise<string> {
  const key = await getAnthropicKey();
  if (!key) {
    return '[AI response unavailable - add your Anthropic API key in Credentials]';
  }
  return anthropicFetch(key, systemPrompt, [{ role: 'user', content: userMessage }], opts);
}

export async function generateScriptIdeas(params: {
  niche: string;
  prompt: string;
  format: string;
  count: number;
  voiceSamples: string[];
  contextItems: string[];
  memoryContext: string;
}): Promise<Array<{
  hook: string;
  body: string;
  cta: string;
  caption: string;
  hashtags: string[];
  why_it_works: string;
}>> {
  const key = await getAnthropicKey();
  if (!key) {
    return Array.from({ length: params.count }, (_, i) => ({
      hook: `[Stub] Hook idea ${i + 1} for ${params.niche} - ${params.prompt}`,
      body: `[Stub] Body content for script ${i + 1}. Add your Anthropic key in Credentials to generate real scripts.`,
      cta: '[Stub] Call to action',
      caption: `[Stub] Caption for post ${i + 1} #${params.niche}`,
      hashtags: [`#${params.niche}`, '#homeservices', '#contractor'],
      why_it_works: '[Stub] Framework explanation',
    }));
  }

  const system = `You are a content strategist for a ${params.niche} contractor business. Generate scroll-stopping short-form video scripts.
Voice samples from this creator:
${params.voiceSamples.slice(0, 3).join('\n---\n')}

Business context:
${params.contextItems.join('\n')}

${params.memoryContext ? `Recent context:\n${params.memoryContext}` : ''}

Rules:
- Match the creator voice exactly based on samples
- No em-dashes. No buzzwords.
- Each script must have a hook in the first 3 seconds
- Format: ${params.format} unless specified otherwise`;

  const user = `Generate ${params.count} ${params.format} script(s) about: ${params.prompt}

Return ONLY a JSON array. Each object must have: hook, body, cta, caption, hashtags (array of strings), why_it_works.`;

  const raw = await anthropicFetch(key, system, [{ role: 'user', content: user }], { maxTokens: 4096 });
  try {
    const start = raw.indexOf('[');
    const end = raw.lastIndexOf(']') + 1;
    return JSON.parse(raw.slice(start, end));
  } catch {
    return [{ hook: raw.slice(0, 100), body: raw, cta: '', caption: '', hashtags: [], why_it_works: '' }];
  }
}

export async function summariseContent(content: string, bucket: string): Promise<{ summary: string; tags: string[] }> {
  const key = await getAnthropicKey();
  if (!key) {
    const words = content.split(' ').slice(0, 20).join(' ');
    return { summary: `[Stub] ${words}...`, tags: ['stub', 'no-key'] };
  }

  const raw = await anthropicFetch(
    key,
    `You summarise content for a content creator's knowledge base. Bucket: ${bucket}. Be concise and useful.`,
    [{ role: 'user', content: `Summarise this content in 3-5 bullet points and extract 8 keyword tags.\n\nContent:\n${content.slice(0, 4000)}\n\nReturn JSON: { "summary": "...", "tags": ["tag1", ...] }` }],
    { model: 'claude-haiku-4-5-20251001', maxTokens: 512 }
  );
  try {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}') + 1;
    return JSON.parse(raw.slice(start, end));
  } catch {
    return { summary: raw.slice(0, 500), tags: [] };
  }
}

export async function extractBusinessInfo(paste: string): Promise<{
  business_name: string;
  city: string;
  services: string[];
  reviews: string[];
  tagline: string;
}> {
  const key = await getAnthropicKey();
  if (!key) {
    return {
      business_name: 'Your Business',
      city: 'Your City',
      services: ['Service 1', 'Service 2', 'Service 3'],
      reviews: ['Great service!', 'Highly recommend.'],
      tagline: 'Quality work, every time.',
    };
  }

  const raw = await anthropicFetch(
    key,
    'You extract structured business info from unstructured text (Google reviews, service lists, etc).',
    [{ role: 'user', content: `Extract from this text:\n${paste.slice(0, 3000)}\n\nReturn JSON: { "business_name": "", "city": "", "services": [], "reviews": [], "tagline": "" }` }],
    { model: 'claude-haiku-4-5-20251001', maxTokens: 512 }
  );
  try {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}') + 1;
    return JSON.parse(raw.slice(start, end));
  } catch {
    return { business_name: '', city: '', services: [], reviews: [], tagline: '' };
  }
}

export async function generateMemorySynthesis(memories: string[]): Promise<string> {
  const key = await getAnthropicKey();
  if (!key) return '[Add Anthropic key to generate daily brief]';

  return anthropicFetch(
    key,
    'You are a strategic advisor. Synthesise recent business activity into actionable insights. Be direct. No fluff.',
    [{ role: 'user', content: `Based on these recent events and decisions, write a 3-5 sentence daily brief with the most important patterns and what to focus on today:\n\n${memories.join('\n')}` }],
    { model: 'claude-haiku-4-5-20251001', maxTokens: 400 }
  );
}
