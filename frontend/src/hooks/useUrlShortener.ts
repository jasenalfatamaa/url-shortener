import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useUrlShortener() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDemo, setIsDemo] = useState(false);

    useEffect(() => {
        const checkConnectivity = async () => {
            const isHealthy = await api.checkHealth();
            setIsDemo(!isHealthy);
        };
        checkConnectivity();
    }, []);

    const handleShorten = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setIsLoading(true);

        if (isDemo) {
            // Logic without checking vi global for clean production code.
            // We will handle this in testing via vitest mocks/timing.
            await new Promise(resolve => setTimeout(resolve, 800));
            const fakeCode = Math.random().toString(36).substring(2, 7);
            setShortUrl(`http://demo.archlinks.com/${fakeCode}`);
            setIsLoading(false);
            return;
        }

        try {
            const result = await api.shorten(url);
            setShortUrl(result);
        } catch (err) {
            console.error(err);
            setIsDemo(true);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrl = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Architectural Link',
                    text: 'Check out this shortened link!',
                    url: shortUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            copyToClipboard();
            alert('Link copied to clipboard (Sharing not supported in this browser)');
        }
    };

    return {
        url,
        setUrl,
        shortUrl,
        isLoading,
        copied,
        isDemo,
        handleShorten,
        copyToClipboard,
        shareUrl
    };
}
