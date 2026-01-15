import { motion } from 'framer-motion';
import { useUrlShortener } from './hooks/useUrlShortener';
import { useMousePosition } from './hooks/useMousePosition';
import { BackgroundGrid } from './components/BackgroundGrid';
import { Header } from './components/Header';
import { UrlForm } from './components/UrlForm';
import { ResultCard } from './components/ResultCard';
import { StatsGrid } from './components/StatsGrid';

export default function App() {
  const { mouseX, mouseY } = useMousePosition();
  const {
    url,
    setUrl,
    shortUrl,
    isLoading,
    copied,
    isDemo,
    handleShorten,
    copyToClipboard,
    shareUrl
  } = useUrlShortener();

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white selection:bg-[#D4AF37]/30 relative font-body flex flex-col items-center overflow-x-hidden">
      {/* BACKGROUND THEME */}
      <BackgroundGrid mouseX={mouseX} mouseY={mouseY} />

      {/* MAIN INTERFACE */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center px-6 pt-32 pb-40">
        <Header isDemo={isDemo} />

        <UrlForm
          url={url}
          setUrl={setUrl}
          onSubmit={handleShorten}
          isLoading={isLoading}
        />

        <ResultCard
          shortUrl={shortUrl}
          copied={copied}
          onCopy={copyToClipboard}
          onShare={shareUrl}
        />

        <StatsGrid />
      </main>

      <footer className="mt-auto py-10 opacity-30 text-[9px] font-black tracking-[0.3em] uppercase text-white">
        Architectural Link System // v4.0.1 Stable
      </footer>

      {/* Atmospheric depth spot */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="fixed top-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-inner"
      />
    </div>
  );
}
