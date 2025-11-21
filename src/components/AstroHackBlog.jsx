import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Code, Layout, Globe, Shield, ChevronRight, Activity, User, Github } from 'lucide-react';

// --- EFFECTS ---

/**
 * 垂直下落代码雨 (Vertical Matrix Rain)
 * 已移除日文，只保留黑客风格字符
 */
const MatrixRain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const columns = Math.floor(width / 20);
    const drops = Array(columns).fill(1);
    
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]*&^%$#@!';

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.05)'; 
      ctx.fillRect(0, 0, width, height);
      ctx.font = '15px "Fira Code", monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const random = Math.random();
        if (random > 0.98) ctx.fillStyle = '#fff';
        else if (random > 0.95) ctx.fillStyle = '#b721ff';
        else ctx.fillStyle = '#0fa';

        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-20 pointer-events-none" />;
};

/**
 * 水平平移字符动画 (Horizontal Data Stream)
 */
const ScrollingDataBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const fontSize = 12;
    const totalStreams = Math.floor(height / fontSize / 2); 

    const streams = [];
    for (let i = 0; i < totalStreams; i++) {
        streams.push({
            x: Math.random() * width,
            y: i * fontSize * 2,
            speed: (Math.random() * 3 + 1) * (Math.random() > 0.5 ? 1 : -1),
            text: Array(Math.floor(Math.random() * 30 + 10)).fill(0).map(() => Math.random() > 0.5 ? '1' : '0').join(''),
            opacity: Math.random() * 0.2 + 0.02
        });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px "Fira Code", monospace`;
      
      streams.forEach(s => {
          ctx.fillStyle = `rgba(34, 211, 238, ${s.opacity})`;
          ctx.fillText(s.text, s.x, s.y);
          s.x += s.speed;
          if (s.speed > 0 && s.x > width) s.x = -300;
          if (s.speed < 0 && s.x < -300) s.x = width;
      });
      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const CRTOverlay = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden h-full w-full">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,3px_100%] pointer-events-none"></div>
    <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60"></div>
  </div>
);

export const GlitchText = ({ text, as: Component = 'span', className = '' }) => {
  return (
    <Component className={`relative inline-block group ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-purple-500 opacity-0 group-hover:opacity-70 animate-glitch-1 translate-x-[2px]">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyan-500 opacity-0 group-hover:opacity-70 animate-glitch-2 -translate-x-[2px]">
        {text}
      </span>
    </Component>
  );
};

/**
 * 打字机特效文字组件
 */
