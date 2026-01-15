import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi, beforeEach } from 'vitest'
import App from '../App'
import { api } from '../services/api'

// Professional Mocks: Isolation is key
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, whileInView, initial, animate, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => children,
    useSpring: () => ({ set: vi.fn(), get: vi.fn(), onChange: vi.fn() }),
    useTransform: () => ({ get: vi.fn() }),
}));

// Mock the API service entirely for clean tests
vi.mock('../services/api', () => ({
    api: {
        checkHealth: vi.fn(),
        shorten: vi.fn()
    }
}));

beforeEach(() => {
    vi.clearAllMocks();
    // Default to unreachable for all tests to trigger Demo Mode
    (api.checkHealth as any).mockResolvedValue(false);
    (api.shorten as any).mockResolvedValue('http://demo.archlinks.com/abcde');
});

test('renders headline', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /ARCHITECTURAL/i })).toBeInTheDocument()
    // Wait for Demo Mode indicator
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 10000 })
})

test('updates input value on change', async () => {
    render(<App />)
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 10000 })
    const input = screen.getByTestId('url-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'https://google.com' } })
    expect(input.value).toBe('https://google.com')
})

test('generates mock URL in demo mode', async () => {
    // For this test, we want to ensure it works even if the 800ms delay exists.
    // However, since we are in Demo Mode, we can't easily skip the delay without fake timers
    // unless we mock the whole hook or the Promise.
    // For stability in CI, let's use a long findBy timeout.

    render(<App />)
    await screen.findByText(/DEMO MODE ACTIVE/i, {}, { timeout: 10000 })

    const input = screen.getByTestId('url-input')
    const button = screen.getByTestId('shorten-button')

    fireEvent.change(input, { target: { value: 'https://google.com' } })
    fireEvent.click(button)

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

    const shareButton = await screen.findByTestId('share-button', {}, { timeout: 10000 })
    fireEvent.click(shareButton)

    expect(shareMock).toHaveBeenCalled()
})
