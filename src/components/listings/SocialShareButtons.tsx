'use client';

import { useCallback, useState } from 'react';
import { Check, Copy, Facebook, Link as LinkIcon, Share2, Twitter } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

const sharePlatforms = [
  {
    id: 'facebook',
    label: 'Share on Facebook',
    icon: Facebook,
    buildUrl: (shareUrl: string, shareTitle: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(
        shareTitle
      )}`,
  },
  {
    id: 'twitter',
    label: 'Share on X (Twitter)',
    icon: Twitter,
    buildUrl: (shareUrl: string, shareTitle: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
  },
  {
    id: 'copy',
    label: 'Copy link',
    icon: Copy,
    buildUrl: () => '',
  },
];

export function SocialShareButtons({ url, title, description }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareNative = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return false;
    try {
      await navigator.share({
        url,
        title,
        text: description,
      });
      return true;
    } catch {
      return false;
    }
  }, [url, title, description]);

  const handleShare = useCallback(
    async (platformId: string, buildUrl: (shareUrl: string, shareTitle: string) => string) => {
      if (platformId === 'copy') {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      const shared = await shareNative();
      if (shared) return;

      const shareLink = buildUrl(url, title);
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    },
    [shareNative, url, title]
  );

  return (
    <div className="flex flex-col items-stretch gap-3 rounded-3xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
        <Share2 className="h-4 w-4" aria-hidden="true" />
        <span>Share Melbourne listings</span>
      </div>

      <div className="flex flex-col gap-2">
        {sharePlatforms.map(({ id, label, icon: Icon, buildUrl }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleShare(id, buildUrl)}
            className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary-200 hover:bg-primary-50/50 dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10"
          >
            <span className="inline-flex items-center gap-2">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </span>
            {id === 'copy' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-300">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <LinkIcon className="h-4 w-4" aria-hidden="true" />
                    Copy
                  </>
                )}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SocialShareButtons;

