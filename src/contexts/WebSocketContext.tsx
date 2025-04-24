import React, { createContext, useContext, useEffect, useState } from 'react';
import { websocketService } from '@/services/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  connect: (url: string) => void;
  disconnect: () => void;
  send: (message: any) => void;
  subscribe: (type: string, handler: (data: any) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };

    // Subscribe to connection status changes
    websocketService.subscribe('connection_status', handleConnectionChange);

    return () => {
      websocketService.disconnect();
    };
  }, []);

  const connect = (url: string) => {
    websocketService.connect(url);
  };

  const disconnect = () => {
    websocketService.disconnect();
  };

  const send = (message: any) => {
    websocketService.send(message);
  };

  const subscribe = (type: string, handler: (data: any) => void) => {
    return websocketService.subscribe(type, handler);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, connect, disconnect, send, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}; 