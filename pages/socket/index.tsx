import { useEffect } from 'react';
import io from 'socket.io-client';

let socket: any;

const SocketPage = () => {
  const socketInitiation = async () => {
    socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to socket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });
  }

  useEffect(() => {
    socketInitiation();
    return () => {
      socket.disconnect();
    }
  }, []);

  return (
    <div style={{padding: '10px'}}>
      <h1>Socket Page</h1>
    </div>
  );
}

export default SocketPage;
