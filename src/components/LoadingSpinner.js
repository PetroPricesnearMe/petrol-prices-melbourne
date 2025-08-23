import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "medium", 
  showTips = false,
  fullScreen = false 
}) => {
  const tips = [
    "💡 Compare prices across 250+ petrol stations",
    "🗺️ Use our interactive map to find nearby stations",
    "⛽ Check real-time fuel prices before you drive",
    "📱 Our site works great on mobile devices",
    "🔄 Prices update automatically throughout the day"
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const containerClass = `loading-container ${fullScreen ? 'fullscreen' : ''} ${size}`;

  return (
    <div className={containerClass}>
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="fuel-icon">⛽</div>
        </div>
        
        <div className="loading-message">
          <h3>{message}</h3>
          {showTips && (
            <p className="loading-tip">{randomTip}</p>
          )}
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
