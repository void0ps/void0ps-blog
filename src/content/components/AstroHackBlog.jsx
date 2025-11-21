import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cpu, Zap, Code, Layout, Globe, Shield, ChevronRight, X, Activity } from 'lucide-react';

// --- COMPONENTS ---

/**
 * 故障文字组件 (Glitch Text Effect)
 */
const GlitchText = ({ text, as: Component = 'span', className = '' }) => {
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
 * SQL Terminal Island - 增加了自动打字动画
 */
const SQLTerminalIsland = () => {
  const [lines, setLines] = useState([
    { type: 'system', text: 'Connected to safe_core_v2...' },
    { type: 'system', text: 'Interactive Island loaded.' },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  
  const fullCommand = 'SELECT * FROM projects WHERE status="active"';

  useEffect(() => {
    // Simulate typing
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullCommand.length) {
        setCurrentInput(fullCommand.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        // After typing, show result mock
        setTimeout(() => {
           setLines(prev => [...prev, 
             { type: 'input', text: fullCommand },
             { type: 'result', text: 'Query OK, 6 rows in set (0.04 sec)' }
           ]);
           setCurrentInput(''); // clear input line as it's moved to history
        }, 500);
      }
    }, 50); // Typing speed

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="w-full h-full bg-black/90 font-mono text-sm p-4 rounded-lg border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] relative overflow-hidden group backdrop-blur-sm">
      {/* Island Indicator */}
      <div className="absolute top-2 right-2 bg-orange-500/10 border border-orange-500/50 text-orange-400 text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
        ⚡ Astro Island (Hydrated)
      </div>

      {/* Window Controls */}
      <div className="flex gap-1.5 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
      </div>
      
      {/* Terminal Content */}
      <div className="space-y-2 relative z-10">
        {lines.map((line, i) => (
          <div key={i} className={`${
            line.type === 'input' ? 'text-cyan-400 font-bold' : 
            line.type === 'result' ? 'text-green-400' : 'text-zinc-500'
          }`}>
            {line.type === 'input' && <span className="mr-2 text-purple-500">➜</span>}
            {line.text}
          </div>
        ))}
        {/* Active Typing Line */}
        {lines.length < 4 && (
            <div className="text-cyan-400 font-bold">
                <span className="mr-2 text-purple-500">➜</span>
                {currentInput}
                <span className="animate-pulse inline-block w-2 h-4 bg-purple-500 ml-1 align-middle"></span>
            </div>
        )}
      </div>
      
      {/* CRT Scanline & Vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none z-0"></div>
    </div>
  );
};

/**
 * 博客卡片 - 增加了流光边框效果
 */
const BlogPostCard = ({ title, date, tags, delay }) => (
  <div 
    className="group relative p-[1px] rounded-xl overflow-hidden"
    style={{ animation: `fadeInUp 0.6s ease-out ${delay}s backwards` }}
  >
    {/* Animated Border Gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-border-flow transition-opacity duration-500"></div>
    
    {/* Card Content */}
    <div className="relative h-full bg-zinc-900/80 backdrop-blur-xl p-6 rounded-xl border border-zinc-800 group-hover:border-transparent transition-colors">
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 transition-opacity">
            <Activity className="text-purple-500 w-12 h-12" />
        </div>

        <div className="flex gap-2 mb-4">
            {tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-colors">
                    {tag}
                </span>
            ))}
        </div>
        
        <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-white transition-colors">
        {title}
        </h3>
        <div className="flex justify-between items-end mt-auto">
            <span className="text-xs font-mono text-zinc-600 group-hover:text-zinc-500">{date}</span>
            <div className="flex items-center text-purple-500 text-sm font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                READ_LOG <ChevronRight className="w-4 h-4 ml-1" />
            </div>
        </div>
    </div>
  </div>
);

// --- MAIN LAYOUT ---

export default function AstroHackerBlog() {
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

  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden relative">
      
      {/* --- EFFECTS LAYER --- */}
      
      {/* 1. Mouse Spotlight (Flashlight effect) */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124, 58, 237, 0.06), transparent 40%)`
        }}
      />

      {/* 2. Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f1f2e2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* 3. Falling Binary Numbers (Subtle) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.02] z-0 font-mono text-xs select-none">
         <div className="absolute top-10 left-[10%] animate-float-slow">01010101</div>
         <div className="absolute top-40 left-[80%] animate-float-slower">1011001</div>
         <div className="absolute top-[60%] left-[20%] animate-float-slow">001011</div>
         <div className="absolute top-[80%] left-[90%] animate-float-slower">111000</div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-[#050508]/70 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono font-bold text-lg tracking-tighter hover:scale-105 transition-transform cursor-pointer">
            <span className="text-purple-500">&lt;</span>
            <GlitchText text="Void0ps" className="text-zinc-100" />
            <span className="text-zinc-600">/&gt;</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-mono text-sm">
            {['Blog', 'Projects', 'Uses', 'About'].map((item) => (
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
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-purple-400 text-xs font-mono mb-2 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              System Online
            </div>
            
            {/* Main Title with Glitch Effect on Hover */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white relative z-10">
              <GlitchText text="Exploit" /> <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500 animate-gradient bg-300%">
                Complexity.
              </span>
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-lg leading-relaxed border-l-2 border-purple-500/30 pl-4">
              Exploring the depths of cybersecurity, reverse engineering, and algorithmic chaos. <span className="text-zinc-200">Built for speed, designed for hackers.</span>
            </p>

            <div className="flex gap-4 pt-4">
              <button className="px-6 py-3 bg-zinc-100 text-black font-bold rounded hover:bg-purple-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                Read Articles
              </button>
              <button className="group px-6 py-3 border border-zinc-700 rounded text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition-all font-mono flex items-center gap-2">
                <span>ssh connect</span>
                <Terminal className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
              </button>
            </div>
          </div>

          {/* --- ASTRO ISLAND DEMO --- */}
          <div className={`relative transition-all duration-1000 delay-200 group perspective-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Animated Glow Behind */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-tilt"></div>
            
            {/* The "Island" Container */}
            <div className="relative bg-[#0c0c11] rounded-lg border border-zinc-800 p-1 shadow-2xl transform transition-transform duration-500 group-hover:rotate-y-1 group-hover:rotate-x-1">
                <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-950/80 rounded-t-lg">
                    <span className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                        <Layout className="w-3 h-3" />
                        Layout.astro
                    </span>
                    <div className="flex gap-2">
                        <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-700">Server</span>
                    </div>
                </div>
                <div className="p-6 h-[320px] flex flex-col justify-center items-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                   {/* The Interactive React Component */}
                   <SQLTerminalIsland />
                   
                   {/* Explanatory Label */}
                   <div className="mt-6 flex items-center gap-3 text-xs text-zinc-500 font-mono bg-black/50 px-3 py-1 rounded-full border border-zinc-800">
                       <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                       React Component Hydrated
                   </div>
                </div>
            </div>
          </div>
        </div>

        {/* --- FEATURE GRID (BENTO) --- */}
        <div className="mb-32">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Cpu className="text-purple-500 animate-pulse" />
                Technical Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full md:h-64">
                {/* Large Bento Item */}
                <div className="md:col-span-2 bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-900/50 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                    {/* Background Animation */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-purple-600/20 transition-colors"></div>
                    
                    <Globe className="w-8 h-8 text-cyan-400 mb-4 group-hover:rotate-12 transition-transform duration-500" />
                    <h3 className="text-xl font-bold text-white mb-2">Global Edge Delivery</h3>
                    <p className="text-zinc-400 text-sm max-w-md">
                        Content is pre-rendered at build time and served from the edge. <br/>
                        <span className="text-green-400">Zero cold starts</span>, 100/100 Lighthouse scores.
                    </p>
                    
                    {/* Decorative lines */}
                    <div className="absolute bottom-4 right-6 flex gap-1 opacity-30">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-4 bg-zinc-500 rounded-full"></div>)}
                    </div>
                </div>
                
                {/* Small Bento Item */}
                <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-900/50 hover:border-yellow-500/30 transition-all group flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Zap className="w-10 h-10 text-yellow-400 mb-4 group-hover:scale-110 group-hover:text-yellow-300 transition-all duration-300" />
                    <h3 className="text-lg font-bold text-white">Blazing Fast</h3>
                    <p className="text-zinc-500 text-xs mt-2">Astro strips unused JavaScript automatically.</p>
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
                <a href="#" className="text-sm font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 group">
                    view_all_logs() <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BlogPostCard 
                    title="Zero-Day Analysis: Kernel Panic" 
                    date="2023-11-20" 
                    tags={['Kernel', 'Exploit']}
                    delay={0.1}
                />
                <BlogPostCard 
                    title="Building a C2 Server with Go" 
                    date="2023-11-15" 
                    tags={['Golang', 'Malware']}
                    delay={0.2}
                />
                <BlogPostCard 
                    title="React Islands in Astro" 
                    date="2023-11-10" 
                    tags={['Astro', 'Frontend']}
                    delay={0.3}
                />
                 <BlogPostCard 
                    title="Understanding SM3 Hashing" 
                    date="2023-11-05" 
                    tags={['Crypto', 'SM3']}
                    delay={0.4}
                />
                 <BlogPostCard 
                    title="SQL Injection in 2024" 
                    date="2023-10-28" 
                    tags={['WebSec', 'SQL']}
                    delay={0.5}
                />
                 <BlogPostCard 
                    title="Vim: The Editor of Gods" 
                    date="2023-10-15" 
                    tags={['Linux', 'Productivity']}
                    delay={0.6}
                />
            </div>
        </div>

      </main>

      <footer className="border-t border-zinc-900 bg-[#020203] py-12 mt-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-zinc-600 text-sm font-mono">
                  © 2024 Void0ps // Built with <span className="text-white">Astro</span> & React
              </div>
              <div className="flex gap-6">
                  <Shield className="w-5 h-5 text-zinc-700 hover:text-purple-500 cursor-pointer hover:scale-110 transition-transform" />
                  <Terminal className="w-5 h-5 text-zinc-700 hover:text-cyan-500 cursor-pointer hover:scale-110 transition-transform" />
              </div>
          </div>
      </footer>

      {/* GLOBAL STYLES FOR ANIMATIONS */}
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
        
        /* Glitch Animations */
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

        /* Floating Binary */
        @keyframes float {
            0% { transform: translateY(0px); opacity: 0.05; }
            50% { transform: translateY(-20px); opacity: 0.1; }
            100% { transform: translateY(0px); opacity: 0.05; }
        }
        .animate-float-slow { animation: float 8s ease-in-out infinite; }
        .animate-float-slower { animation: float 12s ease-in-out infinite; }

        /* Border Flow */
        @keyframes border-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-border-flow {
             background-size: 200% 200%;
             animation: border-flow 2s ease infinite;
        }
      `}</style>
    </div>
  );
}