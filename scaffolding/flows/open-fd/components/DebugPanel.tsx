import { useState, useEffect, useRef } from 'react';
import { useJourney } from '../../context/JourneyContext';
import styles from './DebugPanel.module.css';

type LogLevel = 'log' | 'warn' | 'error' | 'info';
type LogKind = 'console' | 'network-req' | 'network-res' | 'network-err';
type Tab = 'logs' | 'data' | 'pages';

interface LogEntry {
  kind: LogKind;
  level?: LogLevel;
  text: string;
  time: string;
  method?: string;
  status?: number;
  duration?: number;
}

const PAGES = [
  { step: 1, name: 'Login', desc: 'Customer authentication via OTP' },
  { step: 2, name: 'Deposit Details', desc: 'FD type, amount, tenure, interest options' },
  { step: 3, name: 'Bank Details', desc: 'Branch, funding method, nominee' },
  { step: 4, name: 'Preview', desc: 'Review all details before submission' },
  { step: 5, name: 'Submit FD', desc: 'Application submission and status polling' },
];

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour12: false });
}

function safeJson(v: unknown) {
  try { return typeof v === 'object' && v !== null ? JSON.stringify(v, null, 2) : String(v); }
  catch { return String(v); }
}

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('logs');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const { state } = useJourney();

  const addLog = (entry: LogEntry) =>
    setLogs(prev => [...prev.slice(-399), entry]);

  // Intercept console
  useEffect(() => {
    const orig = { log: console.log, warn: console.warn, error: console.error, info: console.info };

    function patch(level: LogLevel) {
      return (...args: unknown[]) => {
        orig[level](...args);
        addLog({ kind: 'console', level, text: args.map(safeJson).join(' '), time: now() });
      };
    }

    console.log = patch('log');
    console.warn = patch('warn');
    console.error = patch('error');
    console.info = patch('info');

    return () => { Object.assign(console, orig); };
  }, []);

  // Intercept fetch
  useEffect(() => {
    const origFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
      const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
      const path = url.replace(/^https?:\/\/[^/]+/, '') || '/';
      const t0 = Date.now();

      let bodyText = '';
      if (init?.body) {
        try { bodyText = '\n' + JSON.stringify(JSON.parse(init.body as string), null, 2); }
        catch { bodyText = '\n' + String(init.body); }
      }

      addLog({ kind: 'network-req', method, text: `${method} ${path}${bodyText}`, time: now() });

      try {
        const res = await origFetch(input, init);
        const duration = Date.now() - t0;
        const clone = res.clone();
        clone.json().then(data => {
          addLog({
            kind: 'network-res',
            method,
            status: res.status,
            duration,
            text: `${res.status} ${path} (${duration}ms)\n${JSON.stringify(data, null, 2)}`,
            time: now(),
          });
        }).catch(() => {
          addLog({ kind: 'network-res', method, status: res.status, duration, text: `${res.status} ${path} (${duration}ms)`, time: now() });
        });
        return res;
      } catch (err) {
        const duration = Date.now() - t0;
        addLog({ kind: 'network-err', method, duration, text: `ERR ${path} (${duration}ms)\n${safeJson(err)}`, time: now() });
        throw err;
      }
    };

    return () => { window.fetch = origFetch; };
  }, []);

  useEffect(() => {
    if (open && tab === 'logs') logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, open, tab]);

  const safeState = { ...state, bearerToken: state.bearerToken ? '[hidden]' : null };
  const netCount = logs.filter(l => l.kind.startsWith('network')).length;
  const consoleCount = logs.filter(l => l.kind === 'console').length;

  return (
    <>
      <button className={styles.fab} onClick={() => setOpen(o => !o)} title="Dev Tools">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C13 5.06 12.51 5 12 5s-1 .06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" />
        </svg>
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <span className={styles.title}>Dev Tools</span>
            <div className={styles.headerActions}>
              <button className={styles.clearBtn} onClick={() => setLogs([])}>Clear</button>
              <button className={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'logs' ? styles.tabActive : ''}`} onClick={() => setTab('logs')}>
              App Logs {consoleCount > 0 && <span className={styles.badge}>{consoleCount}</span>}
            </button>
            <button className={`${styles.tab} ${tab === 'data' ? styles.tabActive : ''}`} onClick={() => setTab('data')}>
              App Data
            </button>
            <button className={`${styles.tab} ${tab === 'pages' ? styles.tabActive : ''}`} onClick={() => setTab('pages')}>
              Pages
            </button>
            <button className={`${styles.tab} ${tab === 'network' as Tab ? styles.tabActive : ''}`} onClick={() => setTab('network' as Tab)}>
              Network {netCount > 0 && <span className={styles.badge}>{netCount}</span>}
            </button>
          </div>

          <div className={styles.body}>
            {tab === 'logs' && (
              <div className={styles.logsList}>
                {logs.filter(l => l.kind === 'console').length === 0
                  ? <div className={styles.empty}>No console logs captured yet.</div>
                  : logs.filter(l => l.kind === 'console').map((l, i) => (
                    <div key={i} className={`${styles.logRow} ${styles[`level_${l.level}`]}`}>
                      <span className={styles.logTime}>{l.time}</span>
                      <span className={styles.logLevel}>{(l.level ?? 'log').toUpperCase()}</span>
                      <pre className={styles.logText}>{l.text}</pre>
                    </div>
                  ))
                }
                <div ref={logsEndRef} />
              </div>
            )}

            {(tab as string) === 'network' && (
              <div className={styles.logsList}>
                {logs.filter(l => l.kind.startsWith('network')).length === 0
                  ? <div className={styles.empty}>No network calls yet.</div>
                  : logs.filter(l => l.kind.startsWith('network')).map((l, i) => (
                    <div key={i} className={`${styles.logRow} ${
                      l.kind === 'network-req' ? styles.netReq :
                      l.kind === 'network-err' ? styles.netErr : styles.netRes
                    }`}>
                      <span className={styles.logTime}>{l.time}</span>
                      <span className={styles.logLevel}>
                        {l.kind === 'network-req' ? '→' : l.kind === 'network-err' ? '✕' : '←'}
                      </span>
                      <pre className={styles.logText}>{l.text}</pre>
                    </div>
                  ))
                }
              </div>
            )}

            {tab === 'data' && (
              <pre className={styles.json}>{JSON.stringify(safeState, null, 2)}</pre>
            )}

            {tab === 'pages' && (
              <div className={styles.pagesList}>
                {PAGES.map(p => {
                  const isCurrent = state.step === p.step;
                  const isDone = state.step > p.step;
                  return (
                    <div key={p.step} className={`${styles.pageItem} ${isCurrent ? styles.pageCurrent : isDone ? styles.pageDone : ''}`}>
                      <div className={styles.pageStep}>{isDone ? '✓' : p.step}</div>
                      <div>
                        <div className={styles.pageName}>{p.name}</div>
                        <div className={styles.pageDesc}>{p.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
