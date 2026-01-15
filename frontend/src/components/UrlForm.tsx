import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface UrlFormProps {
    url: string;
    setUrl: (url: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export const UrlForm = ({ url, setUrl, onSubmit, isLoading }: UrlFormProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mb-32 relative mt-12"
        >
            {/* Glowing White Outline Frame */}
            <div className="absolute -inset-[2px] bg-white opacity-20 blur-[1px] pointer-events-none" />
            <div className="absolute -inset-2 border border-white/20 pointer-events-none shadow-[0_0_30px_rgba(255,255,255,0.1)]" />

            <form
                aria-label="shorten-form"
                onSubmit={onSubmit}
                className="relative flex flex-col md:flex-row bg-[#111214]/90 backdrop-blur-3xl border border-white shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
            >
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="ENTER TARGET DATA (URL)..."
                    required
                    data-testid="url-input"
                    className="flex-1 bg-transparent border-none focus:ring-0 py-4 md:py-6 px-4 md:px-8 text-white text-[10px] md:text-xs font-black tracking-[0.2em] uppercase placeholder:text-white/20 min-w-0"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    data-testid="shorten-button"
                    className="bg-[#D4C4B0]/20 hover:bg-[#D4C4B0] text-[#D4C4B0] hover:text-[#000] border-t md:border-t-0 md:border-l border-white px-8 md:px-12 py-4 md:py-6 font-black tracking-[0.3em] uppercase text-[9px] md:text-[10px] transition-all duration-500 flex items-center justify-center gap-3"
                >
                    {isLoading ? "..." : "SHORTEN"}
                    <ChevronRight size={14} />
                </button>
            </form>
        </motion.div>
    );
};
