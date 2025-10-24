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
  const adClient = "ca-pub-3657670648504430"; // Your AdSense client ID

  useEffect(() => {
    // Function to load the AdSense script
    const loadAdSenseScript = () => {
      const existingScript = document.querySelector(`script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}"]`);
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        
        script.onload = () => {
          // Script loaded, now push the ad
          if (window.adsbygoogle && window.adsbygoogle.push) {
            window.adsbygoogle.push({});
            setIsLoading(false); // Hide skeleton once ad is pushed
          }
        };
        script.onerror = (e) => {
          console.error("Error loading AdSense script:", e);
          setIsLoading(false); // Hide skeleton even if script fails
        };
      } else {
        // Script already exists, just push the ad
        if (window.adsbygoogle && window.adsbygoogle.push) {
          window.adsbygoogle.push({});
          setIsLoading(false); // Hide skeleton once ad is pushed
        }
      }
    };

    loadAdSenseScript();

    // Fallback to hide skeleton if ad doesn't load after a longer period
    const fallbackTimer = setTimeout(() => {
      if (isLoading) { // Only hide if still loading
        setIsLoading(false);
        console.warn("Ad loading timed out, hiding skeleton. Check AdSense configuration or ad blockers.");
      }
    }, 5000); // 5 seconds fallback

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [slot]); // Re-run if slot changes

  // Extract width and height from adStyle, providing defaults
  const { width = '300px', height = '250px' } = adStyle || {};

  return (
    <div style={{ width, height, position: 'relative' }}>
      {isLoading && <AdSkeleton width={width as string} height={height as string} />}
      <ins
        className="adsbygoogle"
        style={{ display: isLoading ? 'none' : 'block', width, height, ...adStyle }} // Hide ad while loading
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};