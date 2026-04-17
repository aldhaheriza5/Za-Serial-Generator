import React, { useState, useEffect, useRef } from 'react';
import { HardDrive, RefreshCw, Terminal, Zap, ShieldAlert, Layers, Copy, Check } from 'lucide-react';

export default function App() {
  const [newSerial, setNewSerial] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [serialLength, setSerialLength] = useState(15);
  const [firmware, setFirmware] = useState('ZYTC');
  const [history, setHistory] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  
  const [logs, setLogs] = useState([
    { id: 1, text: 'System initialized.', type: 'info' },
    { id: 2, text: 'Scanning bus for NVMe devices...', type: 'info' },
    { id: 3, text: 'Found target: Samsung SSD 980 1TB', type: 'success' },
    { id: 4, text: 'Ready for operations.', type: 'info' },
  ]);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { id: Date.now() + Math.random(), text, type }]);
  };

  const randomizeFirmware = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFirmware(result);
    addLog(`Firmware revision randomized: ${result}`, 'info');
  };

  const generateSingleSerial = (len) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = len > 0 ? 'S' : '';
    const remaining = Math.max(0, len - (len > 0 ? 1 : 0));
    for (let i = 0; i < remaining; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateSerials = () => {
    const count = Math.min(Math.max(parseInt(quantity) || 1, 1), 100);
    const len = Math.min(Math.max(parseInt(serialLength) || 15, 1), 32);
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push({
        id: Date.now() + Math.random(),
        serial: generateSingleSerial(len),
        timestamp: new Date().toLocaleTimeString()
      });
    }
    
    setHistory(prev => [...results, ...prev].slice(0, 50));
    if (results.length > 0) {
      setNewSerial(results[0].serial);
      randomizeFirmware();
      addLog(`Success: Generated ${results.length} serials (Length: ${len}).`, 'success');
    }
  };

  const copyAllSerials = () => {
    if (history.length === 0) {
      addLog('Error: Repository is empty.', 'error');
      return;
    }
    const text = history.map(item => item.serial).join('\n');
    navigator.clipboard.writeText(text);
    addLog('Success: Copied all serials and firmware revisions to clipboard.', 'success');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApply = () => {
    if (!newSerial) {
      addLog('Error: No serial number specified.', 'error');
      return;
    }

    setIsApplying(true);
    addLog(`Initiating sequence to apply serial: ${newSerial}...`, 'warning');
    
    setTimeout(() => addLog('Accessing Firmware ZYTC...'), 600);
    setTimeout(() => addLog('Bypassing security locks...', 'warning'), 1400);
    setTimeout(() => addLog('Writing new serial blocks...'), 2400);
    setTimeout(() => {
      addLog('Success: Hardware ID updated.', 'success');
      addLog('System requires restart for changes to fully propagate.', 'warning');
      setIsApplying(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-400 font-sans p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Dynamic Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-green/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-6xl glass-panel rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 flex flex-col border border-white/5">
        
        {/* Header Section */}
        <header className="bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
                <div className="absolute inset-0 bg-cyber-blue/20 blur-md rounded-lg"></div>
                <div className="relative p-2.5 bg-[#121215] rounded-lg border border-white/10 shadow-inner">
                  <Zap className="w-5 h-5 text-cyber-blue" />
                </div>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Za <span className="text-cyber-blue font-light not-italic tracking-wider ml-1">Serial Generator</span></h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-mono mt-0.5">Hardware Abstraction Layer // v4.2.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-black/40 px-4 py-2 rounded-lg border border-white/5 shadow-inner">
              <div className="w-1.5 h-1.5 bg-cyber-green rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[10px] font-mono text-cyber-green uppercase tracking-[0.2em] font-bold">Encrypted</span>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row min-h-[600px] divide-y lg:divide-y-0 lg:divide-x divide-white/5">
          
          {/* Main Workspace */}
          <div className="flex-1 p-8 md:p-10 space-y-10">
            
            {/* System Status Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                    { label: 'Target Device', value: 'Samsung 980 1TB', icon: HardDrive, color: 'text-white' },
                    { 
                        label: 'Firmware Revision', 
                        value: firmware, 
                        icon: Terminal, 
                        color: 'text-cyber-blue',
                        action: randomizeFirmware
                    },
                    { label: 'Integrity Check', value: 'PASSED', icon: ShieldAlert, color: 'text-cyber-green' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] transition-colors group relative">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">{stat.label}</p>
                            {stat.action ? (
                                <button 
                                    onClick={stat.action}
                                    className="p-1 hover:bg-cyber-blue/20 rounded transition-colors text-slate-600 group-hover:text-cyber-blue"
                                    title="Regenerate"
                                >
                                    <RefreshCw size={10} className="animate-in spin-in-180 duration-500" />
                                </button>
                            ) : (
                                <stat.icon size={12} className="text-slate-600 group-hover:text-white transition-colors" />
                            )}
                        </div>
                        <p className={`font-mono text-sm font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Modification Interface - High Visibility Layout */}
            <div className="space-y-6">
              <h2 className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-4 select-none">Modification Interface</h2>
              
              <div className="space-y-5">
                {/* Row 1: Main Serial Input */}
                <div className="relative group">
                  <input 
                    type="text" 
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value.toUpperCase())}
                    placeholder="Enter or generate 15-char serial"
                    className="w-full bg-[#101114] border border-white/10 rounded-lg px-5 py-4 outline-none focus:border-cyber-blue/40 focus:bg-[#121317] transition-all font-mono text-white placeholder:text-slate-700 text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                    <span className={`text-[10px] font-mono font-bold ${newSerial.length === parseInt(serialLength) ? 'text-cyber-green' : 'text-slate-600'}`}>
                      {newSerial.length}/{serialLength}
                    </span>
                  </div>
                </div>

                {/* Row 2: Generation Parameters & Batch Execution */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[120px] bg-[#101114] border border-white/10 rounded-lg px-4 py-3.5 relative group shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                      <span className="text-[8px] text-slate-600 font-black uppercase absolute top-2 left-3 tracking-tighter">Length:</span>
                      <input 
                          type="number" 
                          value={serialLength}
                          onChange={(e) => setSerialLength(e.target.value)}
                          className="bg-transparent outline-none font-mono text-cyber-blue text-sm font-bold w-full pt-1.5"
                      />
                  </div>

                  <div className="flex-1 min-w-[120px] bg-[#101114] border border-white/10 rounded-lg px-4 py-3.5 relative group shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
                      <span className="text-[8px] text-slate-600 font-black uppercase absolute top-2 left-3 tracking-tighter">Quantity:</span>
                      <input 
                          type="number" 
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="bg-transparent outline-none font-mono text-cyber-blue text-sm font-bold w-full pt-1.5"
                      />
                  </div>

                  <button 
                      onClick={generateSerials}
                      className="flex-[2] min-w-[200px] bg-[#14151a] hover:bg-[#1a1c22] border border-white/10 text-white px-8 py-4 rounded-lg flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-lg"
                  >
                      <RefreshCw className="w-4 h-4 text-cyber-blue group-hover:rotate-180 transition-transform duration-700 font-bold" />
                      <span className="font-bold text-xs uppercase tracking-widest">Gen {quantity} Serials</span>
                  </button>
                </div>

                {/* Row 3: Deployment */}
                <button 
                    onClick={handleApply}
                    disabled={isApplying || !newSerial}
                    className={`w-full py-4.5 rounded-lg border flex items-center justify-center gap-3 transition-all relative overflow-hidden group ${
                      isApplying || !newSerial
                        ? 'bg-transparent border-white/5 text-slate-700 cursor-not-allowed uppercase text-[11px] font-black tracking-[0.2em]'
                        : 'bg-[#121215] border-white/10 text-slate-300 hover:text-white hover:border-white/20 uppercase text-[11px] font-black tracking-[0.2em] shadow-xl'
                    }`}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-blue/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    {isApplying ? <RefreshCw className="w-4 h-4 animate-spin text-cyber-blue" /> : <Terminal className="w-4 h-4 text-white/40" />}
                    <span>&gt;_ APPLY NEW SERIAL</span>
                </button>
              </div>
            </div>

            {/* Twin Terminal Interface */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Terminal 1: Diagnostics */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-1">
                        <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.4)]"></div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black">Live diagnostics stream</span>
                    </div>
                    <div className="bg-black/60 border border-white/5 rounded-xl overflow-hidden flex flex-col h-56 shadow-2xl relative">
                        <div className="bg-[#0c0c0e] border-b border-white/5 px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Terminal size={12} className="text-cyber-blue" />
                                <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-black">Local Bash // nvme0n1</span>
                            </div>
                            <div className="flex gap-1.5 opacity-20">
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                            </div>
                        </div>
                        <div 
                            ref={logContainerRef}
                            className="p-5 overflow-y-auto terminal-scrollbar flex-1 font-mono text-[11px] leading-relaxed"
                        >
                            {logs.map(log => (
                                <div key={log.id} className="mb-2 flex gap-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <span className="text-slate-800 shrink-0 select-none font-black">$</span>
                                    <span className={`${
                                        log.type === 'error' ? 'text-red-500/90' :
                                        log.type === 'warning' ? 'text-cyber-amber/90' :
                                        log.type === 'success' ? 'text-cyber-green/90' :
                                        'text-slate-500'
                                    } break-all font-medium`}
                                    >{log.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Terminal 2: Generated Serials */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between ml-1">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                            <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-black">Vault Repository</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{history.length} CACHED</span>
                    </div>
                    <div className="bg-black/60 border border-white/5 rounded-xl overflow-hidden flex flex-col h-56 shadow-2xl relative">
                        <div className="bg-[#0c0c0e] border-b border-white/5 px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Layers size={12} className="text-cyber-green" />
                                <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-black">Serial_Database // read-only</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={copyAllSerials}
                                    className="text-[8px] text-slate-600 hover:text-cyber-blue transition-colors font-bold uppercase tracking-wider flex items-center gap-1.5"
                                >
                                    <Copy size={10} /> Copy All
                                </button>
                                <button 
                                    onClick={() => setHistory([])}
                                    className="text-[8px] text-slate-600 hover:text-red-400 transition-colors font-bold uppercase tracking-wider"
                                >
                                    Empty Vault
                                </button>
                            </div>
                        </div>
                        <div className="p-5 overflow-y-auto terminal-scrollbar flex-1 font-mono text-[11px] leading-relaxed">
                            {history.length === 0 ? (
                                <div className="h-full flex items-center justify-center opacity-10">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black italic">No records present</span>
                                </div>
                            ) : (
                                history.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className="mb-2 flex items-center justify-between group animate-in slide-in-from-right-3 duration-300"
                                    >
                                        <div className="flex gap-4">
                                            <span className="text-slate-800 shrink-0 select-none font-black opacity-50">#</span>
                                            <span 
                                                className="text-cyber-green/90 font-medium cursor-pointer hover:text-cyber-blue transition-colors"
                                                onClick={() => setNewSerial(item.serial)}
                                            >
                                                {item.serial}
                                            </span>
                                        </div>
                                        <button 
                                          onClick={() => handleCopy(item.serial, item.id)}
                                          className="text-slate-700 hover:text-white transition-colors"
                                        >
                                          {copiedId === item.id ? <Check size={10} className="text-cyber-green" /> : <Copy size={10} />}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Footer Stats Line */}
        <div className="bg-[#0a0a0c] border-t border-white/5 px-8 py-3 flex items-center justify-between text-[8px] font-mono text-slate-600 uppercase tracking-[0.3em]">
           <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 transition-colors hover:text-white cursor-help"><ShieldAlert size={10} className="text-cyber-amber" /> Restricted Env</span>
              <span className="flex items-center gap-2 transition-colors hover:text-white cursor-help"><Zap size={10} className="text-cyber-blue" /> High-Performance Mode</span>
           </div>
           <div className="opacity-40">SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
}
