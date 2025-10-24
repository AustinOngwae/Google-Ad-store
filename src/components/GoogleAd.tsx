import React, { useEffect } from 'react';

interface GoogleAdProps {
  client: string;
  slot: string;
  className?: string;
  style?: React.CSSProperties;
  format?: string;
  fullWidthResponsive?: boolean;
}

const GoogleAd: React.FC<GoogleAdProps> = ({ 
  client, 
  slot, 
  className = "adsbygoogle", 
  style = { display: 'block' },
  format = "auto",
  fullWidthResponsive = true
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [slot]); // Re-run when the slot changes, just in case

  return (
    <ins
      className={className}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive.toString()}
    ></ins>
  );
};

export default GoogleAd;