const TypewriterIntro = () => {
  const text = [
    '> OSCP owned',
    '> share the malware evasion technique and pentest knowledge.'
  ].join('\n');
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    setDisplay('');
    let i = 0;
    const timer = setInterval(() => {
      if (i >= text.length) {
        clearInterval(timer);
        return;
      }
      setDisplay(prev => prev + text.charAt(i));
      i++;
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="font-mono text-sm md:text-base leading-relaxed text-purple-400 h-full whitespace-pre-wrap">
      {display}
      <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse align-middle"></span>
    </div>
  );
};

/**
 * 个人信息卡片 (Updated Profile Card)
 */
const ProfileCard = () => {
  return (
    <div className="w-full h-full bg-black/90 p-6 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border border-zinc-800/50">
        
        {/* Avatar Section */}
        <div className="relative group shrink-0">
            <div className="absolute -inset-4 rounded-full border border-purple-500/30 border-t-purple-500 animate-spin-slow"></div>
            <div className="absolute -inset-2 rounded-full border border-cyan-500/20 border-b-cyan-500 animate-spin-reverse"></div>
            
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-zinc-800 group-hover:border-purple-500 transition-colors">
                <img 
                    src="https://i.imgur.com/6Y5j5qQ.jpg" 
                    alt="Avatar" 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent h-[50%] w-full animate-scan-down pointer-events-none"></div>
            </div>
            
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black shadow-[0_0_10px_#22c55e]"></div>
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left space-y-5 w-full flex flex-col h-full justify-center">
            <div>
                <h2 className="text-3xl font-bold text-white font-mono flex items-center justify-center md:justify-start gap-3">
                    Void0ps <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">Lvl. 99</span>
                </h2>
            </div>

            {/* Typewriter Intro Area (Replaces Stats Grid) */}
            <div className="bg-zinc-950/50 p-4 rounded-lg border border-purple-500/20 shadow-inner min-h-[120px] text-left relative group hover:border-purple-500/40 transition-colors">
                <div className="absolute top-0 right-0 p-1 opacity-50">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                    </div>
                </div>
                <TypewriterIntro />
            </div>

            {/* Social Actions - Only Github */}
            <div className="flex gap-3 justify-center md:justify-start">
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-white transition-all text-zinc-300 hover:text-white group">
                    <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="font-mono text-sm">Follow on GitHub</span>
                </a>
            </div>
        </div>
    </div>
  );
};

const BlogPostCard = ({ title, date, tags, slug, delay }) => (
  <a 
    href={`/posts/${slug}`} 
    className="group relative p-[1px] rounded-xl overflow-hidden block h-full"
    style={{ animation: `fadeInUp 0.6s ease-out ${delay}s backwards` }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-border-flow transition-opacity duration-500"></div>
    
    <div className="relative h-full bg-zinc-900/80 backdrop-blur-xl p-6 rounded-xl border border-zinc-800 group-hover:border-transparent transition-colors flex flex-col">
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 transition-opacity">
            <Activity className="text-purple-500 w-12 h-12" />
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
            {tags && tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-colors">
                    {tag}
                </span>
            ))}
        </div>
        
        <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-white transition-colors">
        {title}
        </h3>
        <div className="flex justify-between items-end mt-auto pt-4">
            <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-500">{date}</span>
            <div className="flex items-center text-purple-500 text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                ACCESS <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </div>
    </div>
  </a>
);

// --- MAIN LAYOUT ---

export default function AstroHackerBlog({ posts = [] }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const displayPosts = posts.length > 0 ? posts : [
    { 
        data: { title: "No Transmissions Found", date: new Date(), tags: ["System"], description: "Create your first post in Obsidian." },
        slug: "hello-world" 
    }
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden relative">
      
      <CRTOverlay />
      <MatrixRain />
      <ScrollingDataBackground />

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-[#050508]/70 backdrop-blur-xl z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono font-bold text-lg tracking-tighter hover:scale-105 transition-transform cursor-pointer z-50">
            <span className="text-purple-500">&lt;</span>
            <GlitchText text="Void0ps" className="text-zinc-100" />
            <span className="text-zinc-600">/&gt;</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-mono text-sm z-50">
            {['Blog', 'Projects', 'About'].map((item) => (
              <a key={item} href="#" className="text-zinc-500 hover:text-cyan-400 transition-colors relative group overflow-hidden">
                <span className="relative z-10">{item}</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400 -translate-x-[105%] group-hover:translate-x-0 transition-transform duration-300"></span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">
        
        {/* --- HERO SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className={`space-y-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-purple-400 text-xs font-mono mb-2 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              System Online
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white relative z-10">
              <GlitchText text="Exploit" /> <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 animate-gradient bg-300%">
                Complexity.
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed border-l-2 border-purple-500/30 pl-4">
              Digital Garden for Cyber Security & <span className="text-zinc-200">Offensive Operations</span>.
            </p>
          </div>

          {/* --- PROFILE CARD SECTION --- */}
          <div className={`relative transition-all duration-1000 delay-200 group perspective-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-tilt"></div>
            <div className="relative bg-[#0c0c11] rounded-lg border border-zinc-800 p-1 shadow-2xl transform transition-transform duration-500 group-hover:rotate-y-1 group-hover:rotate-x-1">
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950/80 rounded-t-lg">
                    <span className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Profile_Data.json
                    </span>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                        <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                    </div>
                </div>
                {/* Content */}
                <div className="h-[320px] flex flex-col justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                   <ProfileCard />
                </div>
            </div>
          </div>
        </div>

        {/* --- BLOG LIST --- */}
        <div className="relative">
            <div className="flex items-end justify-between mb-12 border-b border-zinc-800 pb-4">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Code className="text-cyan-400" />
                    Transmission Logs
                </h2>
                <div className="text-sm font-mono text-purple-400 flex items-center gap-1">
                    {displayPosts.length} Files Found
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayPosts.map((post, idx) => (
                    <BlogPostCard 
                        key={post.slug}
                        title={post.data.title} 
                        date={post.data.date ? new Date(post.data.date).toISOString().split('T')[0] : 'UNKNOWN'} 
                        tags={post.data.tags}
                        slug={post.slug}
                        delay={idx * 0.1}
                    />
                ))}
            </div>
        </div>

      </main>

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .bg-300\% { background-size: 300% 300%; }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient { animation: gradient 6s ease infinite; }
        
        @keyframes glitch-1 {
            0% { clip-path: inset(20% 0 80% 0); }
            20% { clip-path: inset(60% 0 10% 0); }
            40% { clip-path: inset(40% 0 50% 0); }
            60% { clip-path: inset(80% 0 5% 0); }
            80% { clip-path: inset(10% 0 60% 0); }
            100% { clip-path: inset(30% 0 30% 0); }
        }
        .animate-glitch-1 { animation: glitch-1 2.5s infinite linear alternate-reverse; }
        
        @keyframes glitch-2 {
            0% { clip-path: inset(10% 0 60% 0); }
            20% { clip-path: inset(30% 0 20% 0); }
            40% { clip-path: inset(90% 0 10% 0); }
            60% { clip-path: inset(5% 0 80% 0); }
            80% { clip-path: inset(70% 0 10% 0); }
            100% { clip-path: inset(20% 0 50% 0); }
        }
        .animate-glitch-2 { animation: glitch-2 3s infinite linear alternate-reverse; }

        @keyframes border-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-border-flow {
             background-size: 200% 200%;
             animation: border-flow 2s ease infinite;
        }
        
        /* New Animations for Profile */
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        
        @keyframes spin-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
        }
        .animate-spin-reverse { animation: spin-reverse 6s linear infinite; }
        
        @keyframes scan-down {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan-down { animation: scan-down 3s linear infinite; }
      `}</style>
    </div>
  );
}