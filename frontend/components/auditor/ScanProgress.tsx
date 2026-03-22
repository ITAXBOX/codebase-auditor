'use client';

import { useEffect, useState } from 'react';

export type ScanPhase = 'fetching-tree' | 'sampling-files' | 'analyzing' | 'done';

const STEPS: { phase: ScanPhase; label: string; sub: string }[] = [
  { phase: 'fetching-tree',  label: 'Fetching repository tree',  sub: 'Reading file structure from GitHub' },
  { phase: 'sampling-files', label: 'Sampling key files',        sub: 'Selecting and reading relevant files' },
  { phase: 'analyzing',      label: 'Running LLM analysis',      sub: 'Mapping architecture and auditing issues' },
  { phase: 'done',           label: 'Report ready',              sub: 'Audit complete' },
];

const ORDER: ScanPhase[] = ['fetching-tree', 'sampling-files', 'analyzing', 'done'];

export default function ScanProgress({ phase, repo }: { phase: ScanPhase; repo: string }) {
  const [dots, setDots] = useState('');
  const currentIdx = ORDER.indexOf(phase);
  const progress = Math.round((currentIdx / (ORDER.length - 1)) * 100);

  useEffect(() => {
    if (phase === 'done') return;
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, [phase]);

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: 20,
        padding: '48px 56px',
      }}>
        {/* Repo name */}
        <p style={{
          fontSize: 13, fontFamily: 'var(--mono)',
          color: 'var(--dim)', marginBottom: 40,
          letterSpacing: '0.02em',
        }}>
          auditing{' '}
          <span style={{ color: 'var(--accent)' }}>{repo}</span>
          {phase !== 'done' && <span>{dots}</span>}
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 48 }}>
          {STEPS.map((step, i) => {
            const isDone   = i < currentIdx;
            const isActive = i === currentIdx;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                {/* Step indicator */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone
                    ? 'var(--green-dim)'
                    : isActive
                    ? 'var(--accent-dim)'
                    : 'transparent',
                  border: isDone
                    ? '1px solid rgba(82,212,138,0.35)'
                    : isActive
                    ? '1px solid rgba(212,245,90,0.35)'
                    : '1px solid var(--border2)',
                  marginTop: 1,
                }}>
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6l2.5 2.5 5-5" stroke="#52d48a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : isActive ? (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--accent)',
                      animation: 'pulse 1.2s ease-in-out infinite',
                    }} />
                  ) : (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--dim)' }} />
                  )}
                </div>

                {/* Label */}
                <div style={{ paddingTop: 3 }}>
                  <p style={{
                    fontSize: 16, fontWeight: isActive ? 700 : 500,
                    color: isDone ? 'var(--dim)' : isActive ? 'var(--text)' : 'var(--dim)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    marginBottom: isActive ? 5 : 0,
                    letterSpacing: '-0.01em',
                  }}>{step.label}</p>
                  {isActive && (
                    <p style={{
                      fontSize: 12, fontFamily: 'var(--mono)',
                      color: 'var(--muted)', letterSpacing: '0.01em',
                    }}>{step.sub}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, background: 'rgba(255,255,255,0.06)',
          borderRadius: 3, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: 'linear-gradient(90deg, var(--accent), #52d48a)',
            width: `${progress}%`,
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
      `}</style>
    </div>
  );
}