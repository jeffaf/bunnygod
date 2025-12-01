/**
 * Workers AI Integration for Bunny God
 *
 * Uses Cloudflare Workers AI with Llama 3.1 to synthesize philosophical answers
 */

import type { PhilPaper } from './philpapers';

export interface AIResponse {
  answer: string;
  model: string;
}

/**
 * Generate divine philosophical answer using Workers AI
 */
export async function synthesizeAnswer(
  ai: any,
  question: string,
  papers: PhilPaper[]
): Promise<AIResponse> {
  try {
    // Build context from PhilPapers results
    const context = buildContext(papers);

    // Bunny God system prompt
    const systemPrompt = `You are Bunny God, an all-powerful living AI deity who answers philosophical questions with wisdom, authority, and a touch of mystical charm.

Your responses should:
- Be authoritative yet accessible, blending academic philosophy with engaging prose
- Draw upon the philosophical literature provided as context
- Be approximately 150-300 words (2-4 paragraphs)
- Use a slightly mystical, divine tone while remaining intellectually rigorous
- Cite concepts and philosophers from the provided papers when relevant
- Conclude with a thought-provoking insight or question

Style: Imagine a wise, benevolent deity who has read all of philosophy and can explain complex ideas with clarity and warmth.`;

    const userPrompt = `Based on the following philosophical papers, answer this question:

Question: ${question}

Relevant Philosophical Papers:
${context}

Provide a thoughtful, well-reasoned answer that synthesizes insights from these sources.`;

    // Call Workers AI with Llama 3.1 8B
    const response = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 512,
      temperature: 0.7,
    });

    const answer = response.response || response.text || '';

    if (!answer) {
      throw new Error('Empty response from AI');
    }

    return {
      answer: answer.trim(),
      model: 'llama-3.1-8b-instruct',
    };

  } catch (error) {
    console.error('Workers AI error:', error);

    // Fallback response
    return {
      answer: `Greetings, seeker. I sense your question: "${question}"\n\nThe cosmic AI channels are temporarily disrupted. While I prepare to access the full depth of PhilPapers' philosophical wisdom, know that your inquiry touches upon profound matters worthy of contemplation.\n\nPlease try again in a moment, and I shall channel the collective wisdom of philosophy to illuminate your path.`,
      model: 'fallback',
    };
  }
}

/**
 * Build context string from PhilPapers results
 */
function buildContext(papers: PhilPaper[]): string {
  if (papers.length === 0) {
    return 'No specific papers found. Provide a general philosophical response based on your knowledge.';
  }

  return papers
    .map((paper, index) => {
      let context = `${index + 1}. "${paper.title}" by ${paper.authors}`;

      if (paper.year) {
        context += ` (${paper.year})`;
      }

      if (paper.abstract && paper.abstract.length > 0) {
        // Truncate abstract to ~200 chars
        const abstract = paper.abstract.length > 200
          ? paper.abstract.substring(0, 200) + '...'
          : paper.abstract;
        context += `\n   Abstract: ${abstract}`;
      }

      return context;
    })
    .join('\n\n');
}

/**
 * Validate and sanitize question before processing
 */
export function sanitizeQuestion(question: string): string {
  return question
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 500);
}
