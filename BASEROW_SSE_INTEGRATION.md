# Baserow SSE Integration

## Overview
This document explains how to use the Server-Sent Events (SSE) integration with Baserow for real-time updates in your React application.

## Configuration

### SSE Endpoint
The SSE endpoint has been added to the configuration:
```javascript
baserow: {
  // ... existing config
  sseUrl: 'https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse'
}
```

## Usage

### 1. Using the React Hook

The `useBaserowSSE` hook provides an easy way to connect to the SSE endpoint:

```javascript
import useBaserowSSE from '../hooks/useBaserowSSE';

const MyComponent = () => {
  const handleMessage = (data) => {
    console.log('Received SSE message:', data);
    // Handle the real-time update
  };

  const handleError = (error) => {
    console.error('SSE Error:', error);
  };

  const { isConnected, lastMessage, error, connect, disconnect } = useBaserowSSE(
    handleMessage,
    handleError
  );

  return (
    <div>
      <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {lastMessage && <pre>{JSON.stringify(lastMessage, null, 2)}</pre>}
    </div>
  );
};
```

### 2. Direct SSE Connection

You can also use the `baserowSSE` utility directly:

```javascript
import { baserowSSE } from '../config';

const eventSource = baserowSSE.connect(
  (data) => {
    console.log('Message received:', data);
  },
  (error) => {
    console.error('Connection error:', error);
  }
);

// Later, disconnect
baserowSSE.disconnect(eventSource);
```

### 3. Real-Time Updates Component

A complete example component is available at `/real-time` route that demonstrates:
- Connection status management
- Message display with timestamps
- Error handling
- Manual connect/disconnect controls

## Features

### Automatic Connection Management
- Auto-connects on component mount
- Auto-disconnects on component unmount
- Automatic reconnection on errors

### Message Handling
- Parses JSON messages automatically
- Provides timestamps for each message
- Maintains a history of recent messages

### Error Handling
- Graceful error handling with user feedback
- Automatic retry logic
- Connection status indicators

## Environment Variables

You can configure the SSE endpoint using environment variables:

```bash
REACT_APP_BASEROW_SSE_URL=https://api.baserow.io/mcp/ta1A1XNRrNHFLKV16tV3I0cSdkIzm9bE/sse
```

## Security

The SSE connection uses the same authentication token as the REST API:
- Token-based authentication
- Secure HTTPS connection
- Proper error handling for authentication failures

## Browser Support

Server-Sent Events are supported in all modern browsers:
- Chrome 6+
- Firefox 6+
- Safari 5+
- Edge 12+

## Troubleshooting

### Common Issues

1. **Connection Fails**
   - Check if the SSE endpoint is accessible
   - Verify the authentication token is valid
   - Check browser console for CORS errors

2. **Messages Not Received**
   - Ensure the SSE endpoint is sending data
   - Check the message format is valid JSON
   - Verify the event handlers are properly set up

3. **Connection Drops**
   - The hook automatically handles reconnection
   - Check network stability
   - Verify server-side SSE implementation

### Debug Mode

Enable debug logging by checking the browser console for:
- Connection status messages
- Message parsing logs
- Error details

## Example Integration

Here's how to integrate SSE updates into your existing components:

```javascript
import useBaserowSSE from '../hooks/useBaserowSSE';

const MapPage = () => {
  const [stations, setStations] = useState([]);

  const handleStationUpdate = (data) => {
    if (data.type === 'station_update') {
      // Update the stations list with new data
      setStations(prev => {
        const updated = prev.map(station => 
          station.id === data.station_id ? { ...station, ...data.changes } : station
        );
        return updated;
      });
    }
  };

  const { isConnected } = useBaserowSSE(handleStationUpdate);

  return (
    <div>
      {isConnected && <div className="live-indicator">🟢 Live Updates</div>}
      {/* Your existing map component */}
    </div>
  );
};
```

## Next Steps

1. **Customize Message Handling**: Implement specific logic for different message types
2. **Add Real-time Features**: Use SSE for live fuel price updates, station status changes
3. **Optimize Performance**: Implement message filtering and throttling
4. **Add Analytics**: Track connection quality and message frequency 