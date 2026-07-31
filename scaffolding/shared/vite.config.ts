import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7184,
  },
  resolve: {
    alias: {
      '@api-banking/design.typography.heading': path.resolve(__dirname, 'src/fd-components/typography/heading'),
      '@api-banking/design.typography.paragraph': path.resolve(__dirname, 'src/fd-components/typography/paragraph'),
      '@api-banking/design.typography.label': path.resolve(__dirname, 'src/fd-components/typography/label'),
      '@api-banking/design.content.icon': path.resolve(__dirname, 'src/fd-components/content/icon'),
      '@api-banking/design.content.card': path.resolve(__dirname, 'src/fd-components/content/card'),
      '@api-banking/design.content.skeleton': path.resolve(__dirname, 'src/fd-components/content/skeleton'),
      '@api-banking/design.content.logo': path.resolve(__dirname, 'src/fd-components/content/logo'),
      '@api-banking/design.navigation.link': path.resolve(__dirname, 'src/fd-components/navigation/link'),
      '@api-banking/design.navigation.header': path.resolve(__dirname, 'src/fd-components/navigation/header'),
      '@api-banking/design.actions.button': path.resolve(__dirname, 'src/fd-components/actions/button'),
      '@api-banking/design.actions.cta-button': path.resolve(__dirname, 'src/fd-components/actions/cta-button'),
      '@api-banking/design.inputs.text-input': path.resolve(__dirname, 'src/fd-components/inputs/text-input'),
      '@api-banking/design.inputs.checkbox': path.resolve(__dirname, 'src/fd-components/inputs/checkbox'),
      '@api-banking/design.inputs.radio-button': path.resolve(__dirname, 'src/fd-components/inputs/radio-button'),
      '@api-banking/design.inputs.input-group': path.resolve(__dirname, 'src/fd-components/inputs/input-group'),
      '@api-banking/design.inputs.select': path.resolve(__dirname, 'src/fd-components/inputs/select'),
      '@api-banking/design.overlays.modal': path.resolve(__dirname, 'src/fd-components/overlays/modal'),
      '@api-banking/design.layouts.flex': path.resolve(__dirname, 'src/fd-components/layouts/flex'),
      '@api-banking/design.layouts.section-layout': path.resolve(__dirname, 'src/fd-components/layouts/section-layout'),
      '@api-banking/design.api-banking-theme': path.resolve(__dirname, 'src/fd-components/api-banking-theme'),
    },
  },
})
