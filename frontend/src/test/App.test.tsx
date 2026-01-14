import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import App from '../App'

vi.mock('framer-motion', () => {
    const motionProxy = new Proxy({}, {
        get: (_target, tagName: string) => {
            return ({ children, initial, animate, transition, whileInView, whileHover, whileTap, exit, viewport, ...props }: any) => {
                const Tag = tagName as any;
                return <Tag {...props}>{children}</Tag>;
            };
        }
    });

    return {
        motion: motionProxy,
        AnimatePresence: ({ children }: any) => children,
        useSpring: () => ({ set: vi.fn(), get: vi.fn() }),
        useTransform: () => ({ get: vi.fn() }),
    };
});

// Mock global fetch for connectivity check
vi.stubGlobal('fetch', vi.fn(() => Promise.reject('Connectivity check failure')));

test('renders headline', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /ARCHITECTURAL/i })).toBeInTheDocument()
    // Always wait for the initial async effect to finish to prevent act() warnings during test teardown
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 8000 })
})

test('activates demo mode when backend is unreachable', async () => {
    render(<App />)
    const demoBadge = await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 8000 })
    expect(demoBadge).toBeInTheDocument()
})

test('updates input value on change', async () => {
    render(<App />)
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 8000 })
    const input = screen.getByPlaceholderText(/ENTER TARGET DATA/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    expect(input.value).toBe('https://google.com')
})

test('generates mock URL in demo mode', async () => {
    render(<App />)
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 8000 })

    const input = screen.getByPlaceholderText(/ENTER TARGET DATA/i)
    const form = screen.getByRole('form', { name: /shorten-form/i })

    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.submit(form)

    // Increase timeout significantly for slow CI runners
    const result = await screen.findByText(/demo\.archlinks\.com/i, {}, { timeout: 8000 })
    expect(result).toBeInTheDocument()
})

test('share button calls navigator.share', async () => {
    const shareMock = vi.fn()
    vi.stubGlobal('navigator', {
        ...navigator,
        share: shareMock,
        clipboard: { writeText: vi.fn() }
    })

    render(<App />)
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 8000 })

    const input = screen.getByPlaceholderText(/ENTER TARGET DATA/i)
    const form = screen.getByRole('form', { name: /shorten-form/i })
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.submit(form)

    const shareButton = await screen.findByRole('button', { name: /SHARE/i }, { timeout: 8000 })
    fireEvent.click(shareButton)

    expect(shareMock).toHaveBeenCalled()
})
