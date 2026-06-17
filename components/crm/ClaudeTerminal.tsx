import React, { useEffect, useRef, useState } from 'react';
import { Terminal as TerminalIcon, Wifi, WifiOff, RotateCcw } from 'lucide-react';

const WS_URL = 'ws://localhost:54321';

const ClaudeTerminal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [xtermLoaded, setXtermLoaded] = useState(false);

  const connect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    setError(null);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setError(null);
      // Auto-launch claude on connect
      ws.send(JSON.stringify({ type: 'input', data: 'claude\r' }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'output' && termRef.current) {
          termRef.current.write(msg.data);
        }
      } catch {}
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = () => {
      setConnected(false);
      setError('Cannot connect to terminal server. Make sure the desktop app is running.');
    };
  };

  useEffect(() => {
    let isMounted = true;

    const loadXterm = async () => {
      // Dynamically import xterm so it only loads on this tab
      const { Terminal } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');
      const { WebLinksAddon } = await import('@xterm/addon-web-links');

      if (!isMounted || !containerRef.current) return;

      const term = new Terminal({
        theme: {
          background: '#0a0a0b',
          foreground: '#e4e4e7',
          cursor: '#CD3D35',
          cursorAccent: '#0a0a0b',
          selectionBackground: '#CD3D3540',
          black: '#18181b',
          red: '#CD3D35',
          green: '#4ade80',
          yellow: '#facc15',
          blue: '#60a5fa',
          magenta: '#c084fc',
          cyan: '#22d3ee',
          white: '#e4e4e7',
          brightBlack: '#3f3f46',
          brightRed: '#f87171',
          brightGreen: '#86efac',
          brightYellow: '#fde047',
          brightBlue: '#93c5fd',
          brightMagenta: '#d8b4fe',
          brightCyan: '#67e8f9',
          brightWhite: '#ffffff',
        },
        fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", monospace',
        fontSize: 13,
        lineHeight: 1.4,
        cursorBlink: true,
        allowTransparency: true,
        scrollback: 5000,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());
      term.open(containerRef.current);
      fitAddon.fit();

      termRef.current = term;
      fitAddonRef.current = fitAddon;

      // Forward keyboard input to server
      term.onData((data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'input', data }));
        }
      });

      setXtermLoaded(true);
      connect();
    };

    loadXterm();

    const handleResize = () => {
      if (fitAddonRef.current && termRef.current) {
        fitAddonRef.current.fit();
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const dims = fitAddonRef.current.proposeDimensions();
          if (dims) {
            wsRef.current.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }));
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      wsRef.current?.close();
      termRef.current?.dispose();
    };
  }, []);

  const handleReconnect = () => {
    if (termRef.current) termRef.current.clear();
    connect();
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0b] rounded-2xl border border-white/8 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#040405] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#CD3D35]/15 border border-[#CD3D35]/20 flex items-center justify-center">
            <TerminalIcon size={14} className="text-[#CD3D35]" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-white leading-tight">Claude Terminal</p>
            <p className="text-[10px] text-gray-600 leading-tight">Powered by Claude Code</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-[11px] font-medium ${connected ? 'text-green-400' : 'text-gray-600'}`}>
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connected ? 'Connected' : 'Disconnected'}
          </div>
          <button
            onClick={handleReconnect}
            title="Reconnect"
            className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/8 transition-all"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 text-[12px] text-red-400">
          {error}
        </div>
      )}

      {/* Terminal */}
      <div className="flex-1 p-2 min-h-0">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default ClaudeTerminal;
