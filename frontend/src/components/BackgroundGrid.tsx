import { motion, useTransform, MotionValue } from 'framer-motion';

interface BackgroundGridProps {
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}

export const BackgroundGrid = ({ mouseX, mouseY }: BackgroundGridProps) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 opacity-[0.05] arch-grid-bg" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <motion.div
                style={{ x: useTransform(mouseX, [-500, 500], [40, -40]), y: useTransform(mouseY, [-500, 500], [20, -20]) }}
                className="absolute inset-[-10%] arch-wavy-grid opacity-40 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
            />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/[0.05] blur-[250px] rounded-full" />
        </div>
    );
};
