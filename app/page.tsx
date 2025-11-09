'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, TrendingUp, TrendingDown, Activity, AlertCircle, Pin, Share2, ChevronRight, X } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { twMerge } from 'tailwind-merge';

// Mock Data
const mockTickers = [
  { s: 'TSLA', p: 378.42, c: 12.87, cp: 3.52, vol: '124M', glow: 'green' },
  { s: 'BTC', p: 68234, c: -892, cp: -1.29, vol: '2.1B', glow: 'red' },
  { s: 'NVDA', p: 842.19, c: 28.45, cp: 3.49, vol: '89M', glow: 'green' },
  { s: 'AAPL', p: 194.67, c: -1.23, cp: -0.63, vol: '67M', glow: 'purple' },
  { s: 'GOLD', p: 2448.12, c: 34.56, cp: 1.43, vol: '12M', glow: 'purple' },
  { s: 'SPY', p: 582.34, c: 5.67, cp: 0.98, vol: '412M', glow: 'green' },
  { s: 'ETH', p: 3124, c: -45, cp: -1.42, vol: '1.4B', glow: 'red' },
  { s: 'AMD', p: 156.78, c: 7.89, cp: 5.30, vol: '78M', glow: 'green' },
];

const mockAlerts = [
  { id: 1, text: '$TSLA volume tripled — chatter increasing in 2 trading groups.', color: 'emerald' },
  { id: 2, text: 'Gold hitting resistance at $2,450 — algorithmic pullback predicted.', color: 'amber' },
];

const mockSectors = [
  { name: 'Tech', vol: 78, vola: 4.2, top: 'NVDA +5.3%' },
  { name: 'Energy', vol: 62, vola: 4.8, top: 'XOM +3.1%' },
  { name: 'Crypto', vol: 88, vola: 6.1, top: 'BTC -1.3%' },
  { name: 'Finance', vol: 45, vola: 2.1, top: 'JPM +0.8%' },
];

const glowClass = (type: 'green' | 'red' | 'purple') => {
  const map: Record<string, string> = {
    green: 'shadow-emerald-500/50',
    red: 'shadow-rose-500/50',
    purple: 'shadow-violet-500/50',
  };
  return map[type];
};

