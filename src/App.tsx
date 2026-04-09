import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Stars, Music, Camera, Gift, Sparkles, ChevronLeft, ChevronRight, Volume2, VolumeX, X, Settings, Volume1, Music2, Check, Dog, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

// Initial photos - You can manually add your Cloudinary URLs here!
const INITIAL_PHOTOS = [
  { id: 1, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725626/1.png_u5eqfe.png', caption: 'Happy Birthday!' },
  { id: 2, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725624/2.png_la8iyo.png', caption: 'Beautiful Memories' },
  { id: 3, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725617/5.png_xxpian.png', caption: 'Beautiful Memories' },
  { id: 4, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725606/7.png_c7wozs.png', caption: 'Beautiful Memories' },
  { id: 5, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725599/8.png_k1eyrr.png', caption: 'Beautiful Memories' },
  { id: 6, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725596/3.png_msvfvg.png', caption: 'Beautiful Memories' },
  { id: 7, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725595/9.png_orrp0e.png', caption: 'Beautiful Memories' },
  { id: 8, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725590/4.png_colgil.png', caption: 'Beautiful Memories' },
  { id: 9, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725599/6.png_kuibju.png', caption: 'Beautiful Memories' },
  { id: 10, url: 'https://res.cloudinary.com/dcwluklbx/image/upload/v1775725596/10.png_pt6gvh.png', caption: 'Beautiful Memories' },
];

// Helper to optimize Cloudinary URLs
const optimizeCloudinaryUrl = (url: string, width: number = 800) => {
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
};

const BALLOON_COLORS = [
  'bg-pink-500', 'bg-purple-500', 'bg-rose-400', 'bg-fuchsia-500', 'bg-indigo-400'
];

const SOUNDS = {
  CANDLE: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  WISH: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  CONFETTI: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  BIRTHDAY_SONG: 'https://cdn.pixabay.com/audio/2022/11/25/audio_1495447101.mp3', // Simple Happy Birthday Piano
  MAIN_THEME: 'https://res.cloudinary.com/dcwluklbx/video/upload/v1775743401/bg1_a7wpib.mp3', // User's Custom Music
  ELEVEN_ELEVEN: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3', // Peaceful Guitar
  PUPPY: 'https://assets.mixkit.co/active_storage/sfx/1815/1815-preview.mp3' // Happy Bark
};

const TRACKS = [
  { id: 'MAIN_THEME', name: 'Birthday Special', url: SOUNDS.MAIN_THEME },
  { id: 'ELEVEN_ELEVEN', name: '11:11 (Instrumental)', url: SOUNDS.ELEVEN_ELEVEN },
  { id: 'PEACEFUL', name: 'Classic Piano', url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a7351b.mp3' }
];

const DancingDogs = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ x: Math.random() * 100 + "%", y: "110%" }}
        animate={{ 
          y: ["110%", "-10%"],
          x: [Math.random() * 100 + "%", Math.random() * 100 + "%"]
        }}
        transition={{ 
          duration: 15 + Math.random() * 10, 
          repeat: Infinity, 
          delay: i * 2,
          ease: "linear"
        }}
        className="absolute dog-dance flex items-center justify-center"
      >
        <Dog className="w-12 h-12 text-pink-500/50" />
      </motion.div>
    ))}
  </div>
);

const FlowerBouquet = () => (
  <motion.div 
    drag
    whileDrag={{ scale: 1.1, zIndex: 100 }}
    initial={{ scale: 0, rotate: -20 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", damping: 12 }}
    className="fixed bottom-10 left-10 z-40 cursor-grab active:cursor-grabbing"
  >
    <div className="relative flower-sway">
      <div className="text-8xl md:text-9xl drop-shadow-2xl">💐</div>
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl whitespace-nowrap border-2 border-white/20"
      >
        For Shivangi!
      </motion.div>
    </div>
  </motion.div>
);

const Letter = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <motion.div 
        drag
        whileDrag={{ scale: 1.1, zIndex: 100 }}
        initial={{ scale: 0, rotate: 10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, delay: 0.5 }}
        className="fixed bottom-10 right-10 z-40 cursor-grab active:cursor-grabbing"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
          <div className="text-8xl md:text-9xl drop-shadow-2xl">✉️</div>
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl whitespace-nowrap border-2 border-white/20"
          >
            Letter for Shivangi!
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-gray-900">A Special Note</h3>
                    <p className="text-sm text-gray-500">To: Shivangi (Bhondu Girl)</p>
                  </div>
                </div>
                
                <div className="prose prose-pink">
                  <p className="text-gray-700 leading-relaxed italic text-lg">
                    "Dearest Shivangi, on your 23rd birthday, I wanted to tell you how much you mean to everyone around you. Your smile is infectious, and your heart is pure gold. May this year bring you as much joy as you bring to the world. Happy Birthday, Bhondu Girl! Stay amazing."
                  </p>
                </div>
                
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-gray-400 font-mono text-sm">With love, Sam</p>
                  <div className="flex gap-2">
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [litCandles, setLitCandles] = useState<number[]>([]);
  const [wishMade, setWishMade] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isNearCake, setIsNearCake] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [currentTrackId, setCurrentTrackId] = useState('PEACEFUL');
  const [showSettings, setShowSettings] = useState(false);
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [giftItems, setGiftItems] = useState<{ id: number; x: number; y: number; startX: number; startY: number; delay: number; scale: number; rotation: number; emoji: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cakeSectionRef = useRef<HTMLElement | null>(null);
  const giftBoxRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // We are now using manual Cloudinary URLs in INITIAL_PHOTOS
    // No need to fetch from server anymore for Option 1
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearCake(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (cakeSectionRef.current) {
      observer.observe(cakeSectionRef.current);
    }

    return () => observer.disconnect();
  }, [isStarted]);

  useEffect(() => {
    if (audioRef.current && isStarted) {
      const selectedTrack = TRACKS.find(t => t.id === currentTrackId)?.url || SOUNDS.MAIN_THEME;
      const currentSrc = isNearCake ? SOUNDS.BIRTHDAY_SONG : selectedTrack;
      
      if (audioRef.current.src !== currentSrc) {
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.src = currentSrc;
        if (wasPlaying) {
          audioRef.current.play().catch(e => console.log("Music switch blocked", e));
        }
      }
    }
  }, [isNearCake, isStarted, currentTrackId]);

  const playSound = (url: string) => {
    if (!sfxEnabled) return;
    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(e => console.log("Sound blocked", e));
  };

  const handleOpenGift = () => {
    if (isGiftOpen || isShaking) return;
    
    // Calculate box position for explosion origin
    // We use the center of the giftBoxRef
    const rect = giftBoxRef.current?.getBoundingClientRect();
    const startX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const startY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

    setIsShaking(true);
    
    setTimeout(() => {
      setIsShaking(false);
      setIsGiftOpen(true);
      playSound(SOUNDS.PUPPY);
      playSound(SOUNDS.CONFETTI);
      triggerConfetti();
      
      const chocolates = ['🍫', '🍫', '🍫', '🍫', '🍫', '🍫', '🍫', '🍫', '🍫', '🍫'];
      const requestedEmojis = ['🌺', '🌷', '🪷', '🌸', '💮', '🏵️', '🐇', '🐁', '🐀', '🐈', '🐩', '🐄', '🦥', '🦙', '🦌', '🐐', '🐑', '🐏', '🦬', '🐕', '🐰', '🦊', '🐮', '🐻', '❄️', '🐷', '🐨', '🐽', '🐼', '🐹', '🦜', '🕊️', '🦤', '🦢', '🦆', '🐤', '🐥', '🦅', '🦩', '🪿', '🐣', '🐔', '🐓', '🐦', '🦚', '🔥', '🦃', '🐧', '🦭', '🦈', '🐬', '🐋', '🥯', '🧇', '🥞', '🍳', '🍕', '🥪', '🌮', '🌯', '🥙', '🥘', '🍛', '🍜', '🥟', '🍢', '🍦', '🍩', '🧁'];
      const emojis = [...chocolates, ...requestedEmojis];
      
      const newItems = [...Array(150)].map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 600;
        return {
          id: Date.now() + i,
          targetX: Math.cos(angle) * velocity,
          targetY: Math.sin(angle) * velocity - 200, // Bias upwards
          startX,
          startY,
          delay: Math.random() * 1.5,
          scale: 0.5 + Math.random() * 1.5,
          rotation: Math.random() * 2160,
          emoji: emojis[Math.floor(Math.random() * emojis.length)]
        };
      });
      setGiftItems(newItems);
      
      setTimeout(() => {
        setIsGiftOpen(false);
        setGiftItems([]);
      }, 12000);
    }, 800);
  };

  const handleStart = () => {
    setIsStarted(true);
    triggerConfetti();
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = volume;
      audioRef.current.play().catch((e) => {
        console.log("Autoplay blocked", e);
      });
    }
  };

  const toggleCandle = (index: number) => {
    if (wishMade) return;
    const isLighting = !litCandles.includes(index);
    if (isLighting) playSound(SOUNDS.CANDLE);
    
    setLitCandles(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const makeWish = () => {
    playSound(SOUNDS.WISH);
    setWishMade(true);
    setLitCandles([]);
    triggerConfetti();
    setTimeout(() => setWishMade(false), 5000);
  };

  const triggerConfetti = () => {
    playSound(SOUNDS.CONFETTI);
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const nextPhoto = () => setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () => setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    alert("Manual Mode: Please upload your photo to Cloudinary manually and add the URL to the code!");
  };

  return (
    <div className="min-h-screen bg-[#0a0502] selection:bg-pink-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Audio Element (Hidden) */}
      <audio 
        ref={audioRef}
        src={SOUNDS.MAIN_THEME} 
        loop 
      />

      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <div className="text-center space-y-8 px-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 tracking-tight">
                  A Special Surprise <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    Awaits You
                  </span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto">
                  Step into a world of celebration crafted just for Shivangi's 23rd birthday.
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-pink-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-600"
              >
                <div className="absolute inset-0 w-full h-full transition-all duration-300 rounded-full group-hover:bg-pink-700 blur-lg opacity-50"></div>
                <span className="relative flex items-center gap-2">
                  Enter Celebration <Gift className="w-5 h-5" />
                </span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.main 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto"
          >
            <DancingDogs />
            <FlowerBouquet />
            
            {/* Navigation / Controls Removed as per request */}

            {/* Audio Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="fixed top-24 right-6 z-50 w-72 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
                        <Volume1 className="w-4 h-4" /> Volume
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
                        <Music2 className="w-4 h-4" /> Background Music
                      </label>
                      <div className="space-y-2">
                        {TRACKS.map(track => (
                          <button
                            key={track.id}
                            onClick={() => setCurrentTrackId(track.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-sm transition-all ${
                              currentTrackId === track.id 
                                ? 'bg-pink-500/20 border border-pink-500/30 text-pink-400' 
                                : 'bg-white/5 border border-transparent text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {track.name}
                            {currentTrackId === track.id && <Check className="w-4 h-4" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                        Sound Effects
                      </label>
                      <button 
                        onClick={() => setSfxEnabled(!sfxEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${sfxEnabled ? 'bg-pink-500' : 'bg-gray-700'}`}
                      >
                        <motion.div 
                          animate={{ x: sfxEnabled ? 26 : 4 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero Section */}
            <section className="text-center mb-24 relative">
              {/* Floating Balloons Decoration */}
              <div className="absolute -top-20 left-0 right-0 flex justify-around pointer-events-none opacity-60">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`balloon-float w-12 h-16 rounded-t-full rounded-b-3xl ${BALLOON_COLORS[i % BALLOON_COLORS.length]} relative`}
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-1 h-10 bg-white/20" />
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-pink-400 uppercase bg-pink-400/10 rounded-full border border-pink-400/20">
                  Happy 23rd Birthday
                </span>
                <h2 className="text-6xl md:text-9xl font-display font-bold mb-8 leading-none tracking-tighter">
                  SHIVANGI'S <br />
                  <span className="italic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">BIG DAY</span>
                </h2>
                <div className="flex items-center justify-center gap-4 text-gray-400">
                  <Stars className="w-5 h-5 text-yellow-500" />
                  <p className="text-xl font-light tracking-widest uppercase">April 10, 2026</p>
                  <Stars className="w-5 h-5 text-yellow-500" />
                </div>
              </motion.div>
            </section>

            {/* Cake Section */}
            <section ref={cakeSectionRef} className="mb-32 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative w-full max-w-md"
              >
                <div className="text-center mb-12">
                  <h3 className="text-4xl font-display font-bold mb-4">Shivangi's Cake</h3>
                  <p className="text-gray-400">Click the candles to light them, then make a wish!</p>
                </div>

                <div className="relative flex flex-col items-center">
                  {/* Candles */}
                  <div className="flex gap-4 mb-[-8px] z-20">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="candle"
                        onClick={() => toggleCandle(i)}
                      >
                        {litCandles.includes(i) && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flame" 
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Cake Layers */}
                  <div className="w-64 h-24 cake-layer z-10">
                    <div className="absolute top-4 left-4 right-4 h-2 bg-pink-300/50 rounded-full" />
                    <div className="absolute top-10 left-8 right-8 h-2 bg-pink-300/50 rounded-full" />
                  </div>
                  <div className="w-80 h-28 cake-layer -mt-4">
                    <div className="absolute top-6 left-6 right-6 h-3 bg-pink-300/50 rounded-full" />
                    <div className="absolute top-14 left-10 right-10 h-3 bg-pink-300/50 rounded-full" />
                  </div>

                  {/* Cake Stand */}
                  <div className="w-96 h-4 bg-gray-800 rounded-full -mt-2" />
                  <div className="w-32 h-8 bg-gray-800 rounded-b-xl" />
                </div>

                <AnimatePresence>
                  {litCandles.length === 5 && !wishMade && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-12 text-center"
                    >
                      <button 
                        onClick={makeWish}
                        className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold rounded-full shadow-lg hover:shadow-yellow-500/50 transition-all active:scale-95"
                      >
                        Make a Wish! 🎂
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {wishMade && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                      <h2 className="text-6xl md:text-8xl font-display font-bold text-white neon-text text-center">
                        HAPPY <br /> BIRTHDAY!
                      </h2>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            {/* Photo Wall Section */}
            <section className="mb-32">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <h3 className="text-3xl font-display font-bold mb-2">Memory Wall</h3>
                  <p className="text-gray-500">A collection of your most beautiful moments.</p>
                </div>
                <div className="flex gap-4 items-center">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500/20 transition-all text-sm font-medium disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                    {isUploading ? 'Uploading...' : 'Add Photo'}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={prevPhoto} className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={nextPhoto} className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhotoIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute inset-0"
                  >
                    {photos.length > 0 && (
                      <>
                        <img 
                          key={photos[currentPhotoIndex].url}
                          src={photos[currentPhotoIndex].url} 
                          alt={photos[currentPhotoIndex].caption}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = `https://picsum.photos/seed/hero${currentPhotoIndex}/1200/600`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8">
                          <p className="text-sm font-mono text-pink-400 mb-2 uppercase tracking-widest">Moment {currentPhotoIndex + 1}</p>
                          <h4 className="text-4xl font-display font-bold">{photos[currentPhotoIndex].caption}</h4>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Grid of Photos (The "Wall" feel) */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
                {photos.map((photo, idx) => (
                  <motion.div
                    key={photo.id}
                    whileHover={{ 
                      scale: 1.1,
                      zIndex: 50,
                      y: -15,
                      rotate: 0,
                      boxShadow: "0 20px 40px rgba(236, 72, 153, 0.4)"
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`photo-frame ${idx % 2 === 0 ? 'rotate-2' : '-rotate-2'} cursor-pointer relative z-0`}
                    onClick={() => setSelectedPhotoIndex(idx)}
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-gray-800/50 mb-2 relative group">
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Camera className="w-8 h-8" />
                      </div>
                      {/* Loading Shimmer */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] z-0" />
                      <img 
                        key={photo.url}
                        src={optimizeCloudinaryUrl(photo.url, 600)} 
                        alt="" 
                        className="w-full h-full object-cover transition-all duration-500 relative z-10 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        onError={(e) => {
                          console.log("Image failed, using fallback", photo.id);
                          e.currentTarget.src = `https://picsum.photos/seed/bday${photo.id}/800/1000`;
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono text-center uppercase tracking-tighter">
                      #BDAY23_{photo.id}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Interactive Decoration Section */}
            <section className="grid md:grid-cols-2 gap-12 items-center mb-32">
              <div className="space-y-8">
                <div className="inline-flex p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                  <Sparkles className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-5xl font-display font-bold leading-tight">
                  A Gift <br />
                  <span className="text-gray-500">From Sam</span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Hey Shivangi, I wanted to send you something that would make you smile as much as you make others smile. Tap the gift box below to see your surprise!
                </p>
                
                <div className="relative pt-24 pb-12 flex justify-center">
                  <motion.div
                    ref={giftBoxRef}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleOpenGift}
                    className="cursor-pointer relative z-10 inline-block"
                  >
                    {/* Gift Box Container with 3D Perspective */}
                    <motion.div 
                      animate={isShaking ? { 
                        x: [-5, 5, -5, 5, 0],
                        rotate: [-2, 2, -2, 2, 0]
                      } : {}}
                      transition={{ duration: 0.1, repeat: Infinity }}
                      className="relative w-48 h-48"
                      style={{ perspective: '1000px' }}
                    >
                      {/* 3D Box Base */}
                      <div className="absolute inset-0 z-10">
                        {/* Front Face */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg shadow-2xl border-2 border-pink-300 overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-30" />
                          {/* Ribbons */}
                          <div className="w-full h-8 bg-yellow-400 absolute top-1/2 -translate-y-1/2 shadow-md z-10" />
                          <div className="h-full w-8 bg-yellow-400 absolute left-1/2 -translate-x-1/2 shadow-md z-10" />
                        </div>
                        
                        {/* Top Face (Visible when lid is off) */}
                        <div className="absolute top-0 left-0 w-full h-12 bg-purple-900/50 origin-bottom -translate-y-full skew-x-[-45deg] border-2 border-purple-800/30 z-0" />
                        
                        {/* Side Face */}
                        <div className="absolute top-0 right-0 w-12 h-full bg-purple-800 origin-left translate-x-full skew-y-[-45deg] border-2 border-purple-700 z-0" />
                      </div>
                      
                      <div className="absolute inset-0 flex items-center justify-center text-6xl z-20 opacity-50">✨</div>
                      
                      {/* Box Lid (Upper Deck) */}
                      <motion.div
                        initial={{ y: 0, x: 0, rotate: 0 }}
                        animate={isGiftOpen 
                          ? { y: -300, x: 150, rotate: 120, opacity: 0, scale: 1.5 } 
                          : { y: 0, x: 0, rotate: 0 }
                        }
                        transition={{ 
                          duration: 0.8, 
                          type: "spring", 
                          stiffness: 100,
                          damping: 12
                        }}
                        className="absolute z-30 w-52 h-14 -left-2 -top-4"
                      >
                        {/* Lid Top */}
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg border-2 border-pink-300 shadow-xl flex items-center justify-center overflow-hidden">
                          {/* Lid Ribbon */}
                          <div className="w-8 h-full bg-yellow-400 shadow-sm" />
                          <div className="w-full h-2 bg-yellow-400 absolute top-1/2 -translate-y-1/2 opacity-50" />
                        </div>
                        {/* Bow */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-7xl drop-shadow-lg">🎀</div>
                      </motion.div>

                      {/* Sparkle effect inside box */}
                      {isGiftOpen && (
                        <motion.div 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [1, 4, 3], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5 }}
                          className="absolute inset-0 bg-yellow-400/60 blur-3xl rounded-full z-0"
                        />
                      )}
                    </motion.div>

                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-pink-400 font-mono text-sm whitespace-nowrap font-bold tracking-widest">
                      — From Sam
                    </div>
                    
                    {!isGiftOpen && (
                      <motion.div
                        animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl whitespace-nowrap z-40 border-2 border-white/20"
                      >
                        Tap for a Surprise! ✨
                      </motion.div>
                    )}
                  </motion.div>
                  
                  {/* Surprise Items Explosion Overlay */}
                  <AnimatePresence>
                    {giftItems.map((item) => (
                      <motion.div
                        key={item.id}
                        style={{ 
                          position: 'fixed',
                          left: item.startX,
                          top: item.startY,
                          zIndex: 100,
                          pointerEvents: 'none'
                        }}
                        initial={{ scale: 0, x: "-50%", y: "-50%", opacity: 1, rotate: 0 }}
                        animate={{ 
                          x: ["-50%", `${item.targetX}px`], 
                          top: [`${item.startY}px`, `${item.startY + item.targetY}px`], 
                          scale: [0, item.scale, item.scale, 0], 
                          opacity: [0, 1, 1, 0],
                          rotate: item.rotation 
                        }}
                        transition={{ 
                          duration: 4 + Math.random() * 3, 
                          delay: item.delay,
                          ease: [0.23, 1, 0.32, 1]
                        }}
                        className="flex items-center justify-center text-5xl md:text-7xl"
                      >
                        {item.emoji}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-8">
                <div className="inline-flex p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                  <Sparkles className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-5xl font-display font-bold leading-tight">
                  Virtual Party <br />
                  <span className="text-gray-500">Decorations</span>
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  We've filled this digital space with all the things you love. From floating balloons to shimmering lights, every pixel is a celebration of your 23 years of brilliance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={triggerConfetti}
                    className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-pink-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    Pop Confetti <Sparkles className="w-4 h-4" />
                  </button>
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/friend${i}/100/100`} 
                          alt="" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-black bg-pink-600 flex items-center justify-center text-[10px] font-bold">
                      +12
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-3xl rounded-full" />
                <div className="glass-card p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Music className="w-6 h-6 text-pink-400 animate-pulse" />
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white fill-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-widest">Current Vibe</p>
                        <p className="text-xl font-bold">Birthday Celebration Mix</p>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ width: ["0%", "100%"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="h-full bg-pink-500"
                      />
                    </div>
                    <div className="flex justify-between text-xs font-mono text-gray-500">
                      <span>01:23</span>
                      <span>04:08</span>
                    </div>
                  </div>
                </div>

                {/* Shimmering Lights Decoration */}
                <div className="absolute -bottom-10 -right-10 flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]"
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Footer Message */}
            <footer className="text-center border-t border-white/10 pt-20">
              <h4 className="text-3xl font-display italic text-pink-400 mb-2">Happy Birthday Shiv (Bhondu Girl)</h4>
              <p className="text-xl text-gray-500 font-light mb-8">From Sam</p>
              <p className="mt-8 text-xs font-mono text-gray-700 uppercase tracking-[0.5em]">
                &copy; 2026 Virtual Celebration Studio
              </p>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Photo Enlargement Modal */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-12"
            onClick={() => setSelectedPhotoIndex(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-[110]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhotoIndex(null);
              }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Modal Loading Shimmer */}
                <div className="absolute inset-0 flex items-center justify-center -z-10">
                   <div className="w-32 h-32 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
                </div>
                <img
                  src={optimizeCloudinaryUrl(photos[selectedPhotoIndex].url, 1600)}
                  alt={photos[selectedPhotoIndex].caption}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl relative z-10"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/modal${selectedPhotoIndex}/1200/1600`;
                  }}
                />
                
                {/* Modal Navigation */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => (prev! - 1 + photos.length) % photos.length);
                  }}
                  className="absolute left-4 p-4 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => (prev! + 1) % photos.length);
                  }}
                  className="absolute right-4 p-4 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </div>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-6 text-center"
              >
                <h4 className="text-2xl font-display font-bold mb-2">{photos[selectedPhotoIndex].caption}</h4>
                <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Moment {selectedPhotoIndex + 1} of {photos.length}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
