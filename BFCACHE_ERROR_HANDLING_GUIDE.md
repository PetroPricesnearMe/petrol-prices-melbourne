# Chrome Extension BFCache Error Handling Guide

## Problem Description

The error `Unchecked runtime.lastError: The page keeping the extension port is moved into back/forward cache, so the message channel is closed.` occurs when:

1. A Chrome extension has an open message port to a web page
2. The user navigates away from the page (back button, new tab, etc.)
3. Chrome moves the page into the back/forward cache (bfcache) for performance
4. The message channel gets closed, causing `runtime.lastError`

## Solution Overview

This guide provides a comprehensive solution to handle bfcache-related message channel closures gracefully.

## Files Created

### 1. `src/utils/extensionMessageHandler.js`

- Core utility for handling Chrome extension message ports
- Automatic reconnection with exponential backoff
- Bfcache event detection and handling
- Message queuing when disconnected
- Error handling for `runtime.lastError`

### 2. `src/hooks/useExtensionMessage.js`

- React hooks for easy integration
- `useExtensionMessage` - Main hook for extension communication
- `useExtensionMessageType` - Hook for specific message types
- `useBfcacheHandler` - Hook for bfcache-specific events

### 3. `src/components/ExtensionErrorBoundary.js`

- Error boundary component for extension errors
- Special handling for bfcache errors
- User-friendly error messages
- Automatic reconnection attempts

## Usage Examples

### Basic Extension Communication

```javascript
import { useExtensionMessage } from '@/hooks/useExtensionMessage';

function MyComponent() {
  const { isConnected, sendMessage, lastMessage, lastError, reconnect } =
    useExtensionMessage();

  const handleSendData = () => {
    sendMessage({
      type: 'data',
      payload: { key: 'value' },
    });
  };

  return (
    <div>
      <p>Extension Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      {lastError && <p>Error: {lastError}</p>}
      <button onClick={handleSendData}>Send Data</button>
      <button onClick={reconnect}>Reconnect</button>
    </div>
  );
}
```

### Handling Specific Message Types

```javascript
import { useExtensionMessageType } from '@/hooks/useExtensionMessage';

function PriceMonitor() {
  const handlePriceUpdate = (message) => {
    console.log('Price updated:', message.data);
  };

  const extension = useExtensionMessageType('price_update', handlePriceUpdate);

  return (
    <div>
      <p>
        Price Monitor Status: {extension.isConnected ? 'Active' : 'Inactive'}
      </p>
    </div>
  );
}
```

### BFCache Event Handling

```javascript
import { useBfcacheHandler } from '@/hooks/useExtensionMessage';

function App() {
  const { isInBfcache, bfcacheEvents } = useBfcacheHandler({
    onBfcacheEntry: (event) => {
      console.log('Page entering bfcache:', event);
    },
    onBfcacheRestore: (event) => {
      console.log('Page restored from bfcache:', event);
    },
  });

  return (
    <div>
      <p>BFCache Status: {isInBfcache ? 'In Cache' : 'Active'}</p>
      <p>Events: {bfcacheEvents.length}</p>
    </div>
  );
}
```

### Using the Error Boundary

```javascript
import ExtensionErrorBoundary from '@/components/ExtensionErrorBoundary';

function App() {
  return (
    <ExtensionErrorBoundary>
      <YourAppContent />
    </ExtensionErrorBoundary>
  );
}
```

## Key Features

### 1. Automatic Error Handling

- Detects `runtime.lastError` related to bfcache
- Handles message channel closures gracefully
- Provides user-friendly error messages

### 2. Reconnection Logic

- Exponential backoff for reconnection attempts
- Maximum retry limit to prevent infinite loops
- Automatic reconnection on page visibility change

### 3. Message Queuing

- Queues messages when disconnected
- Processes queued messages on reconnection
- Prevents message loss during disconnection

### 4. BFCache Detection

- Listens for `pagehide` and `pageshow` events
- Detects when pages enter/exit bfcache
- Handles restoration from bfcache

### 5. React Integration

- Custom hooks for easy use in React components
- Error boundary for global error handling
- TypeScript support (if using TypeScript)

## Error Prevention

### 1. Check Connection Status

```javascript
const { isConnected } = useExtensionMessage();

if (isConnected) {
  sendMessage(data);
} else {
  // Handle offline case
  console.log('Extension not connected');
}
```

### 2. Handle Errors Gracefully

```javascript
const { lastError, reconnect } = useExtensionMessage();

useEffect(() => {
  if (lastError) {
    console.error('Extension error:', lastError);
    // Attempt reconnection or show user message
    reconnect();
  }
}, [lastError, reconnect]);
```

### 3. Listen for Disconnection

```javascript
const { addListener } = useExtensionMessage();

useEffect(() => {
  const handleDisconnection = (data) => {
    if (data.reason === 'bfcache') {
      console.log('Disconnected due to bfcache');
    }
  };

  addListener('disconnected', handleDisconnection);
}, [addListener]);
```

## Testing

### 1. Simulate BFCache

- Navigate to your page
- Open DevTools → Application → Storage
- Click "Back" button to trigger bfcache
- Check console for error handling

### 2. Test Reconnection

- Disconnect extension manually
- Verify error handling works
- Check reconnection attempts
- Verify message queuing

### 3. Test Error Boundary

- Force an extension error
- Verify error boundary catches it
- Test retry and ignore buttons

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Partial support (no bfcache)
- ✅ Safari: Partial support (different bfcache behavior)
- ⚠️ IE11: Not supported

## Performance Considerations

1. **Message Queuing**: Limits queue size to prevent memory issues
2. **Reconnection Delays**: Uses exponential backoff to prevent spam
3. **Event Listeners**: Properly cleaned up to prevent memory leaks
4. **Status Updates**: Throttled to prevent excessive updates

## Troubleshooting

### Common Issues

1. **Extension Not Detected**
   - Check if `chrome.runtime` is available
   - Verify extension is installed and enabled
   - Check manifest permissions

2. **Reconnection Fails**
   - Check extension background script
   - Verify message port setup
   - Check for conflicting extensions

3. **Messages Not Received**
   - Verify message format
   - Check extension message handlers
   - Verify port connection

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('extension-debug', 'true');
```

## Best Practices

1. **Always Check Connection**: Before sending messages
2. **Handle Errors**: Provide fallbacks for offline scenarios
3. **Queue Messages**: Don't lose data during disconnection
4. **Clean Up**: Remove event listeners on unmount
5. **User Feedback**: Inform users about connection status
6. **Graceful Degradation**: App should work without extension

## Migration Guide

If you have existing extension code:

1. **Replace Direct Chrome API Calls**:

   ```javascript
   // Old way
   chrome.runtime.sendMessage(data);

   // New way
   const { sendMessage } = useExtensionMessage();
   sendMessage(data);
   ```

2. **Add Error Handling**:

   ```javascript
   // Old way
   chrome.runtime.onMessage.addListener(callback);

   // New way
   const { addListener } = useExtensionMessage();
   addListener('message', callback);
   ```

3. **Wrap with Error Boundary**:
   ```javascript
   // Add to your app root
   <ExtensionErrorBoundary>
     <App />
   </ExtensionErrorBoundary>
   ```

## Support

For issues or questions:

1. Check browser console for error messages
2. Verify extension permissions
3. Test in incognito mode
4. Check extension background script logs

This solution provides robust handling of Chrome extension bfcache errors while maintaining a good user experience.
