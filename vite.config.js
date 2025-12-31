import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { useImperativeHandle } from 'react';

export default defineConfig({
  plugins: [react()],
})          