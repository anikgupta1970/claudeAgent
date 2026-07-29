import React from 'react';
import { ApiBankingTheme } from '@api-banking/design.api-banking-theme';
import { Flex } from './flex.js';

const Box = ({
  children,
  style: customStyle,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      padding: 'var(--spacing-medium)',
      backgroundColor: 'var(--colors-surface-primary)',
      border:
        'var(--borders-default-width) var(--borders-default-style) var(--borders-default-color)',
      borderRadius: 'var(--borders-radius-small)',
      color: 'var(--colors-text-default)',
      minWidth: '80px',
      textAlign: 'center',
      ...customStyle,
    }}
  >
    {children}
  </div>
);

export const RowFlex = () => (
  <ApiBankingTheme>
    <Flex gap="var(--spacing-medium)" style={{ padding: '20px' }}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Flex>
  </ApiBankingTheme>
);

export const ColumnFlex = () => (
  <ApiBankingTheme>
    <Flex
      flexDirection="column"
      gap="var(--spacing-medium)"
      style={{ padding: '20px' }}
    >
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Flex>
  </ApiBankingTheme>
);

export const AlignmentAndJustify = () => (
  <ApiBankingTheme>
    <Flex flexDirection="column" gap="var(--spacing-large)" style={{ padding: '20px' }}>
      <p style={{ fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-primary)' }}>justifyContent: 'space-between'</p>
      <Flex
        justifyContent="space-between"
        style={{
          height: '100px',
          backgroundColor: 'var(--colors-surface-secondary)',
          padding: 'var(--spacing-small)',
        }}
      >
        <Box>Item 1</Box>
        <Box>Item 2</Box>
        <Box>Item 3</Box>
      </Flex>
      <p style={{ fontFamily: 'var(--typography-font-family)', color: 'var(--colors-text-primary)' }}>alignItems: 'center'</p>
      <Flex
        alignItems="center"
        style={{
          height: '100px',
          backgroundColor: 'var(--colors-surface-secondary)',
          padding: 'var(--spacing-small)',
          gap: 'var(--spacing-small)',
        }}
      >
        <Box style={{ height: '30px' }}>Item 1</Box>
        <Box>Item 2</Box>
        <Box style={{ height: '40px' }}>Item 3</Box>
      </Flex>
    </Flex>
  </ApiBankingTheme>
);

export const WrappingFlex = () => (
  <ApiBankingTheme>
    <Flex
      flexWrap="wrap"
      gap="var(--spacing-medium)"
      style={{ padding: '20px' }}
    >
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
      <Box>Item 6</Box>
      <Box>Item 7</Box>
      <Box>Item 8</Box>
    </Flex>
  </ApiBankingTheme>
);