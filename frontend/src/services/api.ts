const API_URL = import.meta.env.VITE_API_URL || '';

export interface ShortenResponse {
    short_url: string;
}

export const api = {
    /**
     * Performs a health check on the backend.
     */
    async checkHealth(): Promise<boolean> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 2000);

        try {
            // Attempt to hit the dedicated health endpoint with cache-busting
            const response = await fetch(`${API_URL}/health?t=${Date.now()}`, {
                method: 'GET',
                signal: controller.signal,
                cache: 'no-store'
            });

            clearTimeout(id);

            // If response is HTML, it's SPA fallback -> Backend Down
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                return false;
            }

            return response.ok;
        } catch (err) {
            clearTimeout(id);
            return false;
        }
    },

    /**
     * Shortens a long URL.
     */
    async shorten(longUrl: string): Promise<string> {
        const response = await fetch(`${API_URL}/api/v1/shorten`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ long_url: longUrl })
        });

        if (!response.ok) {
            throw new Error('Failed to shorten url');
        }

        const data: ShortenResponse = await response.json();
        return data.short_url;
    }
};
