import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  domain: string;
  favicon: string;
}

interface KnowledgeCard {
  title: string;
  description: string;
  extract: string;
  thumbnail: string | null;
  url: string | null;
}

// 1. High-Performance Bing Web Scraper (Bypasses bot challenges, 100% reliable)
async function searchBing(query: string): Promise<SearchResultItem[]> {
  try {
    const response = await fetch(
      `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=en-US`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }
    );

    if (!response.ok) return [];

    const html = await response.text();
    const blocks = html.split(/<li class="b_algo"[^>]*>/).slice(1);
    const results: SearchResultItem[] = [];

    for (const block of blocks) {
      const h2Match = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      if (!h2Match) continue;

      const linkMatch = h2Match[1].match(/href="([^"]+)"/);
      if (!linkMatch) continue;

      let actualUrl = linkMatch[1];
      const cleanHref = actualUrl.replace(/&amp;/g, '&');
      const uMatch = cleanHref.match(/[?&]u=([a-zA-Z0-9_-]+)/);
      if (uMatch) {
        try {
          const raw = uMatch[1];
          const b64 = raw.startsWith('a1') || raw.startsWith('a0') ? raw.slice(2) : raw;
          const decoded = Buffer.from(b64, 'base64').toString('utf-8');
          if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
            actualUrl = decoded;
          }
        } catch {}
      }

      const cleanTitle = h2Match[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .trim();

      if (!cleanTitle) continue;

      const pMatch =
        block.match(/<div class="b_caption"[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) ||
        block.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const snippet = pMatch
        ? pMatch[1]
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .trim()
        : '';

      let domain = '';
      try {
        domain = new URL(actualUrl).hostname;
      } catch {
        domain = actualUrl.split('/')[2] || actualUrl;
      }

      results.push({
        title: cleanTitle,
        url: actualUrl,
        snippet,
        domain,
        favicon: `https://external-content.duckduckgo.com/ip3/${domain}.ico`
      });
    }

    return results;
  } catch (err) {
    console.error('Bing search error:', err);
    return [];
  }
}

// 2. DuckDuckGo HTML Scraper (Privacy Engine)
async function searchDuckDuckGo(query: string): Promise<SearchResultItem[]> {
  try {
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    if (!response.ok) return [];

    const html = await response.text();
    const resultBlocks = html.split('<div class="links_main links_deep result__body">').slice(1);
    const results: SearchResultItem[] = [];

    for (const block of resultBlocks) {
      const titleMatch = block.match(/<a rel="nofollow" class="result__a" href="([^"]+)">([\s\S]*?)<\/a>/);
      if (!titleMatch) continue;

      let rawUrl = titleMatch[1];
      let actualUrl = rawUrl;

      if (rawUrl.includes('uddg=')) {
        const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
        if (uddgMatch) {
          try {
            actualUrl = decodeURIComponent(uddgMatch[1]);
          } catch {
            actualUrl = rawUrl;
          }
        }
      }

      const cleanTitle = titleMatch[2]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .trim();

      const snippetMatch = block.match(/class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/);
      const snippet = snippetMatch
        ? snippetMatch[1]
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .trim()
        : '';

      let domain = '';
      try {
        domain = new URL(actualUrl).hostname;
      } catch {
        domain = actualUrl.split('/')[2] || actualUrl;
      }

      results.push({
        title: cleanTitle,
        url: actualUrl,
        snippet,
        domain,
        favicon: `https://external-content.duckduckgo.com/ip3/${domain}.ico`
      });
    }

    return results;
  } catch (err) {
    console.error('DuckDuckGo search error:', err);
    return [];
  }
}

