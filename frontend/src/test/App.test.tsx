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

test('renders headline', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /ARCHITECTURAL/i })).toBeInTheDocument()
})

test('activates demo mode when backend is unreachable', async () => {
    render(<App />)
    // Wait for the demo mode badge to appear
    const demoBadge = await screen.findByText(/DEMO MODE ACTIVE/i)
    expect(demoBadge).toBeInTheDocument()
})

test('updates input value on change', () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/ENTER TARGET DATA/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    expect(input.value).toBe('https://google.com')
})

test('generates mock URL in demo mode', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText(/ENTER TARGET DATA/i)
    const button = screen.getByRole('button', { name: /SHORTEN/i })

    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.click(button)

    const result = await screen.findByText(/demo\.archlinks\.com/i)
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

    // First trigger shorten to show the result card
    const input = screen.getByPlaceholderText(/ENTER TARGET DATA/i)
    const button = screen.getByRole('button', { name: /SHORTEN/i })
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.click(button)

    const shareButton = await screen.findByRole('button', { name: /SHARE/i })
    fireEvent.click(shareButton)

    expect(shareMock).toHaveBeenCalled()
})
