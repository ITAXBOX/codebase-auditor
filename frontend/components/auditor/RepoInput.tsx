'use client';

import { useState } from 'react';
import { parseRepo } from '@/lib/github';

interface RepoInputProps {
  onSubmit: (repo: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  'huggingface/transformers',
  'openai/whisper',
  'ultralytics/ultralytics',
  'facebookresearch/llama',
];

export default function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const repo = parseRepo(value);
    if (!repo) { setError('Enter a valid GitHub repo (e.g. owner/repo or full URL)'); return; }
    setError('');
    onSubmit(repo);
  };

  return (
    <div style={{ width: '100%', maxWidth: 680, margin: '0 auto' }}>
      {/* Input card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border2)',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 4px 4px 16px' }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0 }}>
            <path d="M7.5 1C4 1 1 4 1 7.5c0 2.9 1.9 5.4 4.5 6.3.3.1.4-.1.4-.3v-1c-1.8.4-2.2-.9-2.2-.9-.3-.8-.7-1-.7-1-.6-.4 0-.4 0-.4.7 0 1 .7 1 .7.6 1 1.5.7 1.9.5.1-.4.2-.7.4-.8-1.4-.2-2.9-.7-2.9-3.2 0-.7.3-1.3.7-1.7-.1-.2-.3-.9.1-1.8 0 0 .6-.2 1.8.7.5-.1 1-.2 1.5-.2s1 .1 1.5.2c1.2-.9 1.8-.7 1.8-.7.4.9.2 1.6.1 1.8.4.4.7 1 .7 1.7 0 2.5-1.5 3-2.9 3.2.2.2.4.6.4 1.2v1.8c0 .2.1.4.4.3C12.1 12.9 14 10.4 14 7.5 14 4 11 1 7.5 1z" fill="var(--dim)"/>
          </svg>
          <input
            type="text"
            value={value}
            onChange={e => { setValue(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && !isLoading && handleSubmit()}
            placeholder="owner/repo  or  https://github.com/owner/repo"
            disabled={isLoading}
            autoFocus
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 14, fontFamily: 'var(--mono)', color: 'var(--text)',
              padding: '12px 0',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !value.trim()}
            style={{
              background: isLoading || !value.trim() ? 'rgba(212,245,90,0.3)' : 'var(--accent)',
              color: '#0e0f11',
              border: 'none',
              borderRadius: 10,
              padding: '10px 20px',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'var(--font)',
              cursor: isLoading || !value.trim() ? 'not-allowed' : 'pointer',
              letterSpacing: '0.02em',
              transition: 'all 0.15s',
              margin: 4,
              whiteSpace: 'nowrap',
            }}
          >
            {isLoading ? 'Scanning…' : 'Audit ↗'}
          </button>
        </div>
      </div>

      {error && (
        <p style={{ marginTop: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--red)' }}>{error}</p>
      )}

      {/* Example chips */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--dim)', fontFamily: 'var(--mono)' }}>try →</span>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => { setValue(ex); setError(''); }}
            disabled={isLoading}
            style={{
              fontSize: 11, fontFamily: 'var(--mono)',
              padding: '4px 12px',
              border: '1px solid var(--border2)',
              borderRadius: 20,
              color: 'var(--muted)',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.borderColor = 'rgba(212,245,90,0.4)';
              (e.target as HTMLElement).style.color = 'var(--accent)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.borderColor = 'var(--border2)';
              (e.target as HTMLElement).style.color = 'var(--muted)';
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}