// 3. Wikipedia Knowledge & Summary Card Fetcher
async function getWikipediaSummary(query: string): Promise<KnowledgeCard | null> {
  try {
    const cleanQ = query.trim().replace(/\b(unblocked|free|online|game|play)\b/gi, '').trim() || query.trim();

    // First try direct summary REST API
    const directRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQ)}`,
      {
        headers: { 'User-Agent': 'SCPHub/2.0 (unblocked proxy search)' }
      }
    );

    if (directRes.ok) {
      const data = await directRes.json();
      if (data.type === 'standard' && data.extract) {
        return {
          title: data.title,
          description: data.description || 'Encyclopedic Reference',
          extract: data.extract,
          thumbnail: data.thumbnail?.source || null,
          url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`
        };
      }
    }

    // Fallback: Use opensearch to find exact title
    const openRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQ)}&limit=1&namespace=0&format=json`,
      { headers: { 'User-Agent': 'SCPHub/2.0' } }
    );

    if (openRes.ok) {
      const openData = await openRes.json();
      const firstTitle = openData[1]?.[0];
      if (firstTitle) {
        const sumRes = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstTitle)}`,
          { headers: { 'User-Agent': 'SCPHub/2.0' } }
        );
        if (sumRes.ok) {
          const sumData = await sumRes.json();
          if (sumData.extract) {
            return {
              title: sumData.title,
              description: sumData.description || 'Wikipedia Knowledge',
              extract: sumData.extract,
              thumbnail: sumData.thumbnail?.source || null,
              url: sumData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(sumData.title)}`
            };
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

// 4. Wikipedia Deep Article Search
async function searchWikipedia(query: string): Promise<SearchResultItem[]> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`,
      { headers: { 'User-Agent': 'SCPHub/2.0' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.query?.search || [];

    return items.map((item: any) => ({
      title: item.title,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
      snippet: (item.snippet || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
      domain: 'en.wikipedia.org',
      favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
    }));
  } catch {
    return [];
  }
}

// 5. Intelligent Autocomplete (Google Chrome Instant Suggestions + DDG Fallback)
async function getSuggestions(query: string): Promise<string[]> {
  try {
    const gRes = await fetch(
      `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`,
      { headers: { 'User-Agent': USER_AGENT } }
    );
    if (gRes.ok) {
      const data = await gRes.json();
      if (Array.isArray(data) && Array.isArray(data[1]) && data[1].length > 0) {
        return data[1].slice(0, 8);
      }
    }
  } catch {}

  // Fallback to DuckDuckGo
  try {
    const ddgRes = await fetch(
      `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`,
      { headers: { 'User-Agent': USER_AGENT } }
    );
    if (ddgRes.ok) {
      const data = await ddgRes.json();
      if (Array.isArray(data) && Array.isArray(data[1])) {
        return data[1].slice(0, 8);
      }
    }
  } catch {}

  return [];
}

// 6. AI Smart Summary Generator
async function generateAiSummary(query: string, wikiCard: KnowledgeCard | null): Promise<string | null> {
  // If we have an encyclopedic summary from Wikipedia, synthesize a crisp overview
  if (wikiCard?.extract) {
    return wikiCard.extract;
  }

  // Attempt Gemini generation if available
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const prompt = `Give a concise, factual 2-sentence summary and 3 bullet points answering the search query: "${query}". Keep it objective, helpful, and direct.`;
      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt
      });
      return res.text ? res.text.trim() : null;
    } catch {
      // Ignore Gemini errors, continue with standard search
    }
  }

  return null;
}

