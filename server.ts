import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { READING_AREAS, TAROT_CARD_BY_ID } from './src/data/tarotDeck.ts';
import {
  MYSTICAL_MANGA_PREFACE_VI,
  TAROT_MYSTICAL_KB,
} from './server/knowledge/tarotMysticalKb.ts';
import type {
  ArchivedCardRecord,
  Language,
  Orientation,
  ReadingAreaId,
  TarotInterpretation,
} from './src/types/tarot.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

let cachedAi: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  if (!cachedAi) {
    cachedAi = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedAi;
}

interface InterpretRequestBody {
  areaId: ReadingAreaId;
  question: string;
  language: Language;
  cards: {
    cardId: string;
    positionIndex: number;
    positionLabel: string;
    orientation: Orientation;
  }[];
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      deckSize: Object.keys(TAROT_MYSTICAL_KB).length,
      geminiConfigured: Boolean(
        process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
      ),
    });
  });

  app.get('/api/tarot/knowledge/:cardId', (req, res) => {
    const { cardId } = req.params;
    const card = TAROT_CARD_BY_ID[cardId];
    const entry = TAROT_MYSTICAL_KB[cardId];
    if (!card || !entry) {
      res.status(404).json({ error: 'Tarot card not found in Mystical Manga Tarot knowledge base.' });
      return;
    }
    res.json({ card, entry });
  });

  app.post('/api/tarot/interpret', async (req, res) => {
    try {
      const body = req.body as Partial<InterpretRequestBody>;
      const area = READING_AREAS.find((a) => a.id === body.areaId);
      if (!area) {
        res.status(400).json({ error: 'Invalid Tarot reading area.' });
        return;
      }

      const question = typeof body.question === 'string' ? body.question.trim() : '';
      if (!question || question.length > 500) {
        res.status(400).json({ error: 'Question must be between 1 and 500 characters.' });
        return;
      }

      const language: Language = body.language === 'en' ? 'en' : 'vi';
      const cards = Array.isArray(body.cards) ? body.cards : [];
      if (cards.length !== area.cardCount) {
        res.status(400).json({
          error: `Area "${area.id}" requires exactly ${area.cardCount} selected card(s).`,
        });
        return;
      }

      const seenCardIds = new Set<string>();
      const resolvedCards: ArchivedCardRecord[] = [];
      const promptLoreBlocks: string[] = [];

      for (let i = 0; i < cards.length; i += 1) {
        const picked = cards[i];
        if (!picked || typeof picked.cardId !== 'string') {
          res.status(400).json({ error: 'Invalid card selection payload.' });
          return;
        }
        if (seenCardIds.has(picked.cardId)) {
          res.status(400).json({ error: 'Duplicate cards are not permitted in the same spread.' });
          return;
        }
        seenCardIds.add(picked.cardId);

        const cardMeta = TAROT_CARD_BY_ID[picked.cardId];
        const kbEntry = TAROT_MYSTICAL_KB[picked.cardId];
        if (!cardMeta || !kbEntry) {
          res.status(400).json({ error: `Unknown Tarot card ID: ${picked.cardId}` });
          return;
        }

        const orientation: Orientation =
          picked.orientation === 'reversed' ? 'reversed' : 'upright';
        const defaultPos =
          language === 'vi' ? area.positionsVi[i] : area.positionsEn[i];
        const positionLabel =
          typeof picked.positionLabel === 'string' && picked.positionLabel.trim()
            ? picked.positionLabel.trim().slice(0, 80)
            : defaultPos;

        resolvedCards.push({
          cardId: cardMeta.id,
          cardNameEn: cardMeta.nameEn,
          cardNameVi: cardMeta.nameVi,
          positionIndex: i,
          positionLabel,
          orientation,
          guidebookExcerpt: {
            predictiveMeaningVi: kbEntry.predictiveMeaningVi,
            adviceVi: kbEntry.adviceVi,
            reversedMeaningVi: kbEntry.reversedMeaningVi,
          },
        });

        promptLoreBlocks.push(
          [
            `Position ${i + 1}: ${positionLabel}`,
            `Card: ${cardMeta.romanNumeral} · ${cardMeta.nameEn} (${cardMeta.nameVi}) [cardId=${cardMeta.id}]`,
            `Orientation: ${orientation === 'reversed' ? 'REVERSED (Xoay ngược)' : 'UPRIGHT (Xuôi)'}`,
            `Arcana/Suit Context: ${kbEntry.suitIntroVi}`,
            kbEntry.storyVi ? `Archetypal Story (Fool's Journey): ${kbEntry.storyVi}` : '',
            `Guidebook Predictive Meaning (Nghĩa tiên đoán): ${kbEntry.predictiveMeaningVi}`,
            `Guidebook Advice (Lời khuyên): ${kbEntry.adviceVi}`,
            `Guidebook Reversed Meaning / Reflection (Nếu bài xoay ngược / Nghĩa ngược): ${kbEntry.reversedMeaningVi}`,
            `Source Reference: Mystical Manga Tarot (${kbEntry.sourcePages})`,
          ]
            .filter(Boolean)
            .join('\n'),
        );
      }

      const ai = getGeminiClient();
      const targetLangInstruction =
        language === 'vi'
          ? 'Write the entire response in rich, natural, literary Vietnamese (matching the Mystical Manga Tarot guidebook tone), while keeping card titles recognizable.'
          : 'Write the entire response in clear, refined English, accurately translating and citing the Vietnamese Mystical Manga Tarot guidebook passages provided below.';

      const systemInstruction = [
        'You are the Astral Grimoire Tarot Reader, interpreting spreads strictly through the supplied Mystical Manga Tarot (Rann & Barbara Moore) guidebook knowledge base.',
        MYSTICAL_MANGA_PREFACE_VI,
        targetLangInstruction,
        'Rules:',
        '1. Ground every card insight directly in the retrieved guidebook passages (predictiveMeaning, advice, and specifically reversedMeaning when the card orientation is REVERSED).',
        '2. Never invent contradictory card meanings or ignore reversed orientation.',
        '3. Connect the cards cohesively across their spread positions to answer the seeker’s specific question with practical, empathetic clarity.',
        '4. For each cardInsight, preserve the exact cardId and orientation passed in the prompt.',
      ].join('\n\n');

      const userPrompt = [
        `Reading Area: ${language === 'vi' ? area.nameVi : area.nameEn} (${area.cost} Star Dust)`,
        `Seeker's Question: "${question}"`,
        '',
        'Retrieved Mystical Manga Tarot Knowledge Base Entries:',
        promptLoreBlocks.join('\n\n---\n\n'),
      ].join('\n');

      let response;
      const maxAttempts = 3;
      let lastErr: unknown;
      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: userPrompt,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  overview: {
                    type: Type.STRING,
                    description:
                      'A focused 2-3 sentence opening summarizing the energetic theme of the spread relative to the question.',
                  },
                  cardInsights: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        cardId: { type: Type.STRING },
                        positionLabel: { type: Type.STRING },
                        orientation: { type: Type.STRING },
                        insight: {
                          type: Type.STRING,
                          description:
                            'Detailed position-specific interpretation grounded in the card orientation and retrieved guidebook text.',
                        },
                        guidebookCitation: {
                          type: Type.STRING,
                          description:
                            'Concise reference/quote from the Mystical Manga Tarot guidebook entry supporting this insight.',
                        },
                      },
                      required: [
                        'cardId',
                        'positionLabel',
                        'orientation',
                        'insight',
                        'guidebookCitation',
                      ],
                    },
                  },
                  synthesis: {
                    type: Type.STRING,
                    description:
                      'Cohesive narrative weaving all selected cards together to answer the seeker’s question.',
                  },
                  guidance: {
                    type: Type.STRING,
                    description:
                      'Concrete, actionable counsel and reflective takeaway grounded in the Advice passages of the drawn cards.',
                  },
                },
                required: ['overview', 'cardInsights', 'synthesis', 'guidance'],
              },
            },
          });
          break;
        } catch (err) {
          lastErr = err;
          const msg = err instanceof Error ? err.message : String(err);
          const isTransient =
            msg.includes('503') ||
            msg.includes('UNAVAILABLE') ||
            msg.includes('high demand') ||
            msg.includes('DEADLINE_EXCEEDED');
          if (!isTransient || attempt === maxAttempts) {
            throw err;
          }
          await new Promise((r) => setTimeout(r, attempt * 1200));
        }
      }
      if (!response) {
        throw lastErr ?? new Error('Gemini API did not return a response.');
      }

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Gemini returned an empty interpretation response.' });
        return;
      }

      const parsed = JSON.parse(rawText) as TarotInterpretation;

      // Normalize cardInsights order and ensure strict field bounds
      const normalizedInsights = resolvedCards.map((rc) => {
        const matched = parsed.cardInsights?.find((ci) => ci.cardId === rc.cardId);
        return {
          cardId: rc.cardId,
          positionLabel: rc.positionLabel,
          orientation: rc.orientation,
          insight: (matched?.insight || '').slice(0, 3500),
          guidebookCitation: (
            matched?.guidebookCitation || rc.guidebookExcerpt.predictiveMeaningVi
          ).slice(0, 1000),
        };
      });

      const interpretation: TarotInterpretation = {
        overview: (parsed.overview || '').slice(0, 4800),
        synthesis: (parsed.synthesis || '').slice(0, 7800),
        guidance: (parsed.guidance || '').slice(0, 4800),
        cardInsights: normalizedInsights,
      };

      res.json({
        areaId: area.id,
        areaName: language === 'vi' ? area.nameVi : area.nameEn,
        cost: area.cost,
        cards: resolvedCards,
        interpretation,
      });
    } catch (error) {
      console.error('Tarot interpretation error:', error);
      const rawMessage = error instanceof Error ? error.message : 'Failed to generate Tarot interpretation.';
      let cleanMessage = rawMessage;
      try {
        const parsedErr = JSON.parse(rawMessage);
        if (parsedErr?.error?.message) {
          cleanMessage = parsedErr.error.message;
        }
      } catch {
        // Use rawMessage if not JSON-wrapped
      }
      const status =
        rawMessage.includes('PERMISSION_DENIED') || rawMessage.includes('API_KEY_INVALID')
          ? 403
          : rawMessage.includes('RESOURCE_EXHAUSTED')
            ? 429
            : rawMessage.includes('UNAVAILABLE') || rawMessage.includes('503')
              ? 503
              : 500;
      res.status(status).json({ error: cleanMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Astral Grimoire server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
