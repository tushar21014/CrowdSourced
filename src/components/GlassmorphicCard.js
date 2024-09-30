import React from "react";

const GlassmorphicCard = ({ children, className = "" }) => (
  <div
    className={`backdrop-blur-sm bg-white/10 rounded-xl p-6 shadow-lg ${className}`}
  >
    {children}
  </div>
);

export default GlassmorphicCard;