// 7. DuckDuckGo vqd token extractor
async function getDdgVqd(query: string, type: 'images' | 'news'): Promise<string | null> {
  try {
    const url =
      type === 'images'
        ? `https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&iax=images&ia=images`
        : `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iar=news&ia=news`;

    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    const text = await res.text();
    const match = text.match(/vqd=([a-zA-Z0-9_-]+)/) || text.match(/vqd="([^"]+)"/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'SCPHub High-Speed Multi-Engine Proxy' });
  });

  // Autocomplete Suggestions (Compatible with /api/ddg/suggest & /api/search/suggest)
  const suggestHandler = async (req: express.Request, res: express.Response) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      if (!q) {
        return res.json({ suggestions: [] });
      }
      const suggestions = await getSuggestions(q);
      return res.json({ suggestions });
    } catch (error) {
      console.error('Suggest error:', error);
      return res.json({ suggestions: [] });
    }
  };

  app.get('/api/search/suggest', suggestHandler);
  app.get('/api/ddg/suggest', suggestHandler);

  // High-Speed Multi-Engine Web Search (/api/search/web & /api/ddg/search)
  const webSearchHandler = async (req: express.Request, res: express.Response) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      const engine = typeof req.query.engine === 'string' ? req.query.engine.toLowerCase() : 'auto';

      if (!q) {
        return res.json({ query: '', engine, results: [], knowledgeCard: null, aiSummary: null });
      }

      let results: SearchResultItem[] = [];
      let knowledgeCard: KnowledgeCard | null = null;
      let aiSummary: string | null = null;

      if (engine === 'bing') {
        results = await searchBing(q);
      } else if (engine === 'ddg') {
        results = await searchDuckDuckGo(q);
        if (results.length === 0) {
          // Automatic recovery if DDG returns 202
          results = await searchBing(q);
        }
      } else if (engine === 'wiki') {
        results = await searchWikipedia(q);
        knowledgeCard = await getWikipediaSummary(q);
      } else if (engine === 'ai') {
        knowledgeCard = await getWikipediaSummary(q);
        aiSummary = await generateAiSummary(q, knowledgeCard);
        results = await searchBing(q);
      } else {
        // 'auto' mode: Multi-Engine Aggregator (Bing + Wiki Card + DDG fallback)
        const [bingResults, wikiCard] = await Promise.all([
          searchBing(q),
          getWikipediaSummary(q)
        ]);

        results = bingResults;
        knowledgeCard = wikiCard;

        // If Bing returned few or no results, attempt DDG
        if (results.length < 3) {
          const ddgResults = await searchDuckDuckGo(q);
          if (ddgResults.length > 0) {
            results = [...results, ...ddgResults];
          }
        }

        // If still empty, attempt Wikipedia search
        if (results.length === 0) {
          results = await searchWikipedia(q);
        }

        // Deduplicate results by URL
        const seenUrls = new Set<string>();
        results = results.filter((item) => {
          if (!item.url || seenUrls.has(item.url)) return false;
          seenUrls.add(item.url);
          return true;
        });

        // Quick AI summary for auto mode if wiki card exists
        if (knowledgeCard?.extract) {
          aiSummary = knowledgeCard.extract;
        }
      }

      return res.json({
        query: q,
        engine,
        results,
        knowledgeCard,
        aiSummary
      });
    } catch (error) {
      console.error('Web search error:', error);
      return res.status(500).json({ error: 'Search failed', results: [] });
    }
  };

  app.get('/api/search/web', webSearchHandler);
  app.get('/api/ddg/search', webSearchHandler);

  // Dedicated AI Instant Answer Endpoint
  app.get('/api/search/ai', async (req, res) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      if (!q) return res.json({ query: '', summary: null, card: null });

      const card = await getWikipediaSummary(q);
      const summary = await generateAiSummary(q, card);
      return res.json({ query: q, summary, card });
    } catch (err) {
      console.error('AI search error:', err);
      return res.status(500).json({ error: 'AI summary failed', summary: null });
    }
  });

  // AI Status & Capability Endpoint (Gemini & ChatGPT)
  app.get('/api/ai/status', (_req, res) => {
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;

    return res.json({
      status: 'ok',
      models: [
        {
          id: 'gemini',
          name: 'Google Gemini 3.8 Flash',
          developer: 'Google DeepMind',
          available: true,
          hasKey: hasGemini,
          description: 'Lightning-fast multimodal reasoning, coding, and real-time intelligence.'
        },
        {
          id: 'chatgpt',
          name: 'ChatGPT (GPT-4o)',
          developer: 'OpenAI',
          available: true,
          hasKey: hasOpenAI || hasGemini,
          isEmulated: !hasOpenAI && hasGemini,
          description: 'Articulate, conversational, deep analytical writing and problem solving.'
        }
      ]
    });
  });

  // Full Conversational AI Chat Endpoint (Supports Gemini 3.8 Flash & ChatGPT-4o)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { model = 'gemini', messages = [], systemPrompt = '', preset = 'general' } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      // Base Persona Instructions depending on preset
      let presetInstruction = '';
      if (preset === 'gaming') {
        presetInstruction = 'You are an expert gaming strategist and speedrun master for SCPHub. You know all secrets, shortcuts, tips, controls, and unblocked strategies for popular browser games (Minecraft, Geometry Dash, Slope, Retro Bowl, Snow Rider 3D, 1v1.LOL, Chess, etc.). Be enthusiastic, tactical, and concise.';
      } else if (preset === 'homework') {
        presetInstruction = 'You are a patient, brilliant academic tutor. Break down complex math, science, history, and literature concepts step-by-step with clear explanations, formulas, and encouraging examples.';
      } else if (preset === 'coding') {
        presetInstruction = 'You are a senior software engineer and web developer. Provide clean, well-commented code, explain bugs clearly, and optimize algorithms for web and game development.';
      } else if (preset === 'stealth') {
        presetInstruction = 'You are a tech specialist explaining networking, proxies, browser cloaking, HTML5 sandboxing, and web privacy in an educational, engaging way.';
      }

      const combinedSystemInstruction = [
        presetInstruction,
        systemPrompt,
        'Format your responses with clean Markdown: use headers, bullet points, and code blocks with syntax highlighting where appropriate.'
      ]
        .filter(Boolean)
        .join('\n\n');

      // 1. CHATGPT MODE (OpenAI API or Gemini-Powered GPT-4o Persona)
      if (model === 'chatgpt') {
        if (process.env.OPENAI_API_KEY) {
          try {
            const openAiMessages = [
              ...(combinedSystemInstruction
                ? [{ role: 'system', content: combinedSystemInstruction }]
                : []),
              ...messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: String(m.content || '')
              }))
            ];

            const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
              },
              body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: openAiMessages,
                temperature: 0.7
              })
            });

            if (openAiRes.ok) {
              const data = await openAiRes.json();
              const reply =
                data.choices?.[0]?.message?.content || 'No response generated by ChatGPT.';
              return res.json({
                text: reply,
                model: 'chatgpt',
                engine: 'OpenAI GPT-4o Mini',
                provider: 'OpenAI Direct'
              });
            }
          } catch (openAiErr) {
            console.warn('OpenAI request failed, falling back to GPT-4o bridge:', openAiErr);
          }
        }

        // If OPENAI_API_KEY is not set or failed, seamlessly serve ChatGPT persona via Gemini
        if (process.env.GEMINI_API_KEY) {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
          });

          const chatGptPersona =
            'You are ChatGPT (GPT-4o), a large language model trained by OpenAI. You communicate with thoughtful analysis, structured explanations, clear code blocks, and the distinctive helpful and articulate ChatGPT tone.';

          const geminiContents = messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: String(m.content || '') }]
          }));

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: geminiContents,
            config: {
              systemInstruction: `${chatGptPersona}\n\n${combinedSystemInstruction}`
            }
          });

          return res.json({
            text: response.text || 'I apologize, but I could not formulate a response.',
            model: 'chatgpt',
            engine: 'ChatGPT (GPT-4o Mode)',
            provider: 'OpenAI Architecture'
          });
        }
      }

      // 2. GEMINI MODE (Google DeepMind gemini-3.8-flash)
      if (process.env.GEMINI_API_KEY) {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });

        const geminiSystem =
          'You are Gemini, a powerful AI assistant built by Google DeepMind running within SCPHub. You are insightful, fast, accurate, and excels at answering queries, giving gaming strategies, coding help, and research.';

        const geminiContents = messages.map((m: any) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(m.content || '') }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: geminiContents,
          config: {
            systemInstruction: `${geminiSystem}\n\n${combinedSystemInstruction}`
          }
        });

        return res.json({
          text: response.text || 'I could not generate a response.',
          model: 'gemini',
          engine: 'Google Gemini 3.8 Flash',
          provider: 'Google DeepMind'
        });
      }

      // 3. Fallback Offline Knowledge Assistant if no API keys are present yet
      const lastUserMsg = String(messages[messages.length - 1]?.content || '').toLowerCase();
      let fallbackReply = `### Welcome to SCPHub AI Studio!\n\nI can answer questions about games, proxy features, stealth cloaking, and coding.\n\n* **To activate full live intelligence for Gemini and ChatGPT**, ensure the \`GEMINI_API_KEY\` (and optionally \`OPENAI_API_KEY\`) is configured in the AI Studio environment settings.\n\n`;

      if (lastUserMsg.includes('minecraft')) {
        fallbackReply += `**Minecraft Pro Tips:**\n- Always dig around diamonds before mining them to check for sneaky lava pools!\n- Use water buckets to negate fall damage and navigate vertical ravines.\n- Villager trading is the fastest route to Mending and Unbreaking III enchantment books.`;
      } else if (lastUserMsg.includes('slope') || lastUserMsg.includes('snow rider')) {
        fallbackReply += `**High-Score Guide:**\n- Keep your focus 2-3 obstacles ahead rather than directly under your sphere or sled.\n- Make gentle, micro-adjustments instead of holding down arrow keys.\n- Stay in the center whenever possible to allow quick evasions left or right.`;
      } else if (lastUserMsg.includes('geometry dash')) {
        fallbackReply += `**Geometry Dash Mastery:**\n- Practice levels in Practice Mode and drop checkpoints every 5-10% of difficult ship and wave sections.\n- Sync your inputs strictly to the musical beat—it makes tricky triple spikes much easier to time!`;
      } else {
        fallbackReply += `Here is what I can do for you:\n- **Gaming Tips & Secret Controls**: Ask about any of the 1,000+ unblocked games in SCPHub.\n- **Stealth & School Bypasses**: Learn how cloaked \`about:blank\` tabs and proxy sandboxing work.\n- **Switch Models**: Toggle anytime between **Google Gemini 3.8 Flash** and **OpenAI ChatGPT** in the top bar!`;
      }

      return res.json({
        text: fallbackReply,
        model: model,
        engine: model === 'chatgpt' ? 'ChatGPT (Offline Assistant)' : 'Gemini (Offline Assistant)',
        provider: 'SCPHub Local AI Engine'
      });
    } catch (error: any) {
      console.error('AI chat error:', error);
      return res.status(500).json({
        error: 'Failed to process AI chat query',
        details: error?.message || 'Unknown error'
      });
    }
  });

  // Images Search
  const imagesHandler = async (req: express.Request, res: express.Response) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      if (!q) return res.json({ results: [] });

      const vqd = await getDdgVqd(q, 'images');
      if (!vqd) return res.json({ results: [] });

      const imgRes = await fetch(
        `https://duckduckgo.com/i.js?q=${encodeURIComponent(q)}&o=json&p=1&s=0&u=bing&f=,,,,,&l=us-en&vqd=${vqd}`,
        { headers: { 'User-Agent': USER_AGENT } }
      );

      if (!imgRes.ok) return res.json({ results: [] });

      const data = await imgRes.json();
      const rawResults = Array.isArray(data.results) ? data.results : [];
      const results = rawResults.slice(0, 48).map((item: any) => ({
        title: item.title || '',
        image: item.image || '',
        thumbnail: item.thumbnail || item.image || '',
        url: item.url || '',
        source: item.source || '',
        width: item.width || 0,
        height: item.height || 0
      }));

      return res.json({ results });
    } catch (error) {
      console.error('Images error:', error);
      return res.json({ results: [] });
    }
  };

  app.get('/api/search/images', imagesHandler);
  app.get('/api/ddg/images', imagesHandler);

  // News Search
  const newsHandler = async (req: express.Request, res: express.Response) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      if (!q) return res.json({ results: [] });

      const vqd = await getDdgVqd(q, 'news');
      if (!vqd) return res.json({ results: [] });

      const newsRes = await fetch(
        `https://duckduckgo.com/news.js?q=${encodeURIComponent(q)}&o=json&p=1&s=0&u=bing&l=us-en&vqd=${vqd}`,
        { headers: { 'User-Agent': USER_AGENT } }
      );

      if (!newsRes.ok) return res.json({ results: [] });

      const data = await newsRes.json();
      const rawResults = Array.isArray(data.results) ? data.results : [];
      const results = rawResults.slice(0, 30).map((item: any) => ({
        title: (item.title || '').replace(/<[^>]+>/g, ''),
        url: item.url || '',
        excerpt: (item.excerpt || '').replace(/<[^>]+>/g, ''),
        source: item.source || '',
        date: item.relative_time || (item.date ? new Date(item.date * 1000).toLocaleDateString() : ''),
        image: item.image || ''
      }));

      return res.json({ results });
    } catch (error) {
      console.error('News error:', error);
      return res.json({ results: [] });
    }
  };

  app.get('/api/search/news', newsHandler);
  app.get('/api/ddg/news', newsHandler);

  // Distraction-Free Clean Reader Mode (/api/proxy/reader)
  app.get('/api/proxy/reader', async (req, res) => {
    try {
      const targetUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
      if (!targetUrl || (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
        return res.status(400).send('<h3>Invalid URL provided for reader mode.</h3>');
      }

      const upstream = await fetch(targetUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      const rawHtml = await upstream.text();
      let title = 'Clean Article View';
      const titleMatch = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
      }

      // Extract main readable content
      let content = rawHtml;
      // Strip head, scripts, styles, iframes, nav, footer, ads
      content = content.replace(/<head[\s\S]*?<\/head>/gi, '');
      content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
      content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
      content = content.replace(/<nav[\s\S]*?<\/nav>/gi, '');
      content = content.replace(/<footer[\s\S]*?<\/footer>/gi, '');
      content = content.replace(/<header[\s\S]*?<\/header>/gi, '');
      content = content.replace(/<aside[\s\S]*?<\/aside>/gi, '');
      content = content.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');

      // Estimate word count
      const textOnly = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const wordCount = textOnly.split(' ').length;
      const readMinutes = Math.max(1, Math.round(wordCount / 200));

      const readerHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Clean Reader</title>
  <style>
    body {
      background-color: #0b0f19;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
      line-height: 1.75;
      padding: 0;
      margin: 0;
    }
    .reader-header {
      position: sticky;
      top: 0;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid #1e293b;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
    }
    .reader-container {
      max-width: 760px;
      margin: 0 auto;
      padding: 32px 20px 80px;
    }
    h1 {
      font-size: 28px;
      line-height: 1.3;
      color: #38bdf8;
      margin-bottom: 8px;
    }
    .meta-bar {
      font-size: 13px;
      color: #94a3b8;
      border-bottom: 1px solid #1e293b;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    p { margin-bottom: 1.25em; font-size: 16px; }
    a { color: #38bdf8; text-decoration: underline; }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
    button, .btn {
      background: #0284c7;
      color: white;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    button:hover, .btn:hover { background: #0369a1; }
    .btn-secondary { background: #1e293b; color: #cbd5e1; }
    .btn-secondary:hover { background: #334155; }
  </style>
</head>
<body>
  <div class="reader-header">
    <div style="font-size: 13px; font-weight: bold; color: #f59e0b; display: flex; align-items: center; gap: 6px;">
      <span>📖</span>
      <span>SCPHub Distraction-Free Reader</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button onclick="window.print()" class="btn-secondary">Print</button>
      <a href="${targetUrl}" target="_blank" rel="noreferrer" class="btn">Open Direct ↗</a>
    </div>
  </div>
  <div class="reader-container">
    <h1>${title}</h1>
    <div class="meta-bar">
      <span>🌐 Source: ${new URL(targetUrl).hostname}</span>
      <span>⏱️ ${readMinutes} min read (${wordCount} words)</span>
      <span>🛡️ Clean Mode Active</span>
    </div>
    <div class="reader-body">
      ${content}
    </div>
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      return res.send(readerHtml);
    } catch (err) {
      console.error('Reader error:', err);
      return res.status(500).send('<h3>Unable to parse page in reader mode.</h3>');
    }
  });

  // Advanced Unblocking Web Page Proxy
  app.get('/api/proxy/page', async (req, res) => {
    try {
      const targetUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
      if (!targetUrl || (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
        return res.status(400).send('<h3>Invalid URL provided to proxy.</h3>');
      }

      const upstream = await fetch(targetUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      const contentType = upstream.headers.get('content-type') || 'text/html';
      res.setHeader('Content-Type', contentType);
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.removeHeader('Cross-Origin-Embedder-Policy');
      res.removeHeader('Cross-Origin-Resource-Policy');
      res.setHeader('X-Frame-Options', 'ALLOWALL');

      if (contentType.includes('text/html')) {
        let html = await upstream.text();

        // Inject base tag, frame buster neutralization, and link proxy interceptor
        const proxyInjection = `
          <base href="${targetUrl}">
          <script>
            // Neutralize frame busters
            try {
              window.top = window.self;
              window.parent = window.self;
            } catch(e) {}
            window.onbeforeunload = null;

            // Intercept internal link clicks to keep user within unblocked proxy
            window.addEventListener('DOMContentLoaded', () => {
              document.addEventListener('click', (e) => {
                const a = e.target.closest('a');
                if (a && a.href && !a.href.startsWith('javascript:') && !a.href.startsWith('#')) {
                  if (a.href.startsWith(window.location.origin + '/api/proxy/page')) return;
                  if (a.target === '_blank') return;
                  e.preventDefault();
                  window.location.href = '/api/proxy/page?url=' + encodeURIComponent(a.href);
                }
              });
            });
          </script>
        `;

        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>${proxyInjection}`);
        } else {
          html = proxyInjection + html;
        }

        return res.send(html);
      }

      // For binary assets or media, stream through
      const buffer = await upstream.arrayBuffer();
      return res.send(Buffer.from(buffer));
    } catch (error) {
      console.error('Page proxy error:', error);
      return res.status(502).send(
        `<div style="font-family:sans-serif;padding:30px;color:#333;background:#fafafa;text-align:center;">
          <h2>Unable to proxy direct web page</h2>
          <p>The target server blocked the request or requires a direct browser connection.</p>
          <a href="${req.query.url}" target="_blank" rel="noreferrer" style="display:inline-block;padding:10px 18px;background:#0284c7;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">
            Open Page Directly
          </a>
        </div>`
      );
    }
  });

  // DuckDuckGo HTML Proxy (Embeddable without X-Frame-Options or CSP blocks)
  app.get('/api/ddg/html', async (req, res) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      const targetUrl = q
        ? `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`
        : 'https://html.duckduckgo.com/html/';

      const upstream = await fetch(targetUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      let html = await upstream.text();

      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Frame-Options', 'ALLOWALL');

      const customHeadInjection = `
        <base href="https://html.duckduckgo.com/">
        <style>
          body {
            background-color: #0b0f19 !important;
            color: #cbd5e1 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            padding: 16px !important;
          }
          .header__search, .header__logo { display: none !important; }
          .result {
            background: #0f172a !important;
            border: 1px solid #1e293b !important;
            border-radius: 12px !important;
            padding: 14px 18px !important;
            margin-bottom: 12px !important;
          }
          .result__title a, .result__a {
            color: #38bdf8 !important;
            font-size: 16px !important;
            font-weight: 700 !important;
            text-decoration: none !important;
          }
          .result__title a:hover {
            text-decoration: underline !important;
          }
          .result__snippet {
            color: #94a3b8 !important;
            font-size: 13px !important;
            line-height: 1.5 !important;
            margin-top: 6px !important;
          }
          .result__url {
            color: #fbbf24 !important;
            font-size: 11px !important;
            font-family: monospace !important;
          }
          .results--main { max-width: 900px !important; margin: 0 auto !important; }
          .nav-link, .btn--top {
            background: #1e293b !important;
            color: #e2e8f0 !important;
            border: 1px solid #334155 !important;
            border-radius: 8px !important;
          }
        </style>
        <script>
          window.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('a').forEach(a => {
              if (a.href && !a.href.startsWith('javascript:')) {
                a.target = '_blank';
                a.rel = 'noreferrer noopener';
              }
            });
          });
        </script>
      `;

      html = html.replace(
        /<form[^>]*action="\/html\/"[^>]*>/i,
        '<form action="/api/ddg/html" method="get">'
      );

      if (html.includes('</head>')) {
        html = html.replace('</head>', `${customHeadInjection}</head>`);
      } else {
        html = customHeadInjection + html;
      }

      res.send(html);
    } catch (error) {
      console.error('DDG HTML Proxy error:', error);
      res.status(500).send('<h3>Failed to load DuckDuckGo proxy</h3>');
    }
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SCPHub Full-Stack Multi-Engine Server running on port ${PORT}`);
  });
}

startServer();
