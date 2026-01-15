import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    isDemo: boolean;
}

export const Header = ({ isDemo }: HeaderProps) => {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                className="mb-8 flex flex-col items-center gap-4 w-full px-4 text-center"
            >
                <div className="flex items-center justify-center gap-3 text-[7px] sm:text-[8px] font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase text-white/50 w-full overflow-hidden">
                    <div className="flex-1 h-px bg-white/40 max-w-[40px]" />
                    <span className="shrink-0">Protocol: Alpha-Coordinate</span>
                    <div className="flex-1 h-px bg-white/40 max-w-[40px]" />
                </div>

                <AnimatePresence>
                    {isDemo && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="px-4 py-1 border border-[#D4AF37]/40 bg-[#D4AF37]/5 text-[#D4AF37] text-[7px] font-black tracking-[0.3em] uppercase rounded-full backdrop-blur-sm"
                        >
                            DEMO MODE ACTIVE // OFFLINE CORE
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 w-full px-2"
            >
                <h1 className="font-header text-3xl sm:text-4xl md:text-7xl font-light tracking-tight text-[#E5D5C0] leading-none mb-6 drop-shadow-lg break-words">
                    ARCHITECTURAL <span className="italic font-extralight text-white opacity-80 block sm:inline">LINKS</span>
                </h1>
                <motion.div
                    initial={{ width: 0 }} animate={{ width: '60%' }} transition={{ duration: 1.5 }}
                    className="h-px bg-gradient-to-r from-transparent via-[#D4C4B0]/60 to-transparent mx-auto mb-6"
                />
                <p className="text-[10px] sm:text-xs md:text-base text-white/60 font-medium tracking-[0.15em] uppercase drop-shadow-md px-4">
                    Your precise, shortened URLs.
                </p>
            </motion.div>
        </>
    );
};
