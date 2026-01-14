import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import App from '../App'

// Simplified mocks for framer-motion to speed up tests and reduce CPU load in CI
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => children,
    useSpring: () => ({ set: vi.fn(), get: vi.fn() }),
    useTransform: () => ({ get: vi.fn() }),
}));

beforeEach(() => {
    vi.clearAllMocks();
    // Force connectivity failure for all tests to ensure Demo Mode is active
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject('Simulated connectivity failure')));
});

test('renders headline', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /ARCHITECTURAL/i })).toBeInTheDocument()
    // Always wait for the initial async effect to finish to prevent act() warnings
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 10000 })
})

test('activates demo mode when backend is unreachable', async () => {
    render(<App />)
    const demoBadge = await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 10000 })
    expect(demoBadge).toBeInTheDocument()
})

test('updates input value on change', async () => {
    render(<App />)
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 10000 })
    const input = screen.getByTestId('url-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    expect(input.value).toBe('https://google.com')
})

test('generates mock URL in demo mode', async () => {
    render(<App />)
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 10000 })

    const input = screen.getByTestId('url-input')
    const button = screen.getByTestId('shorten-button')

    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.click(button)

    // Using findByTestId for the result display
    const result = await screen.findByTestId('short-url-display', {}, { timeout: 10000 })
    expect(result).toHaveTextContent(/demo\.archlinks\.com/i)
})

test('share button calls navigator.share', async () => {
    const shareMock = vi.fn()
    vi.stubGlobal('navigator', {
        ...navigator,
        share: shareMock,
        clipboard: { writeText: vi.fn() }
    })

    render(<App />)
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 10000 })

    const input = screen.getByTestId('url-input')
    const button = screen.getByTestId('shorten-button')
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.click(button)

    // Wait for the share button via Test ID
    const shareButton = await screen.findByTestId('share-button', {}, { timeout: 10000 })
    fireEvent.click(shareButton)

    expect(shareMock).toHaveBeenCalled()
})
