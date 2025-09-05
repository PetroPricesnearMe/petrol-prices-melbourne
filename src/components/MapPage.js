import React, { useState } from 'react';
import MapboxMap from './MapboxMap';
import MapFallback from './MapFallback';
import DataSourceDebug from './DataSourceDebug';

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map error:', error, errorInfo);
    this.setState({ error: error.message });
  }

  render() {
    if (this.state.hasError) {
      return <MapFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const MapPage = () => {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <>
      <MapErrorBoundary>
        <MapboxMap />
      </MapErrorBoundary>
      
      {/* Debug Panel Toggle */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1001,
          padding: '0.5rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.8rem'
        }}
      >
        {showDebug ? '🔧 Hide Debug' : '🔧 Show Debug'}
      </button>
      
      <DataSourceDebug isVisible={showDebug} />
    </>
  );
};

export default MapPage; 