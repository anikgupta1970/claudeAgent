import styles from './InfoBanner.module.css';

interface Props {
  message: string;
}

export default function InfoBanner({ message }: Props) {
  return (
    <div className={styles.banner}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.icon}>
        <circle cx="8" cy="8" r="7" stroke="#1a3a5c" strokeWidth="1.5" />
        <rect x="7.25" y="7" width="1.5" height="5" rx="0.75" fill="#1a3a5c" />
        <circle cx="8" cy="5" r="0.875" fill="#1a3a5c" />
      </svg>
      <span>{message}</span>
    </div>
  );
}
