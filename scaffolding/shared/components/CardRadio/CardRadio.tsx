import styles from './CardRadio.module.css';

interface Option {
  value: string;
  label: string;
  sub?: string;
  disabled?: boolean;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  variant?: 'navy' | 'purple';
}

export default function CardRadio({ options, value, onChange, variant = 'navy' }: Props) {
  return (
    <div className={styles.group}>
      {options.map((opt) => {
        const isSelected = opt.value === value;
        const cls = [
          styles.card,
          isSelected ? (variant === 'purple' ? styles.selectedPurple : styles.selected) : '',
          opt.disabled ? styles.disabled : '',
        ].join(' ');
        return (
          <button
            key={opt.value}
            type="button"
            className={cls}
            onClick={() => !opt.disabled && onChange(opt.value)}
            disabled={opt.disabled}
          >
            <div className={styles.label}>{opt.label}</div>
            {opt.sub && <div className={styles.sub}>{opt.sub}</div>}
          </button>
        );
      })}
    </div>
  );
}
