import type { MetaFunction } from '@remix-run/node';
import { Button } from '@nextui-org/react';
import { signal, useSignal } from '@preact/signals-react';
import { useEffect, useState } from 'react';

let socket: WebSocket;

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export default function Index() {
  const [msg, setMsg] = useState('');
  const [msgs, setMsgs] = useState<string[]>([]);
  const [num, setNum] = useState<number>(0);

  useEffect(() => {
    if (!socket) {
      socket = new WebSocket('ws://localhost:3001');

      socket.addEventListener('open', (ev) => {
        console.log(ev, 'ev');
      });

      socket.addEventListener('message', (ev) => {
        const eventData = JSON.parse(ev.data);
        if (eventData.event === 'updated_antrian') {
          setNum(eventData.data.num);
        }
      });
    }
  }, []);

  const handleAntrian = () => {
    socket.send(
      JSON.stringify({
        event: 'register',
        data: {
          name: 'Faris',
        },
      })
    );
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <p>Jumlah Antrian: {num}</p>
      <button onClick={handleAntrian}>Daftar Antrian</button>
      <button>Keluar Antrian</button>

      {/* <input type="text" onChange={(e) => setMsg(e.target.value)} value={msg} />
      <button onClick={handleClick}>Send</button> */}

      {msgs.map((msg) => (
        <div>{msg}</div>
      ))}
    </div>
  );
}
