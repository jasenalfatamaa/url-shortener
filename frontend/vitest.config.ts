import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        testTimeout: 15000,
        hookTimeout: 15000,
        include: ['src/test/**/*.{test,spec}.{ts,tsx}'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
})
