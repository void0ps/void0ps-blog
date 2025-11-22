import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Zap, ChevronRight, Github, Activity, Lock, FileText, Search, Code } from 'lucide-react';

// -----------------------------------------------------------------------------
// 组件：黑客矩阵数字雨背景 (Canvas实现 - 降速 + 扫描线版)
// -----------------------------------------------------------------------------
const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let columns = 0;
    let rainDrops = [];

    const fontSize = 16;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&<>?';

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      rainDrops = Array.from({ length: columns }, () => Math.random() * -100);
    };

    init();
    window.addEventListener('resize', init);

    let lastTime = 0;
    const fps = 15;
    const interval = 1000 / fps;

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < interval) return;

      lastTime = currentTime - (deltaTime % interval);

      ctx.fillStyle = 'rgba(3, 3, 3, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const isBright = Math.random() > 0.95;
        ctx.fillStyle = isBright ? '#fff' : '#a855f7';

        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none opacity-25"
        style={{ background: '#030303' }}
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.15]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.4))',
          backgroundSize: '100% 4px',
        }}
      />
    </>
  );
};

// -----------------------------------------------------------------------------
// 组件：打字机效果文本
// -----------------------------------------------------------------------------
const TypewriterText = ({ text, delay = 30 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return (
    <span className="font-mono break-words">
      {displayText}
      <span className="animate-pulse text-purple-500">_</span>
    </span>
  );
};

// -----------------------------------------------------------------------------
// 组件：高科技文章卡片
// -----------------------------------------------------------------------------
const LogCard = ({ title, category, date, description, locked = false }) => (
  <div className="group relative h-full p-1">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/50 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

    <div className="relative h-full bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors duration-300 flex flex-col">
      <div className="h-1 w-full bg-gradient-to-r from-purple-900 via-purple-500 to-purple-900 opacity-50" />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-purple-300 bg-purple-900/20 border border-purple-500/20 rounded">
            {category}
          </span>
          {locked ? <Lock size={14} className="text-red-500/50" /> : <FileText size={14} className="text-slate-600" />}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
          {description}
        </p>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-xs font-mono text-slate-500">
          <span>{date}</span>
          <span className="group-hover:translate-x-1 transition-transform duration-300 text-purple-500 flex items-center gap-1">
            READ_LOG <ChevronRight size={12} />
          </span>
        </div>
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// 主页面组件
// -----------------------------------------------------------------------------
export default function LandingPage({ posts = [] }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const hasPosts = posts && posts.length > 0;
  const displayPosts = hasPosts ? posts.slice(0, 3) : [];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden relative">
      <MatrixBackground />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-900/20 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <span className="text-purple-500">&lt;</span>
          VoidOps
          <span className="text-slate-600 text-sm font-normal ml-1">/&gt;</span>
        </div>
        <div className="flex items-center gap-8 text-sm font-medium text-slate-400">
          {['Blog', 'Projects', 'About'].map((item) => {
            const href = item === 'Blog' ? '/' : item === 'About' ? '/about' : '#';
            return (
              <a
                key={item}
                href={href}
                className="hover:text-white transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            );
          })}
          <Search size={18} className="hover:text-white cursor-pointer" />
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 lg:pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
          <div
            className="relative z-10"
            style={{ transform: `translate(${mousePos.x * -5}px, ${mousePos.y * -5}px)` }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-mono mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM ONLINE
            </div>

            <h1 className="text-6xl lg:text-8xl font-bold leading-tight tracking-tighter mb-6">
              Exploit <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-200 to-white">
                Complexity.
              </span>
            </h1>

            <p className="text-xl text-slate-400 max-w-md mb-8 leading-relaxed border-l-2 border-purple-500/30 pl-6 bg-[#030303]/60 backdrop-blur-sm rounded-r">
              Digital Garden for Cyber Security &{' '}
              <span className="text-white font-medium">Offensive Operations</span>.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-purple-50 transition-colors flex items-center gap-2">
                <Activity size={18} /> Start Hack
              </button>
              <button className="px-6 py-3 border border-white/20 rounded hover:border-purple-500/50 hover:bg-purple-900/10 transition-all text-slate-300 font-mono bg-[#030303]/50 backdrop-blur-sm">
                man voidops
              </button>
            </div>
          </div>

          <div
            className="relative w-full max-w-lg mx-auto lg:mx-0"
            style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)` }}
          >
            <div className="absolute -right-10 -top-10 w-64 h-64 border border-purple-500/20 rounded-full animate-[spin_10s_linear_infinite] hidden sm:block pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-64 h-64 border-t-2 border-purple-500/40 rounded-full animate-[spin_15s_linear_infinite_reverse] hidden sm:block pointer-events-none" />

            <div className="relative bg-[#09090b]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-purple-900/20 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 shrink-0">
                <div className="text-xs font-mono text-slate-400">root@voidops:~</div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
              </div>

              <div className="p-6 font-mono text-sm flex flex-col h-full min-h-[320px]">
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-4 sm:gap-6 items-center mb-6">
                  <div className="w-20 h-20 rounded-full border-2 border-purple-500/30 relative flex items-center justify-center bg-black/50">
                    <Shield className="text-purple-500 w-8 h-8" />
                    <div className="absolute inset-0 border-t-2 border-purple-400 rounded-full animate-spin" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Void0ps{' '}
                      <span className="text-xs bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded ml-2 align-middle border border-purple-500/30">
                        Lvl. 99
                      </span>
                    </h2>
                    <div className="text-slate-500 text-xs mt-1">Red Teamer / Malware Analyst</div>
                  </div>
                </div>

                <div className="space-y-4 text-slate-300 flex-grow">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-purple-400">➜</span>
                      <span className="text-slate-500">cat</span>
                      <span>skills.txt</span>
                    </div>
                    <div className="pl-5 text-purple-200 break-words">
                      ['Evasion', 'Reverse Engineering', 'Active Directory']
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="text-purple-400">➜</span>
                      <span className="text-slate-500">whoami</span>
                    </div>
                    <div className="pl-5 text-slate-400 leading-relaxed">
                      &gt;{' '}
                      <TypewriterText text="OSCP owned. Sharing malware evasion techniques and pentest knowledge." />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="flex items-center gap-2 text-xs bg-white/10 hover:bg-purple-600 hover:text-white transition-colors px-3 py-2 rounded border border-white/10">
                    <Github size={14} /> Follow on GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <Code className="text-purple-500" /> Transmission Logs
              </h2>
              <p className="text-slate-500 text-sm mt-2 font-mono">Displaying recent signals from the void...</p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-xs font-mono text-purple-400 mb-1">SYSTEM_STATUS: NORMAL</div>
              <div className="text-xs font-mono text-slate-600">
                {hasPosts ? `${posts.length} FILES FOUND` : '3 FILES FOUND'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hasPosts ? (
              <>
                {displayPosts.map((post) => (
                  <a
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className="block h-full"
                  >
                    <LogCard
                      title={post.data.title}
                      category={(post.data.tags && post.data.tags[0]) || 'Log'}
                      date={
                        post.data.date
                          ? new Date(post.data.date).toISOString().split('T')[0]
                          : 'UNKNOWN'
                      }
                      description={post.data.description || 'No description provided.'}
                    />
                  </a>
                ))}
              </>
            ) : (
              <>
                <LogCard
                  title="自删除技术解析：Windows 内核机制探索"
                  category="Evasion"
                  date="2025-11-21"
                  description="深入分析 Windows 24H2 版本中内存映射文件与 POSIX 删除语义的对抗机制，绕过最新的 NTFS 保护。"
                />
                <LogCard
                  title="LummaC2 v4.0 反沙箱技术原理"
                  category="Anti-Sandbox"
                  date="2025-10-15"
                  description="拆解 LummaC2 窃密木马如何通过检测 CPU 周期差和鼠标移动轨迹来识别虚拟化环境。"
                />
                <LogCard
                  title="Hello World: Initializing Blog"
                  category="System"
                  date="2025-09-01"
                  description="The beginning of the digital garden. Setting up Astro + Tailwind environment."
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
