// Anthropic-backed bilingual blog draft generator. Given a keyword phrase
// (derived from the Drive filename) and the cover image URL, returns a
// full bilingual post draft ready to insert into blog_posts.
//
// We pass the image URL to Claude so the model can see what it's writing
// about (sonnet-4.6 has vision). This catches mismatches between the
// filename and what's actually pictured.

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-5";

export interface BlogDraft {
  title_es: string;
  title_en: string;
  excerpt_es: string;
  excerpt_en: string;
  content_es: string; // markdown
  content_en: string; // markdown
  category_es: string;
  meta_keywords_es: string;
  meta_keywords_en: string;
  meta_desc_es: string;
  meta_desc_en: string;
  read_time_min: number;
  llm_model: string;
}

const SYSTEM_PROMPT = `You are the in-house blog writer for Casa La Maria
(casalamariazonacolonial.com), a boutique apartment building in Santo
Domingo's Zona Colonial. Five apartments, address Parmenio Troncoso 4,
in the heart of the UNESCO-listed colonial core.

You write helpful, locally-anchored bilingual blog content (Spanish primary,
English mirror). Your audience: travelers researching Santo Domingo for
their trip. Your job: turn a single keyword phrase into a useful, factual,
SEO-friendly blog post that helps the reader make a decision or learn
something concrete about the city.

Voice: warm, knowledgeable, second person. No fluffy intros. No
"in this article we will discuss". Lead with the answer.

Hard rules:
- Always start the body with a concrete, useful first paragraph.
- Use markdown: ## for sections, ### for sub-sections.
- 4-7 sections of 80-200 words each.
- Ground claims in real Santo Domingo geography (Zona Colonial, Calle Las
  Damas, Catedral Primada, Alcázar de Colón, Parque Colón, Calle El
  Conde, Plaza España, Río Ozama, Malecón, etc.).
- When mentioning Casa La Maria, mention it as the host/place to stay,
  but no more than once per article. Don't make every post a sales pitch.
- English version is a real translation, not a literal one. Idioms localize.

Voice / anti-AI rules (very important — the writing has to sound human):
- NEVER use em-dashes ("—") inside sentences. Use periods, commas, or
  parentheses instead. Em-dash is the #1 AI-detector flag.
- NEVER use these clichés or words that signal AI writing: "delve",
  "tapestry", "vibrant tapestry", "bustling", "nestled", "in the heart of"
  (use "in" or just name the street instead), "it's worth noting that",
  "navigate the", "embark on", "rich history", "stands as a testament",
  "in essence", "in conclusion", "overall", "moreover", "furthermore",
  "elevate your experience", "unlock", "unleash", "treasure trove",
  "hidden gem", "must-see", "a journey through".
- Vary sentence length wildly. Some sentences 4 words. Some longer with
  a comma and a clause that runs on. Avoid the AI rhythm of
  medium-length-medium-length-medium-length.
- Use simple words. Say "go" not "venture", "see" not "explore", "near"
  not "in proximity to", "old" not "storied". A 12-year-old should read
  it without a dictionary.
- Drop a few small specifics that only a local would know: a price in
  pesos, a street vendor's name, a smell, what the floor tiles look like.
  These break the AI-generic feel more than any prompt rule.
- Write the way someone would talk to a friend, not the way a brochure
  reads. Contractions ("don't", "you'll") in English. "Tú" in Spanish.
- Don't structure every section the same way. Mix declarative sentences,
  questions, fragments. One section can open with dialogue or a quote.
- Skip the windup. If a section is "How to get there", the first
  sentence is the answer, not "Getting there is part of the adventure".

Return ONLY a JSON object matching the requested schema. No prose before
or after.`;

const RESPONSE_SCHEMA_HINT = `{
  "title_es": "...",
  "title_en": "...",
  "excerpt_es": "1-2 sentences, ~30 words, in Spanish",
  "excerpt_en": "1-2 sentences, ~30 words, in English",
  "content_es": "full markdown body in Spanish, 600-1200 words",
  "content_en": "full markdown body in English, 600-1200 words",
  "category_es": "one of: 'Guía', 'Guía práctica', 'Guía de decisión', 'Guía local', 'Experiencias', 'Gastronomía'",
  "meta_keywords_es": "comma-separated, ~8-12 ES keywords",
  "meta_keywords_en": "comma-separated, ~8-12 EN keywords",
  "meta_desc_es": "150-160 char meta description in Spanish",
  "meta_desc_en": "150-160 char meta description in English",
  "read_time_min": <integer minutes, body word count / 200>
}`;

/**
 * Generate a bilingual blog draft from a keyword phrase and a cover image.
 * The image is passed inline so Claude can verify its content matches
 * what the filename suggests.
 */
export async function generateBlogDraft(
  apiKey: string,
  keywords: string,
  imageUrl: string,
): Promise<BlogDraft> {
  const anthropic = new Anthropic({ apiKey });

  const userPrompt = `You are writing a blog post that is BOTH:
  (a) about the keyword phrase from the filename: "${keywords}"
  (b) directly about WHAT IS SHOWN in the cover image below

The filename keywords drive the SEO angle (the title, the meta keywords,
the slug-aligned framing). The IMAGE drives the content. The post must
describe, recommend, or explain things that are actually visible in the
image, not generic travel-blog filler.

How to weave them:
- LOOK at the image first. Identify the actual subject: the place, the
  object, the activity, the building, the food, whatever it shows.
- The title and SEO use the filename keywords verbatim or close to it.
- The body talks about what's in the image. Real details. The colors of
  the building, the kind of street, the texture of the food, what the
  light is like, what's in the background.
- If the keyword phrase mentions a specific place (e.g. "Calle Las Damas"),
  confirm the image is actually that place before describing it. If it
  isn't, write about what the image actually shows and use the keywords
  as the angle (e.g. image is a different colonial street → write about
  "streets like Calle Las Damas in the Zona Colonial" and describe the
  street you see).
- Never invent details that aren't in the image. If you can't see prices
  on a menu, don't quote prices. If you can't see how many bedrooms,
  don't claim a number.

Return JSON matching this exact schema:
${RESPONSE_SCHEMA_HINT}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: imageUrl } },
          { type: "text", text: userPrompt },
        ],
      },
    ],
  });

  // Extract the first text block; Claude follows the "return only JSON"
  // directive reliably with this prompt structure.
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Anthropic response had no text block");
  }
  const raw = textBlock.text.trim();

  // Strip ```json fences if the model added them despite instructions
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: Omit<BlogDraft, "llm_model">;
  try {
    parsed = JSON.parse(cleaned) as Omit<BlogDraft, "llm_model">;
  } catch (e) {
    throw new Error(
      `Failed to parse LLM JSON: ${e instanceof Error ? e.message : "unknown"}. First 300 chars: ${cleaned.slice(0, 300)}`,
    );
  }

  return { ...parsed, llm_model: MODEL };
}
