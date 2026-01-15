import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Zap } from 'lucide-react';

const stats = [
    { label: "PRECISION", val: "99.99%", icon: BarChart3 },
    { label: "SECURITY", val: "AES-256", icon: ShieldCheck },
    { label: "LATENCY", val: "< 1.2ms", icon: Zap }
];

export const StatsGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 w-full border-t border-white/20 mt-28">
            {stats.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                    className="p-10 text-center hover:bg-white/[0.03] transition-colors border-r last:border-r-0 border-white/10"
                >
                    <div className="flex justify-center text-[#D4AF37] mb-6 drop-shadow-glow">
                        <item.icon size={28} strokeWidth={1} />
                    </div>
                    <div className="text-[10px] font-black tracking-[0.4em] text-white/40 mb-2 uppercase">{item.label}</div>
                    <div className="text-2xl font-header font-bold text-white uppercase">{item.val}</div>
                </motion.div>
            ))}
        </div>
    );
};
