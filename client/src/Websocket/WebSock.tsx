import React, { FC, useRef, useState } from 'react';
import { Message, MessageCon } from '../types/webSocket';

const WebSock: FC = () => {
    const [message, setMessage] = useState<Message[]>([]);
    const [value, setValue] = useState<string>('');
    const socket = useRef<WebSocket | null>();
    const [connected, setConnected] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');

    function connect() {
        socket.current = new WebSocket('ws://localhost:5000')

        socket.current.onopen = () => {
            setConnected(true)
            const message: MessageCon = {
                event: 'connection',
                username,
                id: Date.now()
            }
            socket.current?.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessage(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('The socket is closed');
            setConnected(false);
        }
        socket.current.onerror = () => {
            console.log('A socket error occurred');
            setConnected(false);
        }
    }

    const sendMessage = async () => {
        const message: Message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current?.send(JSON.stringify(message));
        setValue('')
    }

    if (!connected) {
        return (
            <div className='center'>
                <div className='form'>
                    <input 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        type="text" 
                        placeholder='Enter your name'/>
                    <button 
                        onClick={connect}
                    >
                        Sign in
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='center'>
            <div>
                <div className='form'>
                    <input 
                        value={value}
                        onChange={e => setValue(e.target.value)} 
                        type='text'
                        placeholder='Enter your message'
                        />
                    <button 
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
                <div className='messages'>
                    {message.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? 
                                <div className='connection-message'>
                                    User {mess.username} connected
                                </div>
                                : 
                                <div className='message'>
                                    {mess.username}: {mess.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSock;