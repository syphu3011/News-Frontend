// useSocket.ts

import { useEffect, useState } from 'react';
import { useSocketContext } from '../views/provider/SocketContext';
import Cookies from 'js-cookie';
let checkRendered = false
const useSocket = () => {
  const socket = useSocketContext();
  const [messages, setMessages] = useState<string[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const [isChange, setIsChange] = useState<boolean>(false)

  useEffect(() => {
    if (!socket) return;
    // if (socket && checkRendered) return
    // checkRendered = true
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('likeUpdate', (data: { postId: string; like: number }) => {
      setLikes((prevLikes) => {
        return {
          ...prevLikes,
          [data.postId]: data.like
        }
      });

      // const c_js = JSON.parse(Cookies.get('liked') ?? '{}')
      // if (c_js[data.postId] === 'false') {
      //   c_js[data.postId] = 'true'
      // }
      // else {
      //   c_js[data.postId] = 'false'
      // }
      // Cookies.set('liked', JSON.stringify(c_js))
      // setIsChange(!isChange)
    });
    socket.on('likeError', (data: any) => {
      // const c_js = JSON.parse(Cookies.get('liked') ?? '{}')
      // if (c_js[data.postId] === 'false') {
      //   c_js[data.postId] = 'true'
      // }
      // else {
      //   c_js[data.postId] = 'false'
      // }
      // Cookies.set('liked', JSON.stringify(c_js))
      // setIsChange(!isChange)
      alert(data.message)
    })
    socket.on('connect_error', (err: any) => {
      setError(`Connection error: ${err.message}`);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      // không cần ngắt kết nối ở đây, vì socket được quản lý bởi context
    };
  });

  const sendMessage = (message: string) => {
    socket?.emit('message', message);
  };

  const sendLike = async (postId: string, rc_token: string, cookie: string, callback: any) => {
    await socket?.emit('like', { postId, rc_token, cookie }, callback);
  };

  return { likes, setLikes, messages, sendMessage, sendLike, error, socket, isChange };
};

export default useSocket;
