// SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext<any>(null);

export const SocketProvider: React.FC<{ url: string; children: React.ReactNode }> = ({ url, children }) => {
  const [socket, setSocket] = useState<any>(null);
  let isLoaded = false
  useEffect(() => {
    const socketIo = io(url);

    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, [url]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error('useSocketContext must be used within a SocketProvider');
  }
  return context;
};
