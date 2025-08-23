import React from 'react';
import MapboxMap from './MapboxMap';
import MapFallback from './MapFallback';

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
  return (
    <MapErrorBoundary>
      <MapboxMap />
    </MapErrorBoundary>
  );
};

export default MapPage; 