import React, { useEffect } from 'react';

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
  useEffect(() => {
    // Check if the AdSense script is already loaded
    if (!document.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456'; // Replace with your actual client ID
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push the ad to the adsbygoogle array
    try {
      if (window.adsbygoogle && window.adsbygoogle.push) {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error("Error pushing ad to adsbygoogle:", e);
    }
  }, [slot]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', ...adStyle }}
      data-ad-client="ca-pub-1234567890123456" // Replace with your actual client ID
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    ></ins>
  );
};