import type { Metadata } from 'next';
import AuditorShell from '@/components/auditor/AuditorShell';

export const metadata: Metadata = {
  title: 'Codebase Auditor',
  description: 'Analyze any GitHub repository for architecture, MLOps health, and improvement opportunities.',
};

export default function AuditorPage() {
  return (
    <main className="flex flex-col h-screen overflow-hidden" style={{
      background: '#0e0f11',
      fontFamily: "'Syne', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
        * { box-sizing: border-box; }
        :root {
          --bg: #0e0f11;
          --surface: #16181c;
          --surface2: #1e2026;
          --border: rgba(255,255,255,0.07);
          --border2: rgba(255,255,255,0.12);
          --text: #f0f0ee;
          --muted: #888a8f;
          --dim: #555860;
          --accent: #d4f55a;
          --accent-dim: rgba(212,245,90,0.1);
          --accent-text: #b8db3a;
          --red: #ff5e5e;
          --red-dim: rgba(255,94,94,0.1);
          --amber: #f0a832;
          --amber-dim: rgba(240,168,50,0.1);
          --green: #52d48a;
          --green-dim: rgba(82,212,138,0.1);
          --blue: #5ab4f5;
          --blue-dim: rgba(90,180,245,0.1);
          --font: 'Syne', sans-serif;
          --mono: 'DM Mono', monospace;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font); }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        input::placeholder { color: var(--dim); }
        input { color: var(--text); }
      `}</style>

      {/* Header — centered */}
      <header style={{
        flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '18px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0e0f11',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(212,245,90,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 15l4-12 4 12M3 9h12" stroke="#d4f55a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{
              fontSize: 22, fontWeight: 800,
              color: 'var(--text)', letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              codebase<span style={{ color: 'var(--accent)' }}>auditor</span>
            </div>
            <div style={{
              fontSize: 11, color: 'var(--dim)',
              fontFamily: 'var(--mono)', marginTop: 3,
              letterSpacing: '0.06em',
            }}>
              architecture · mlops · health scoring
            </div>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0 }}>
        <AuditorShell />
      </div>
    </main>
  );
}