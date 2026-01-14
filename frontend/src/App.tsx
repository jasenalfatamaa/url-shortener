import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion'
import { Copy, CheckCircle2, ChevronRight, Share2, BarChart3, ShieldCheck, Zap } from 'lucide-react'

export default function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  const mouseX = useSpring(0, { stiffness: 50, damping: 20 })
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 })

  useEffect(() => {
    // Check backend connectivity
    const checkConnectivity = async () => {
      try {
        const apiUrl = import.meta.env.DEV ? 'http://localhost:5003' : ''
        // Use a 2-second timeout for the ping
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), 2000)

        await fetch(`${apiUrl}/api/v1/shorten`, {
          method: 'OPTIONS', // Just a preflight check
          signal: controller.signal
        })
        clearTimeout(id)
        setIsDemo(false)
      } catch (err) {
        console.warn('Backend unreachable, switching to Demo Mode')
        setIsDemo(true)
      }
    }

    checkConnectivity()

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2)
      mouseY.set(e.clientY - window.innerHeight / 2)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return
    setIsLoading(true)

    if (isDemo) {
      // Simulate backend delay (skip in tests for stability)
      const isTest = import.meta.env.MODE === 'test' || import.meta.env.VITEST || !!(globalThis as any).vi;
      if (!isTest) {
        await new Promise(resolve => setTimeout(resolve, 800))
      }
      const fakeCode = Math.random().toString(36).substring(2, 7)
      setShortUrl(`http://demo.archlinks.com/${fakeCode}`)
      setIsLoading(false)
      return
    }

    try {
      const apiUrl = import.meta.env.DEV ? 'http://localhost:5003' : ''
      const response = await fetch(`${apiUrl}/api/v1/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ long_url: url })
      })
      if (!response.ok) throw new Error('Failed to shorten url')
      const data = await response.json()
      setShortUrl(data.short_url)
    } catch (err) {
      console.error(err)
      setIsDemo(true) // Fallback to demo if it fails mid-request
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Architectural Link',
          text: 'Check out this shortened link!',
          url: shortUrl,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: Copy to clipboard if navigator.share is not supported
      copyToClipboard()
      alert('Link copied to clipboard (Sharing not supported in this browser)')
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white selection:bg-[#D4AF37]/30 relative font-body flex flex-col items-center overflow-x-hidden">

      {/* BACKGROUND THEME (Enhanced Architectural Grid) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05] arch-grid-bg" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <motion.div
          style={{ x: useTransform(mouseX, [-500, 500], [40, -40]), y: useTransform(mouseY, [-500, 500], [20, -20]) }}
          className="absolute inset-[-10%] arch-wavy-grid opacity-40 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
        />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/[0.05] blur-[250px] rounded-full" />
      </div>

      {/* MAIN INTERFACE */}
      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center px-6 pt-32 pb-40">

        {/* Technical Identifier */}
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

        {/* Header */}
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

        {/* Glowing Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mb-32 relative mt-12 px-2"
        >
          {/* Glowing White Outline Frame */}
          <div className="absolute -inset-[2px] bg-white opacity-20 blur-[1px] pointer-events-none" />
          <div className="absolute -inset-2 border border-white/20 pointer-events-none shadow-[0_0_30px_rgba(255,255,255,0.1)]" />

          <form
            aria-label="shorten-form"
            onSubmit={handleShorten}
            className="relative flex flex-col md:flex-row bg-[#111214]/90 backdrop-blur-3xl border border-white shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="ENTER TARGET DATA (URL)..."
              required
              className="flex-1 bg-transparent border-none focus:ring-0 py-4 md:py-6 px-4 md:px-8 text-white text-[10px] md:text-xs font-black tracking-[0.2em] uppercase placeholder:text-white/20 min-w-0"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#D4C4B0]/20 hover:bg-[#D4C4B0] text-[#D4C4B0] hover:text-[#000] border-t md:border-t-0 md:border-l border-white px-8 md:px-12 py-4 md:py-6 font-black tracking-[0.3em] uppercase text-[9px] md:text-[10px] transition-all duration-500 flex items-center justify-center gap-3"
            >
              {isLoading ? "..." : "SHORTEN"}
              <ChevronRight size={14} />
            </button>
          </form>
        </motion.div>

        {/* Result Card */}
        <AnimatePresence>
          {shortUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="w-full max-w-2xl mb-16 px-2"
            >
              <div className="p-6 md:p-8 border-2 border-[#D4AF37]/30 bg-[#161719]/80 backdrop-blur-xl text-center relative shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                <div className="text-[9px] md:text-[10px] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase text-[#D4AF37] mb-4">Construction Complete</div>
                <div className="text-xl md:text-3xl font-header font-bold text-white mb-6 md:mb-8 tracking-wider break-all">{shortUrl}</div>
                <div className="flex justify-center gap-6">
                  <button onClick={copyToClipboard} className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/80 hover:text-white transition-all uppercase">
                    {copied ? <CheckCircle2 size={16} className="text-green-400" /> : <Copy size={16} />}
                    {copied ? "COPIED" : "COPY"}
                  </button>
                  <div className="w-px h-4 bg-white/20" />
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white/40 hover:text-white transition-all uppercase"
                  >
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Grid - Increased margin top to fill more screen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 w-full border-t border-white/20 mt-28">
          {[
            { label: "PRECISION", val: "99.99%", icon: BarChart3 },
            { label: "SECURITY", val: "AES-256", icon: ShieldCheck },
            { label: "LATENCY", val: "< 1.2ms", icon: Zap }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
              className="p-10 text-center hover:bg-white/[0.03] transition-colors border-r last:border-r-0 border-white/10"
            >
              <div className="flex justify-center text-[#D4AF37] mb-6 drop-shadow-glow"><item.icon size={28} strokeWidth={1} /></div>
              <div className="text-[10px] font-black tracking-[0.4em] text-white/40 mb-2 uppercase">{item.label}</div>
              <div className="text-2xl font-header font-bold text-white uppercase">{item.val}</div>
            </motion.div>
          ))}
        </div>

      </main>

      <footer className="mt-auto py-10 opacity-30 text-[9px] font-black tracking-[0.3em] uppercase text-white">
        Architectural Link System // v4.0.1 Stable
      </footer>

      {/* Atmospheric depth */}
      <motion.div
        style={{ x: mouseX, y: mouseY }}
        className="fixed top-0 left-0 w-[600px] h-[600px] bg-[#D4AF37]/[0.03] blur-[150px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-inner"
      />
    </div>
  )
}
