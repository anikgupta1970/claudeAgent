import React from 'react';
import { Header } from '@api-banking/design.navigation.header';
import styles from './AppShell.module.css';

interface Props {
  children: React.ReactNode;
}

export default function AppShell({ children }: Props) {
  return (
    <div className={styles.shell}>
      <Header logoProps={{ logo: <img src="https://stitch-preview-spliceforms-ui.apps.rosa.sdev.mi7j.p3.openshiftapps.com/logo.svg" alt="Logo" style={{ height: '40px' }} />, minimal: true }} />
      <div className={styles.content}>
        <div className={styles.card}>{children}</div>
      </div>
    </div>
  );
}
