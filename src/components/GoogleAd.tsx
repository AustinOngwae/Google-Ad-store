import React, { useEffect, useState } from 'react';
import { AdSkeleton } from './AdSkeleton'; // Import the new skeleton component

interface GoogleAdProps {
  slot: string;
  format?: string;
  responsive?: string;
  adStyle?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const GoogleAd: React.FC<GoogleAdProps> = ({ slot, format = 'auto', responsive = 'true', adStyle }) => {
  const [isLoading, setIsLoading] = useState(true);
  const adContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAdScript = () => {
      if (!document.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
        const script = document.createElement('script');
        // IMPORTANT: Replace 'ca-pub-1234567890123456' with your actual Google AdSense client ID.
        // Ads will not display until this is correctly configured and your AdSense account is approved.
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    };

    loadAdScript();

    // Push the ad to the adsbygoogle array and then hide the skeleton
    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle && window.adsbygoogle.push) {
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error("Error pushing ad to adsbygoogle:", e);
      } finally {
        // Hide skeleton after a delay, assuming ad has loaded or failed
        setIsLoading(false);
      }
    }, 2000); // Show skeleton for 2 seconds

    return () => clearTimeout(timer);
  }, [slot]);

  // Extract width and height from adStyle, providing defaults
  const { width = '300px', height = '250px' } = adStyle || {};

  return (
    <div ref={adContainerRef} style={{ width, height, position: 'relative' }}>
      {isLoading && <AdSkeleton width={width as string} height={height as string} />}
      <ins
        className="adsbygoogle"
        style={{ display: isLoading ? 'none' : 'block', width, height, ...adStyle }} // Hide ad while loading
        data-ad-client="ca-pub-1234567890123456"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};