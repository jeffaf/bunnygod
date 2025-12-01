import { useState } from 'react';

interface ShareButtonsProps {
  question: string;
  answer: string;
}

export default function ShareButtons({ question, answer }: ShareButtonsProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'answer' | 'link'>('idle');

  // Generate shareable URL with query parameter
  const generateShareableUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const encodedQuestion = encodeURIComponent(question);
    return `${baseUrl}/?q=${encodedQuestion}`;
  };

  // Copy answer to clipboard
  const copyAnswer = async () => {
    try {
      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(answer);
        setCopyStatus('answer');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } else {
        // Fallback for older browsers or non-HTTPS
        fallbackCopyToClipboard(answer);
        setCopyStatus('answer');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    } catch (err) {
      console.error('Failed to copy answer:', err);
      // Try fallback method
      fallbackCopyToClipboard(answer);
      setCopyStatus('answer');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  // Copy shareable link to clipboard
  const copyLink = async () => {
    const shareableUrl = generateShareableUrl();
    try {
      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareableUrl);
        setCopyStatus('link');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } else {
        // Fallback for older browsers
        fallbackCopyToClipboard(shareableUrl);
        setCopyStatus('link');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    } catch (err) {
      console.error('Failed to copy link:', err);
      fallbackCopyToClipboard(shareableUrl);
      setCopyStatus('link');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  // Fallback copy method for older browsers
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textArea);
  };

  // Share to Twitter
  const shareToTwitter = () => {
    const shareableUrl = generateShareableUrl();
    const truncatedQuestion = question.length > 80 ? question.substring(0, 77) + '...' : question;
    const tweetText = `I asked Bunny God '${truncatedQuestion}' and got divine wisdom! 🐰✨`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareableUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=420');
  };

  // Share to Reddit
  const shareToReddit = () => {
    const shareableUrl = generateShareableUrl();
    const redditTitle = `Bunny God's answer to: ${question}`;
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareableUrl)}&title=${encodeURIComponent(redditTitle)}`;
    window.open(redditUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-8 pt-6 border-t border-cosmic-500/30">
      <h4 className="text-sm font-semibold text-cosmic-300/70 mb-3">
        Share this wisdom
      </h4>

      <div className="flex flex-wrap gap-3">
        {/* Copy Answer Button */}
        <button
          onClick={copyAnswer}
          className="group relative flex items-center gap-2 px-4 py-2 bg-cosmic-800/50 hover:bg-cosmic-700/50 border border-cosmic-500/30 hover:border-cosmic-400/50 rounded-lg text-cosmic-200 hover:text-cosmic-100 transition-all duration-200 shadow-lg shadow-cosmic-900/30 hover:shadow-cosmic-500/20"
          aria-label="Copy answer to clipboard"
        >
          {copyStatus === 'answer' ? (
            <>
              <svg className="w-4 h-4 text-mystic-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-mystic-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm">Copy Answer</span>
            </>
          )}
        </button>

        {/* Copy Link Button */}
        <button
          onClick={copyLink}
          className="group relative flex items-center gap-2 px-4 py-2 bg-mystic-800/50 hover:bg-mystic-700/50 border border-mystic-500/30 hover:border-mystic-400/50 rounded-lg text-mystic-200 hover:text-mystic-100 transition-all duration-200 shadow-lg shadow-mystic-900/30 hover:shadow-mystic-500/20"
          aria-label="Copy shareable link"
        >
          {copyStatus === 'link' ? (
            <>
              <svg className="w-4 h-4 text-cosmic-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-cosmic-400">Link Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-sm">Copy Link</span>
            </>
          )}
        </button>

        {/* Twitter Share Button */}
        <button
          onClick={shareToTwitter}
          className="group relative flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 hover:border-[#1DA1F2]/50 rounded-lg text-[#1DA1F2] hover:text-white transition-all duration-200 shadow-lg shadow-[#1DA1F2]/10 hover:shadow-[#1DA1F2]/20"
          aria-label="Share on Twitter"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          <span className="text-sm">Twitter</span>
        </button>

        {/* Reddit Share Button */}
        <button
          onClick={shareToReddit}
          className="group relative flex items-center gap-2 px-4 py-2 bg-[#FF4500]/20 hover:bg-[#FF4500]/30 border border-[#FF4500]/30 hover:border-[#FF4500]/50 rounded-lg text-[#FF4500] hover:text-white transition-all duration-200 shadow-lg shadow-[#FF4500]/10 hover:shadow-[#FF4500]/20"
          aria-label="Share on Reddit"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
          <span className="text-sm">Reddit</span>
        </button>
      </div>

      {/* Mobile-friendly hint */}
      <p className="mt-3 text-xs text-cosmic-400/50 italic">
        Share Bunny God's divine wisdom with the world
      </p>
    </div>
  );
}
