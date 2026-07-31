import styles from './Stepper.module.css';

const STEPS = ['Login', 'Deposit Details', 'Bank Details', 'Preview', 'Submit FD'];

interface Props {
  current: number;
}

export default function Stepper({ current }: Props) {
  return (
    <div className={styles.stepper}>
      {STEPS.map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === current;
        const isCompleted = stepNum < current;
        const cls = [
          styles.step,
          isActive ? styles.active : '',
          isCompleted ? styles.completed : '',
        ].join(' ');

        return (
          <div key={label} className={cls}>
            <div className={styles.circle}>
              {isCompleted ? (
                <svg className={styles.checkIcon} viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7l3.5 3.5 5.5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            <span className={styles.label}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
