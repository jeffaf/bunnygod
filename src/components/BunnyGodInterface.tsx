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
      // Determine API endpoint
      const apiUrl = import.meta.env.PUBLIC_API_URL ||
                     'https://bunnygod-api.jeffbarron.workers.dev';

      // Call Bunny God API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json() as {
        answer: string;
        sources?: Array<{ title: string; authors: string; url: string; }>;
      };

      setAnswer({
        text: data.answer,
        sources: data.sources || [],
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
