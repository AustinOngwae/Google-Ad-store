import React, { useEffect } from 'react';

interface GoogleAdProps {
  client: string;
  slot: string;
  className?: string;
  style?: React.CSSProperties;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  client, 
  slot, 
  className = "adsbygoogle", 
  style = { display: 'block' } 
}) => {
  useEffect(() => {
    try {
      // This is the AdSense script that loads the ads.
      // The `window.adsbygoogle` object is what Google uses to push ads to the ad slots.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  // This is the ad unit itself. Google AdSense will find this element
  // and inject an ad into it.
  return (
    <ins
      className={className}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
    ></ins>
  );
};

export default GoogleAd;