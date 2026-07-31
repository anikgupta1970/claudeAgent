import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from 'react';
import styles from './OtpInput.module.css';

interface Props {
  onComplete: (otp: string) => void;
  loading?: boolean;
}

export default function OtpInput({ onComplete, loading }: Props) {
  const [values, setValues] = useState<string[]>(Array(6).fill(''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...values];
    next[idx] = digit;
    setValues(next);
    if (digit && idx < 5) refs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !values[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = Array(6).fill('');
    digits.split('').forEach((d, i) => { next[i] = d; });
    setValues(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  }

  const otp = values.join('');
  const ready = otp.length === 6;

  return (
    <div className={styles.wrapper}>
      <p className={styles.hint}>OTP has been sent to your registered mobile number</p>
      <div className={styles.boxes}>
        {values.map((v, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            className={`${styles.box} ${v ? styles.filled : ''}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={v}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={loading}
          />
        ))}
      </div>
      <button
        onClick={() => ready && onComplete(otp)}
        disabled={!ready || loading}
        style={{
          background: ready && !loading ? 'var(--coral)' : '#d1d5db',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '12px 40px',
          fontSize: 15,
          fontWeight: 700,
          cursor: ready && !loading ? 'pointer' : 'not-allowed',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {loading ? <Spinner /> : 'Verify OTP'}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
