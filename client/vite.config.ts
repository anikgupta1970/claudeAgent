import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const fdComponents = path.resolve(__dirname, '../scaffolding/shared/fd-components');
const nm = path.resolve(__dirname, 'node_modules');

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // Shared deps used by fd-components (outside client/) must resolve from client/node_modules
      'classnames': path.join(nm, 'classnames'),
      'react': path.join(nm, 'react'),
      'react-dom': path.join(nm, 'react-dom'),
      'react-aria-components': path.join(nm, 'react-aria-components'),
      '@api-banking/design.typography.heading':    path.join(fdComponents, 'typography/heading'),
      '@api-banking/design.typography.paragraph':  path.join(fdComponents, 'typography/paragraph'),
      '@api-banking/design.typography.label':      path.join(fdComponents, 'typography/label'),
      '@api-banking/design.content.icon':          path.join(fdComponents, 'content/icon'),
      '@api-banking/design.content.card':          path.join(fdComponents, 'content/card'),
      '@api-banking/design.content.skeleton':      path.join(fdComponents, 'content/skeleton'),
      '@api-banking/design.content.logo':          path.join(fdComponents, 'content/logo'),
      '@api-banking/design.navigation.link':       path.join(fdComponents, 'navigation/link'),
      '@api-banking/design.navigation.header':     path.join(fdComponents, 'navigation/header'),
      '@api-banking/design.actions.button':        path.join(fdComponents, 'actions/button'),
      '@api-banking/design.actions.cta-button':    path.join(fdComponents, 'actions/cta-button'),
      '@api-banking/design.inputs.text-input':     path.join(fdComponents, 'inputs/text-input'),
      '@api-banking/design.inputs.checkbox':       path.join(fdComponents, 'inputs/checkbox'),
      '@api-banking/design.inputs.radio-button':   path.join(fdComponents, 'inputs/radio-button'),
      '@api-banking/design.inputs.input-group':    path.join(fdComponents, 'inputs/input-group'),
      '@api-banking/design.inputs.select':         path.join(fdComponents, 'inputs/select'),
      '@api-banking/design.overlays.modal':        path.join(fdComponents, 'overlays/modal'),
      '@api-banking/design.layouts.flex':          path.join(fdComponents, 'layouts/flex'),
      '@api-banking/design.layouts.section-layout': path.join(fdComponents, 'layouts/section-layout'),
      '@api-banking/design.api-banking-theme':     path.join(fdComponents, 'api-banking-theme'),
    },
  },
});