export default function MarketPulse() {
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState('');
  const [selectedTicker, setSelectedTicker] = useState<typeof mockTickers[0] | null>(null);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [sentimentMode, setSentimentMode] = useState<'retail' | 'institutional'>('retail');

  useEffect(() => {
    const iv = setInterval(() => {
      setTime(new Date());
      mockTickers.forEach(t => {
        const jitter = (Math.random() - 0.5) * 2;
        t.p = Math.max(0, t.p + jitter);
        t.c = t.c + jitter * 0.8;
        t.cp = (t.c / (t.p - t.c)) * 100;
      });
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setAlerts(p => p.slice(1)), 15000);
    return () => clearInterval(iv);
  }, []);

  const filteredTickers = useMemo(() => {
    if (!search) return mockTickers;
    return mockTickers.filter(t => t.s.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const globalSentiment = sentimentMode === 'retail' ? 68 : 54;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 -left-20 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-0 w-80 h-80 bg-violet-600 rounded-full mix-blend-screen filter blur-3xl animation-delay-2000 animate-blob"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-rose-600 rounded-full mix-blend-screen filter blur-3xl animation-delay-4000 animate-blob"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-6">
          <motion.header initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Zap className="w-9 h-9 text-emerald-400 animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Market Pulse
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <motion.div key={time.toISOString()} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="font-mono text-gray-400 text-sm">
                {format(time, 'HH:mm:ss')}
              </motion.div>
              <div className="flex gap-2">
                {(['retail', 'institutional'] as const).map(m => (
                  <button key={m} onClick={() => setSentimentMode(m)} className={twMerge(
                    'px-3 py-1 rounded-full text-xs font-medium transition',
                    sentimentMode === m
                      ? m === 'retail' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-violet-500/20 text-violet-300'
                      : 'text-gray-500'
                  )}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.header>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search symbol, sector, or keyword..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-400/50 transition"
            />
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <section className="xl:col-span-7 space-y-4">
              <h2 className="text-xl font-semibold text-gray-300 mb-3">Trending Tickers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredTickers.map((t, i) => (
                    <motion.div
                      key={t.s}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedTicker(t)}
                      className="relative group cursor-pointer"
                    >
                      <div className={twMerge('absolute inset-0 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition', glowClass(t.glow as any))} />
                      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-white/20 transition">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-lg font-bold text-white">{t.s}</span>
                          <Activity className={twMerge('w-4 h-4 animate-pulse', t.cp >= 0 ? 'text-emerald-400' : 'text-rose-400')} />
                        </div>

                        <div className="text-2xl font-bold text-white">
                          ${t.p.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className={twMerge('flex items-center text-sm font-medium', t.cp >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                            {t.cp >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {t.cp >= 0 ? '+' : ''}{t.cp.toFixed(2)}%
                          </span>
                          <span className="text-xs text-gray-400">• {t.vol}</span>
                        </div>

                        <div className="mt-3 h-10">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={Array.from({ length: 20 }, (_, i) => ({ v: t.p + (Math.random() - 0.5) * 10 }))}>
                              <Line type="monotone" dataKey="v" stroke={t.cp >= 0 ? '#10b981' : '#f43f5e'} strokeWidth={1.5} dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            <section className="xl:col-span-5">
              <h2 className="text-xl font-semibold text-gray-300 mb-3">Sentiment Radar</h2>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <svg viewBox="0 0 200 200" className="w-full h-auto">
                  {[1, 2, 3].map(i => (
                    <circle key={i} cx="100" cy="100" r={i * 30} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  ))}

                  <motion.path
                    d={`
                      M 100,100
                      L ${100 + 80 * Math.cos((globalSentiment / 100) * Math.PI - Math.PI / 2)}, 
                         ${100 + 80 * Math.sin((globalSentiment / 100) * Math.PI - Math.PI / 2)}
                      A 80,80 0 ${globalSentiment > 50 ? 1 : 0},1 
                      ${100 + 80 * Math.cos(-Math.PI / 2)}, ${100 + 80 * Math.sin(-Math.PI / 2)}
                      Z
                    `}
                    fill="url(#sentGrad)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />

                  <defs>
                    <linearGradient id="sentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="50%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  <text x="100" y="95" textAnchor="middle" className="text-4xl font-bold fill-white">
                    {globalSentiment}%
                  </text>
                  <text x="100" y="115" textAnchor="middle" className="text-sm fill-gray-400">
                    {globalSentiment > 65 ? 'Bullish' : globalSentiment < 35 ? 'Bearish' : 'Neutral'}
                  </text>
                </svg>

                <div className="mt-6 flex justify-center gap-3 text-xs">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Bearish</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Neutral</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Bullish</span>
                </div>
              </motion.div>
            </section>
          </div>

          <section className="mt-8">
            <AnimatePresence>
              {alerts.map((a, i) => (
                <motion.div
                  key={a.id}
                  transition={{ delay: i * 0.1 }}
                  className={twMerge(
                    'mb-3 flex items-center justify-between p-4 rounded-2xl backdrop-blur-xl border',
                    a.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className={twMerge('w-5 h-5', a.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400')} />
                    <p className="text-white font-medium">{a.text}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 rounded-full hover:bg-white/10 transition">
                      <Pin className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-white/10 transition">
                      <Share2 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Sector Pulse</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockSectors.map((sec, i) => (
                <motion.div
                  key={sec.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative group cursor-pointer"
                >
                  <div className={twMerge(
                    'absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition',
                    sec.vola > 5 ? 'shadow-rose-500/50' : sec.vola > 3 ? 'shadow-amber-500/50' : 'shadow-emerald-500/50'
                  )} />
                  <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition text-center">
                    <div className="text-lg font-bold text-white">{sec.name}</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">{sec.vol}%</div>
                    <div className="text-xs text-gray-400 mt-1">{sec.top}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <AnimatePresence>
          {selectedTicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTicker(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="relative max-w-lg w-full bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-6 border border-white/20 overflow-hidden"
              >
                <button onClick={() => setSelectedTicker(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition">
                  <X className="w-5 h-5 text-gray-400" />
                </button>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{selectedTicker.s}</h3>
                  <ChevronRight className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="text-4xl font-bold text-white mb-2">
                  ${selectedTicker.p.toFixed(2)}
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className={twMerge('flex items-center font-medium', selectedTicker.cp >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                    {selectedTicker.cp >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {selectedTicker.cp >= 0 ? '+' : ''}{selectedTicker.cp.toFixed(2)}%
                  </span>
                  <span className="text-sm text-gray-400">Vol: {selectedTicker.vol}</span>
                </div>

                <div className="h-40 bg-white/5 rounded-2xl p-2">
                  <ResponsiveContainer>
                    <LineChart data={Array.from({ length: 30 }, (_, i) => ({ v: selectedTicker.p + (Math.random() - 0.5) * 30 }))}>
                      <Line type="monotone" dataKey="v" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl">
                  <p className="text-sm text-emerald-300">
                    {selectedTicker.cp > 3 ? 'Momentum cooling after 9% spike — watch for profit-taking.' : 'Steady climb with institutional accumulation.'}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 40px) scale(0.95); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </>
  );
}