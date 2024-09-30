// useSocket.ts

import { useEffect, useState } from 'react';
import { useSocketContext } from '../views/provider/SocketContext';

const useSocket = () => {
  const socket = useSocketContext();
  const [messages, setMessages] = useState<string[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('likeUpdate', (data: { postId: string; like: number }) => {
      setLikes((prevLikes) => ({
        ...prevLikes,
        [data.postId]: data.like,
      }));
    });

    socket.on('connect_error', (err: any) => {
      setError(`Connection error: ${err.message}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      // không cần ngắt kết nối ở đây, vì socket được quản lý bởi context
    };
  }, [socket]);

  const sendMessage = (message: string) => {
    socket?.emit('message', message);
  };

  const sendLike = async (postId: string, rc_token: string, cookie: string) => {
    await socket?.emit('like', { postId, rc_token, cookie });
  };

  return { likes, setLikes, messages, sendMessage, sendLike, error, socket };
};

export default useSocket;
