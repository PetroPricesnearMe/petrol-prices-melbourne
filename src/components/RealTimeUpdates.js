import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useBaserowSSE from '../hooks/useBaserowSSE';
import './RealTimeUpdates.css';

const RealTimeUpdates = () => {
  const [messages, setMessages] = useState([]);
  const [maxMessages] = useState(10);

  const handleMessage = (data) => {
    setMessages(prev => {
      const newMessages = [
        {
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          data: data
        },
        ...prev
      ];
      
      // Keep only the latest messages
      return newMessages.slice(0, maxMessages);
    });
  };

  const handleError = (error) => {
    console.error('SSE Error:', error);
  };

  const { isConnected, error, connect, disconnect } = useBaserowSSE(handleMessage, handleError);

  return (
    <div className="real-time-updates">
      <div className="connection-status">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="connection-controls">
          <button 
            onClick={connect}
            disabled={isConnected}
            className="btn btn-primary"
          >
            Connect
          </button>
          <button 
            onClick={disconnect}
            disabled={!isConnected}
            className="btn btn-secondary"
          >
            Disconnect
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          className="error-message"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="error-icon">⚠️</span>
          <span>Connection Error: {error.message}</span>
        </motion.div>
      )}

      <div className="messages-container">
        <h3>Real-Time Messages</h3>
        <div className="messages-list">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className="message-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-header">
                  <span className="message-time">{message.timestamp}</span>
                  <span className="message-type">
                    {message.data.type || 'Update'}
                  </span>
                </div>
                <div className="message-content">
                  <pre>{JSON.stringify(message.data, null, 2)}</pre>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {messages.length === 0 && (
            <div className="no-messages">
              <span className="no-messages-icon">📡</span>
              <p>Waiting for real-time updates...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeUpdates; 