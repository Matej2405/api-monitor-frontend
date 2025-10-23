import { useState, useEffect, useRef } from 'react';
import { css } from '../../styled-system/css';
import { requestsAPI, type APIRequest } from '../services/api';
import { Clock, Zap, MapPin } from 'lucide-react';
import { useLayoutEffect } from 'react';

/** Polished inline sparkline that matches the figma style */
function Sparkline() {
  return (
    <svg
      viewBox="0 0 560 120"
      width="100%"
      height="120"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ display: 'block', borderRadius: 12 }}
    >
      <defs>
        <linearGradient id="sl-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF3D7F" />
          <stop offset="100%" stopColor="#9B30FF" />
        </linearGradient>
        <filter id="sl-shadow" x="-20%" y="-50%" width="140%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.45" floodColor="#ff3d7f" />
        </filter>
        <clipPath id="sl-clip">
          <rect x="12" y="10" width="510" height="100" rx="10" />
        </clipPath>
      </defs>

      <rect
        x="0.5"
        y="0.5"
        width="559"
        height="119"
        rx="12"
        fill="rgba(7,8,16,0.70)"
        stroke="rgba(255,255,255,0.08)"
      />

      {([20, 40, 60, 80, 100] as const).map((y, i) => (
        <line
          key={y}
          x1="16"
          x2="534"
          y1={y}
          y2={y}
          stroke={i === 0 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}
          strokeWidth="1"
        />
      ))}

      {[
        { y: 18, t: '8k' },
        { y: 40, t: '6k' },
        { y: 62, t: '4k' },
        { y: 84, t: '2k' },
        { y: 106, t: '0'  },
      ].map(({ y, t }) => (
        <text
          key={t}
          x="546"
          y={y}
          textAnchor="end"
          dominantBaseline="middle"
          fontSize="12"
          fill="rgba(255,255,255,0.72)"
          style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
        >
          {t}
        </text>
      ))}

      <g clipPath="url(#sl-clip)" filter="url(#sl-shadow)">
        <path
          d="
            M16,70
            C46,66 76,74 106,70
            C136,66 166,54 196,60
            C226,66 256,62 286,70
            C316,78 346,76 376,82
            C406,88 436,86 466,90
            C496,94 516,92 532,94
          "
          fill="none"
          stroke="url(#sl-g)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function timeAgo(input: string | number | Date): string {
  const then = new Date(input).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - then) / 1000)); // seconds
  if (diff < 60) return `${diff || 1}sec ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Deterministic pseudo-random city picker based on a string seed
const MOCK_CITIES = [
  'Chicago, Illinois, US',
  'Stockholm, Sweden',
  'Florence, Colorado, US',
  'Sydney, New South Wales, AU',
  'San Francisco, California, US',
  'Berlin, DE',
  'Toronto, ON, CA',
  'Tokyo, JP',
  'Amsterdam, NL',
  'London, UK'
];

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0);
}
function mockCityFor(seed: string) {
  const h = hashSeed(seed);
  return MOCK_CITIES[h % MOCK_CITIES.length];
}

function Dashboard() {
  const [requests, setRequests] = useState<APIRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'table'>('list');
  const [showDock, setShowDock] = useState(false);
  const requestsRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState({
    method: '',
    response_code_range: '',
    sort_by: 'created_at' as 'created_at' | 'response_time',
    order: 'desc' as 'asc' | 'desc',
  });

  // ---------- Pagination ----------
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const total = requests.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIdx = (page - 1) * pageSize;
  const pageData = requests.slice(startIdx, startIdx + pageSize);
  function goTo(p: number) {
    const clamped = Math.min(Math.max(p, 1), totalPages);
    setPage(clamped);
  }
  // measure/lock panel height during fetch
const panelRef = useRef<HTMLDivElement>(null);
const [panelMinH, setPanelMinH] = useState<number | undefined>(undefined);

// when filters change, start from page 1 to reduce jumps
useEffect(() => { setPage(1); }, [filters]);

  useEffect(() => {
    const onScroll = () => {
      if (!requestsRef.current) return;
      const top = requestsRef.current.getBoundingClientRect().top;
      setShowDock(top <= 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { void fetchRequests(); }, [filters]);

  // wrap fetch to lock/unlock height
const fetchRequests = async () => {
  // lock current panel height to prevent layout shift
  if (panelRef.current) setPanelMinH(panelRef.current.offsetHeight);
  setLoading(true);
  try {
    const params: any = { sort_by: filters.sort_by, order: filters.order };
    if (filters.method) params.method = filters.method;
    if (filters.response_code_range) {
      const map: Record<string, [number, number]> = { '2xx':[200,299], '4xx':[400,499], '5xx':[500,599] };
      const [min,max] = map[filters.response_code_range];
      params.min_response_code = min; params.max_response_code = max;
    }
    const { data } = await requestsAPI.getAll(params);
    setRequests(data);
  } catch (e) {
    console.error(e);
  } finally {
    setLoading(false);
    // release the height lock after the new frame paints
    requestAnimationFrame(() => setPanelMinH(undefined));
  }
};

  const methodColor = (m:string) =>
    ({ GET:'#3b82f6', POST:'#10b981', PUT:'#f59e0b', DELETE:'#ef4444', PATCH:'#8b5cf6' } as Record<string,string>)[m] ?? '#6b7280';
  const codeColor = (c:number) => (c>=200&&c<300 ? '#10b981' : c>=400&&c<500 ? '#f59e0b' : c>=500 ? '#ef4444' : '#6b7280');

  return (
    <div>
      {/* Top glass navbar */}
      <header className="nav-wrap">
        <div className="navbar-glass">
          <div className="brand">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#E1207A" />
                  <stop offset="1" stopColor="#9103EB" />
                </linearGradient>
              </defs>
              <path d="M4 8l12 12L28 8h-4l-8 8-8-8z" fill="url(#lg)" />
              <path d="M6 20l10 6 10-6h-3l-7 4-7-4z" fill="url(#lg)" opacity=".85" />
            </svg>
            <span className="brand-word">RUNTIME</span>
          </div>
          <button className="cta nav-cta">Start Monitoring Now</button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            <span className="pill" style={{ background: 'var(--pink)' }}>NEW</span>
            <span style={{ opacity: 0.9 }}>Live Performance Boosts</span>
          </div>
          <h1 className="headline">
            Smarter API Performance.<br/>Real-Time Insights.
          </h1>
          <p className="subhead">
            RunTime AI monitors, analyzes, and optimizes your APIs so you can focus on building – not debugging.
          </p>
          <button className="hero-cta" onClick={() => requestsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
            Start Monitoring Now
          </button>
        </div>
      </section>

      {/* Requests */}
      <section ref={requestsRef} className="container" style={{ paddingBlock: '72px' }}>
        {/* Controls bar */}
        <div className="req-controls">
          <span className="req-title">Requests</span>

          <div className="req-right-controls">
            <div className="segmented">
              <button className="seg-btn" data-active={view==='list'}  onClick={()=>setView('list')}>List</button>
              <button className="seg-btn" data-active={view==='table'} onClick={()=>setView('table')}>Table</button>
            </div>

            <label className="chip-select">
              <select
                value={filters.sort_by}
                onChange={(e)=>setFilters({...filters, sort_by:e.target.value as any})}
              >
                <option value="created_at">Last 24h</option>
                <option value="response_time">Response Time</option>
              </select>
            </label>

            <label className="chip-select">
              <select
                value={filters.method}
                onChange={(e)=>setFilters({...filters, method:e.target.value})}
              >
                <option value="">Method: All</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="DELETE">DELETE</option>
              </select>
            </label>

            <label className="chip-select">
              <select
                value={filters.response_code_range}
                onChange={(e)=>setFilters({...filters, response_code_range:e.target.value})}
              >
                <option value="">Response: All</option>
                <option value="2xx">2xx</option>
                <option value="4xx">4xx</option>
                <option value="5xx">5xx</option>
              </select>
            </label>
          </div>
        </div>
        {!loading && requests.length===0 && (
          <div style={{ textAlign:'center', padding:'40px', color:'rgba(255,255,255,0.65)' }}>
            No requests found
          </div>
        )}

        {!loading && requests.length>0 && (
          <>
            {view==='list' ? (
              <>
                {/* LIST panel */}
                <div className="req-panel">
                  <div className="req-panel-inner">
                    {pageData.map((r, i) => (
                      <div key={r.id} className="req-row">
                        {/* LEFT */}
                        <div className="req-row-left">
                          <div className="req-row-top">
                            <span className="pill req-pill" style={{ background: methodColor(r.method) }}>{r.method}</span>
                            <span className="pill req-pill" style={{ background: codeColor(r.response_code) }}>{r.response_code}</span>
                            <span className="req-name">{r.path}</span>
                          </div>

                          <div className="req-meta">
                            <span className="req-m-chip">
                              <Zap size={14} /> {r.response_time}ms
                            </span>
                            <span className="req-m-chip">
                              <MapPin size={14} /> {mockCityFor(String(r.id ?? r.path ?? 'seed'))}
                            </span>
                            <span className="req-m-chip">
                              <Clock size={14} /> {timeAgo(r.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="req-row-right" style={{ minWidth: 520, paddingLeft: 8 }}>
                          <Sparkline/>
                        </div>

                        {/* Divider */}
                        {i !== pageData.length - 1 && <div className="req-divider" />}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="req-footer">
                    <div className="req-count">
                      Showing {total ? startIdx + 1 : 0} to {Math.min(startIdx + pageSize, total)} of {total} requests
                      <label className="chip-select req-size">
                        <select
                          value={pageSize}
                          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                          <option value={5}>5 / page</option>
                          <option value={10}>10 / page</option>
                          <option value={20}>20 / page</option>
                        </select>
                      </label>
                    </div>

                    <nav className="req-pager" aria-label="pagination">
                      <button className="page-chip" onClick={() => goTo(page - 1)} aria-label="Previous">‹</button>
                      {(() => {
                        const items: (number | string)[] = [];
                        const push = (v: number | string) => items.push(v);
                        if (totalPages <= 7) {
                          for (let i = 1; i <= totalPages; i++) push(i);
                        } else {
                          push(1);
                          if (page > 3) push('…');
                          const s = Math.max(2, page - 1);
                          const e = Math.min(totalPages - 1, page + 1);
                          for (let i = s; i <= e; i++) push(i);
                          if (page < totalPages - 2) push('…');
                          push(totalPages);
                        }
                        return items.map((it, idx) =>
                          typeof it === 'number' ? (
                            <button
                              key={`${it}-${idx}`}
                              className={`page-chip ${it === page ? 'is-active' : ''}`}
                              onClick={() => goTo(it)}
                            >
                              {it}
                            </button>
                          ) : (
                            <span key={`dots-${idx}`} className="page-dots">…</span>
                          )
                        );
                      })()}
                      <button className="page-chip" onClick={() => goTo(page + 1)} aria-label="Next">›</button>
                    </nav>
                  </div>
                </div>
              </>
            ) : (
              // ===== TABLE view as a single glass panel =====
              <div className="req-panel">
                <div className="req-panel-inner no-dividers" style={{ padding: 0 }}>
                  <table
                    className={css({
                      width: '100%',
                      tableLayout: 'fixed', // stable columns
                      borderCollapse: 'separate',
                      borderSpacing: 0,
                      fontFamily: "'DM Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
                    })}
                  >
                    {/* fixed column proportions similar to figma */}
                    <colgroup>
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '12%' }} />
                      <col style={{ width: '30%' }} />
                      <col style={{ width: '14%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '12%' }} />
                    </colgroup>

                    <thead
                      className={css({
                        position: 'sticky', top: 0, zIndex: 1,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                        backdropFilter: 'blur(6px)',
                      })}
                    >
                      <tr>
                        <th className={thTable}>Method</th>
                        <th className={thTable}>Response</th>
                        <th className={thTable}>Name</th>
                        <th className={thTable}>Load Time</th>
                        <th className={thTable}>Location</th>
                        <th className={thTable}>Time</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pageData.map((r, i, arr) => (
                        <tr
                          key={r.id}
                          className={css({
                            height: '60px',
                            borderBottom: i !== arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                            transition: 'background .15s ease, box-shadow .15s ease',
                            '&:hover': {
                              background: 'rgba(145,3,235,0.06)',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(255,255,255,0.06)',
                            },
                          })}
                        >
                          <td className={tdTable}>
                            <span className={tableBadge} style={{ background: methodColor(r.method) }}>
                              {r.method}
                            </span>
                          </td>

                          <td className={tdTable}>
                            <span className={tableBadge} style={{ background: codeColor(r.response_code) }}>
                              {r.response_code}
                            </span>
                          </td>

                          <td className={tdTable} style={{ fontWeight: 600 }}>
                            <span className={css({
                              display:'inline-block',
                              maxWidth:'100%',
                              overflow:'hidden',
                              textOverflow:'ellipsis',
                              whiteSpace:'nowrap'
                            })}>
                              {r.path}
                            </span>
                          </td>

                          <td className={tdTable}>{r.response_time}ms</td>

                          <td className={tdTable}>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:8, opacity:.95 }}>
                              <MapPin size={16} /> {mockCityFor(String(r.id ?? r.path ?? 'seed'))}
                            </span>
                          </td>

                          <td className={tdTable}>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:8, opacity:.95 }}>
                              <Clock size={16} /> {timeAgo(r.created_at)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Panel footer (same as list) */}
                <div className="req-footer">
                  <div className="req-count">
                    Showing {total ? startIdx + 1 : 0} to {Math.min(startIdx + pageSize, total)} of {total} requests
                    <label className="chip-select req-size">
                      <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                      >
                        <option value={5}>5 / page</option>
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                      </select>
                    </label>
                  </div>

                  <nav className="req-pager" aria-label="pagination">
                    <button className="page-chip" onClick={() => goTo(page - 1)} aria-label="Previous">‹</button>
                    {(() => {
                      const last = Math.max(1, Math.ceil(total / pageSize));
                      const items: (number | string)[] = [];
                      const push = (v: number | string) => items.push(v);
                      if (last <= 7) {
                        for (let i = 1; i <= last; i++) push(i);
                      } else {
                        push(1);
                        if (page > 3) push('…');
                        const s = Math.max(2, page - 1);
                        const e = Math.min(last - 1, page + 1);
                        for (let i = s; i <= e; i++) push(i);
                        if (page < last - 2) push('…');
                        push(last);
                      }
                      return items.map((it, idx) =>
                        typeof it === 'number' ? (
                          <button
                            key={`${it}-${idx}`}
                            className={`page-chip ${it === page ? 'is-active' : ''}`}
                            onClick={() => goTo(it)}
                          >
                            {it}
                          </button>
                        ) : (
                          <span key={`dots-${idx}`} className="page-dots">…</span>
                        )
                      );
                    })()}
                    <button className="page-chip" onClick={() => goTo(page + 1)} aria-label="Next">›</button>
                  </nav>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

/* ===== Table-specific compact styles (DM Sans, figma-like) ===== */
const thTable = css({
  padding:'10px 14px',
  textAlign:'left',
  fontWeight:800,
  color:'rgba(255,255,255,0.92)',
  fontSize:'11px',
  textTransform:'uppercase',
  letterSpacing:'0.08em',
});

const tdTable = css({
  padding:'10px 14px',
  color:'rgba(255,255,255,0.90)',
  fontSize:'14px',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const tableBadge = css({
  display:'inline-flex',
  alignItems:'center',
  justifyContent:'center',
  height:'28px',
  minWidth:'52px',
  padding:'6px 12px',
  borderRadius:'999px', // pickle/pill
  fontWeight:800,
  fontSize:'13px',
  color:'#fff',
  boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.12)',
});

/* legacy th/td used elsewhere */
const th = css({
  padding:'14px 16px',
  textAlign:'left',
  fontWeight:700,
  color:'rgba(255,255,255,0.92)',
  fontSize:'12px',
  textTransform:'uppercase',
  letterSpacing:'0.06em'
});
const td = css({
  padding:'14px 16px',
  color:'rgba(255,255,255,0.86)',
  fontSize:'15px'
});

export default Dashboard;
