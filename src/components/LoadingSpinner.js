import React, { useState, useEffect } from 'react';
// CSS imported in pages/_app.js for Next.js compatibility

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "medium", 
  showTips = false,
  fullScreen = false,
  timeout = 10000, // 10 seconds default timeout
  onTimeout = null // Optional timeout callback
}) => {
  const [timedOut, setTimedOut] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const tips = [
    "💡 Compare prices across 250+ petrol stations",
    "🗺️ Use our interactive map to find nearby stations",
    "⛽ Check real-time fuel prices before you drive",
    "📱 Our site works great on mobile devices",
    "🔄 Prices update automatically throughout the day"
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  // Track elapsed time and timeout
  useEffect(() => {
    console.log('⏱️ LoadingSpinner mounted, starting timeout timer');
    const startTime = Date.now();

    // Update elapsed time every 100ms
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
    }, 100);

    // Set timeout
    const timeoutId = setTimeout(() => {
      console.error('⏰ LoadingSpinner TIMEOUT reached after', timeout, 'ms');
      console.error('📊 Current message:', message);
      console.error('🔍 Check if data fetch is stuck or failing silently');
      setTimedOut(true);
      if (onTimeout) {
        onTimeout();
      }
    }, timeout);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
      console.log('✅ LoadingSpinner unmounted after', Date.now() - startTime, 'ms');
    };
  }, [timeout, onTimeout, message]);

  const containerClass = ['loading-container', fullScreen && 'fullscreen', size].filter(Boolean).join(' ');

  // Show timeout message if timed out
  if (timedOut) {
    return (
      <div className={containerClass}>
        <div className="loading-content error-state">
          <div className="error-icon">⚠️</div>
          
          <div className="loading-message">
            <h3>Loading is taking longer than expected</h3>
            <p className="loading-tip error-tip">
              This might be due to a slow network connection or server issues.
            </p>
          </div>
          
          <div className="error-actions">
            <button 
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <button 
              className="home-button"
              onClick={() => window.location.href = '/'}
            >
              Go to Homepage
            </button>
          </div>

          <p className="timeout-message">
            Timed out after {(timeout / 1000).toFixed(0)} seconds
          </p>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min((elapsedTime / timeout) * 100, 100);

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
          <p className="elapsed-time">
            {(elapsedTime / 1000).toFixed(1)}s
          </p>
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
