import React from 'react';
import { Skeleton } from './skeleton.js';

export const TextSkeleton = () => (
  <div style={{ width: 300, padding: 16 }}>
    <Skeleton variant="text" width="80%" />
    <div style={{ marginTop: 8 }} />
    <Skeleton variant="text" width="60%" />
    <div style={{ marginTop: 8 }} />
    <Skeleton variant="text" width="90%" />
  </div>
);

export const RectangularSkeleton = () => (
  <div style={{ width: 300, padding: 16 }}>
    <Skeleton variant="rectangular" height="120px" />
  </div>
);

export const CustomerDetailsLoading = () => (
  <div style={{ display: 'flex', gap: 32, padding: 16 }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 12, color: '#888' }}>Full Name</span>
      <Skeleton variant="text" width="120px" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 12, color: '#888' }}>Date of Birth</span>
      <Skeleton variant="text" width="100px" />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 12, color: '#888' }}>PAN</span>
      <Skeleton variant="text" width="100px" />
    </div>
  </div>
);
