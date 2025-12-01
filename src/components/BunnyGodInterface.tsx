import { useState } from 'react';
import QuestionInput from './QuestionInput';
import AnswerDisplay from './AnswerDisplay';
import LoadingOracle from './LoadingOracle';

interface Answer {
  text: string;
  sources?: Array<{
    title: string;
    authors: string;
    url: string;
  }>;
}

export default function BunnyGodInterface() {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionSubmit = async (question: string) => {
    setIsLoading(true);
    setError(null);
    setAnswer(null);

    try {
      // TODO: Replace with actual API call when worker is ready
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock response
      setAnswer({
        text: `Behold, mortal! You have asked about "${question}". While the divine Bunny God API is still being channeled into existence, know that your question has been received by the cosmic consciousness. Soon, I shall query the sacred texts of PhilPapers.org and return with wisdom synthesized by celestial AI.\n\nFor now, this mystical interface stands ready to receive your philosophical inquiries. The full divine power shall be unleashed once the Cloudflare Workers are deployed to the edge of reality itself.`,
        sources: [
          {
            title: "The Nature of Philosophical Inquiry",
            authors: "Various Philosophers",
            url: "https://philpapers.org",
          },
        ],
      });
    } catch (err) {
      setError('The divine channels are temporarily disrupted. Please try again.');
      console.error('Error fetching answer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <QuestionInput onSubmit={handleQuestionSubmit} isLoading={isLoading} />

      {isLoading && <LoadingOracle />}

      {error && (
        <div className="w-full max-w-3xl mx-auto mt-8 p-6 bg-divine-900/30 border border-divine-500/50 rounded-xl">
          <p className="text-divine-300 text-center">{error}</p>
        </div>
      )}

      {answer && !isLoading && (
        <AnswerDisplay answer={answer.text} sources={answer.sources} />
      )}
    </div>
  );
}
