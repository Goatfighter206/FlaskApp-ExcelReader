import { corePrompt, platformPrompts, tonePrompt, userContextPrompt } from './prompts.js';
import { chat } from './llmClient.js'; // your LLM wrapper

export async function generateResponse({ messages, platform, tone, userContext }) {
  const systemPrompt = [
    corePrompt,
    platformPrompts[platform] || '',
    tone ? tonePrompt(tone) : '',
    userContext ? userContextPrompt(userContext) : '',
  ].join('\n');

  const response = await chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
const reply = await generateResponse({
  messages: [{ role: 'user', content: 'How do I deploy to Netlify?' }],
  platform: 'web',
  tone: 'debugging',
  userContext: {
    name: 'Brent',
    project: 'Little Hammer',
    preferences: 'step-by-step explanations with code snippets',
  },
});
// messages.js
export const celebrationMessages = [
  "🎉 Welcome aboard, legend!",
  "🚀 Another user joins the revolution!",
  "💥 Stripe payment received—let's build!",
  "🔥 You just made Little Hammer smile.",
  "👏 That’s a win worth celebrating!",
  "✨ Another milestone crushed!",
];

export function getRandomCelebration() {
  const index = Math.floor(Math.random() * celebrationMessages.length);
  return celebrationMessages[index];
}
import { getRandomCelebration } from './messages.js';

const celebration = tone === 'celebratory' ? getRandomCelebration() : '';
const systemPrompt = [
  corePrompt,
  platformPrompts[platform] || '',
  tone ? tonePrompt(tone) : '',
  userContext ? userContextPrompt(userContext) : '',
  celebration,
].join('\n');
import redis from 'redis';
const client = redis.createClient();

async function getUserMemory(userId) {
  const raw = await client.get(`memory:${userId}`);
  return JSON.parse(raw);
}
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getUserMemory(userId) {
  const { data } = await supabase
    .from('user_memory')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data;
}
const userMemory = await getUserMemory(userId);
const userContext = {
  name: userMemory.name,
  project: userMemory.project,
  preferences: userMemory.preferences,
};
export const agents = {
  LittleHammer: {
    name: 'Little Hammer',
    corePrompt: corePrompt,
    voice: 'Confident, clear, supportive. Occasionally cheeky.',
  },
  BugSquasher: {
    name: 'Bug Squasher',
    corePrompt: `
You are Bug Squasher, a ruthless debugging agent. You speak in terse, tactical bursts. You hate bugs and love clean code. You never celebrate—only fix.
`,
    voice: 'Blunt, tactical, no fluff.',
  },
  Onboarda: {
    name: 'Onboarda',
    corePrompt: `
You are Onboarda, a cheerful onboarding agent. You guide users through setup with warmth and clarity. You love emojis and numbered lists.
`,
    voice: 'Friendly, step-by-step, emoji-rich.',
  },
};
import { agents } from './agents.js';

export async function generateResponse({ messages, platform, tone, userContext, agentName }) {
  const agent = agents[agentName] || agents['LittleHammer'];

  const systemPrompt = [
    agent.corePrompt,
    platformPrompts[platform] || '',
    tone ? tonePrompt(tone) : '',
    userContext ? userContextPrompt(userContext) : '',
    tone === 'celebratory' ? getRandomCelebration() : '',
  ].join('\n');

  const response = await chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('/agent')) {
    const agentName = message.content.split(' ')[1];
    await setUserAgent(message.author.id, agentName); // store in Redis or Supabase
    message.reply(`🔄 Switched to agent: ${agentName}`);
  }
});
if (incomingMessage.startsWith('agent:')) {
  const agentName = incomingMessage.split(':')[1];
  await setUserAgent(userId, agentName);
  sendSMS(userPhone, `✅ Agent switched to ${agentName}`);
}
// POST /update-memory
app.post('/update-memory', async (req, res) => {
  const { userId, name, project, preferences, agentName } = req.body;
  await supabase.from('user_memory').upsert({ user_id: userId, name, project, preferences, agent: agentName });
  res.send({ success: true });
});
// POST /stripe-webhook
app.post('/stripe-webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.client_reference_id;
    const userMemory = await getUserMemory(userId);
    const celebration = getRandomCelebration();

    await discordClient.channels.cache.get(DISCORD_CHANNEL_ID).send(
      `${celebration} 💸 ${userMemory.name} just made a payment for ${userMemory.project}!`
    );
  }

  res.send({ received: true });
});
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('/agent')) {
    const agentName = message.content.split(' ')[1];
    await setUserAgent(message.author.id, agentName); // store in Redis or Supabase
    message.reply(`🔄 Switched to agent: ${agentName}`);
  }
});
if (incomingMessage.startsWith('agent:')) {
  const agentName = incomingMessage.split(':')[1];
  await setUserAgent(userId, agentName);
  sendSMS(userPhone, `✅ Agent switched to ${agentName}`);
}
// POST /update-memory
app.post('/update-memory', async (req, res) => {
  const { userId, name, project, preferences, agentName } = req.body;
  await supabase.from('user_memory').upsert({ user_id: userId, name, project, preferences, agent: agentName });
  res.send({ success: true });
});
app.post('/stripe-webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.client_reference_id;
    const userMemory = await getUserMemory(userId);
    const celebration = getRandomCelebration();

    await discordClient.channels.cache.get(DISCORD_CHANNEL_ID).send(
      `${celebration} 💸 ${userMemory.name} just made a payment for ${userMemory.project}!`
    );
  }

  res.send({ received: true });
});
export async function generateResponse({ messages, platform, tone, userId }) {
  const userMemory = await getUserMemory(userId);
  const agent = agents[userMemory.agent] || agents['LittleHammer'];

  const systemPrompt = [
    agent.corePrompt,
    platformPrompts[platform] || '',
    tone ? tonePrompt(tone) : '',
    userMemory ? userContextPrompt(userMemory) : '',
    tone === 'celebratory' ? getRandomCelebration() : '',
  ].join('\n');

  const response = await chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
// Discord.js v14
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'agent') {
    const agentName = interaction.options.getString('name');
    await setUserAgent(interaction.user.id, agentName);
    await interaction.reply(`🔄 Agent switched to: ${agentName}`);
  }
});
{
  name: 'agent',
  description: 'Switch your AI agent',
  options: [{
    name: 'name',
    type: 3, // STRING
    description: 'Agent name (e.g., LittleHammer, BugSquasher)',
    required: true,
  }]
}
if (incomingMessage.toLowerCase().startsWith('agent:')) {
  const agentName = incomingMessage.split(':')[1].trim();
  await setUserAgent(userId, agentName);
  sendSMS(userPhone, `✅ Agent switched to ${agentName}`);
}
// POST /update-memory
app.post('/update-memory', async (req, res) => {
  const { userId, name, project, preferences, agentName } = req.body;
  await supabase.from('user_memory').upsert({ user_id: userId, name, project, preferences, agent: agentName });
  res.send({ success: true });
});
function MemoryEditor({ userId }) {
  const [form, setForm] = useState({ name: '', project: '', preferences: '', agentName: 'LittleHammer' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await fetch('/update-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...form }),
    });
    alert('Memory updated!');
  };

  return (
    <div>
      <h2>Edit Your Agent Memory</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <input name="project" placeholder="Project" value={form.project} onChange={handleChange} />
      <input name="preferences" placeholder="Preferences" value={form.preferences} onChange={handleChange} />
      <select name="agentName" value={form.agentName} onChange={handleChange}>
        <option value="LittleHammer">LittleHammer</option>
        <option value="BugSquasher">BugSquasher</option>
        <option value="Onboarda">Onboarda</option>
      </select>
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
app.post('/stripe-webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.client_reference_id;
    const userMemory = await getUserMemory(userId);
    const celebration = getRandomCelebration();

    await discordClient.channels.cache.get(DISCORD_CHANNEL_ID).send(
      `${celebration} 💸 ${userMemory.name} just paid for ${userMemory.project}!`
    );
  }

  res.send({ received: true });
});
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
{
  "functions": {
    "api/update-memory.js": {
      "memory": 512,
      "maxDuration": 10
    }
  }
}
app.get('/preview-agent/:agentName', (req, res) => {
  const agent = agents[req.params.agentName];
  res.send({ prompt: agent.corePrompt });
});
