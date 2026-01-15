import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle2, Share2 } from 'lucide-react';

interface ResultCardProps {
    shortUrl: string;
    copied: boolean;
    onCopy: () => void;
    onShare: () => void;
}

export const ResultCard = ({ shortUrl, copied, onCopy, onShare }: ResultCardProps) => {
    return (
        <AnimatePresence>
            {shortUrl && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="w-full max-w-2xl mb-16"
                    data-testid="result-card"
                >
                    <div className="p-6 md:p-8 border-2 border-[#D4AF37]/30 bg-[#161719]/80 backdrop-blur-xl text-center relative shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                        <div className="text-[9px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase text-[#D4AF37] mb-4">Construction Complete</div>
                        <div
                            className="text-xl md:text-3xl font-header font-bold text-white mb-6 md:mb-8 tracking-wider break-all"
                            data-testid="short-url-display"
                        >
                            {shortUrl}
                        </div>
                        <div className="flex justify-center gap-6">
                            <button
                                onClick={onCopy}
                                data-testid="copy-button"
                                className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/80 hover:text-white transition-all uppercase"
                            >
                                {copied ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                                {copied ? "COPIED" : "COPY"}
                            </button>
                            <div className="w-px h-4 bg-white/20" />
                            <button
                                onClick={onShare}
                                data-testid="share-button"
                                className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-white transition-all uppercase"
                            >
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
