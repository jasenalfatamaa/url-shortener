import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        testTimeout: 20000,
        hookTimeout: 20000,
        teardownTimeout: 15000,
        // Automatically use single thread in resource-constrained environments (Docker/CI)
        // to prevent worker startup timeouts and CLI flag errors.
        // @ts-ignore - Runtime property for Vitest v1.0+
        poolOptions: {
            threads: {
                singleThread: true,
            },
        },
        include: ['src/test/**/*.{test,spec}.{ts,tsx}'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
})
