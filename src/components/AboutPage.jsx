import React, { useEffect, useState } from 'react';
import { GlitchText } from './AstroHackBlog.jsx';

const aboutLines = [
  '生命本身并没有预设的 return 值。',
  '一个人或许能构建出社会意义，但在这个熵增的宇宙里，',
  '生命本质上是一段没有注释的各种代码。',
  '',
  '我们嘲笑螳螂弑夫繁衍，却忘了那不过是底层基因编写的 hard-coded 指令。',
  '从宇宙的尺度看，我们的生命周期不过是一次从运行到崩溃（Crash）的过程。',
  '人类或许永远无法逃逸太阳系这个巨大的“沙箱”，',
  '我们都是坐井观天的观察者，守着属于自己的那一口井。',
  '',
  '既然无法改变系统的边界，那就专注于当下的运行环境。',
  '去寻找你真正热爱的漏洞与解法。',
  '',
  'Keep Hacking, and Try Harder.',
];

const TypewriterBlock = () => {
  const [displayLines, setDisplayLines] = useState(['']);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentLine = aboutLines[lineIndex] ?? '';

    if (lineIndex >= aboutLines.length) return;

    const timer = setTimeout(() => {
      if (charIndex <= currentLine.length) {
        setDisplayLines(prev => {
          const newLines = [...prev];
          newLines[lineIndex] = currentLine.slice(0, charIndex);
          return newLines;
        });
        setCharIndex(c => c + 1);
      } else {
        // 当前行结束，准备下一行
        if (lineIndex < aboutLines.length - 1) {
          setDisplayLines(prev => [...prev, '']);
        }
        setLineIndex(i => i + 1);
        setCharIndex(0);
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [lineIndex, charIndex]);

  return (
    <div className="font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap">
      {displayLines.map((line, idx) => (
        <div key={idx} className="mb-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400">
            {line}
          </span>
          {idx === lineIndex && lineIndex < aboutLines.length && (
            <span className="inline-block w-2 h-4 bg-purple-500 ml-1 animate-pulse align-middle" />
          )}
        </div>
      ))}
    </div>
  );
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-zinc-300 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),transparent_55%),radial-gradient(circle_at_bottom,_rgba(45,212,191,0.2),transparent_55%)]" />

      <nav className="fixed top-0 w-full border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-mono font-bold text-lg tracking-tighter hover:scale-105 transition-transform">
            <span className="text-purple-500">&lt;</span>
            <GlitchText text="Void0ps" className="text-zinc-100" />
            <span className="text-zinc-600">/&gt;</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-zinc-500">
            <a href="/" className="hover:text-cyan-400 transition-colors">Blog</a>
            <span className="text-cyan-400">About</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <header className="mb-10 border-b border-zinc-800 pb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-purple-400 mb-2">/etc/void0ps/about</p>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                <GlitchText text="About this system" />
              </h1>
            </div>
            <div className="text-right text-xs font-mono text-zinc-500">
              <div className="flex items-center justify-end gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22c55e]" />
                <span>STATUS: RUNNING</span>
              </div>
            </div>
          </header>

          <section className="relative bg-zinc-950/80 border border-zinc-800 rounded-lg p-6 md:p-8 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-40 pointer-events-none bg-[linear-gradient(0deg,transparent_0,transparent_95%,rgba(161,161,170,0.12)_100%)] bg-[length:100%_3rem]" />

            <div className="relative">
              <div className="mb-6 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>[void0ps@about]$ cat philosophy.log</span>
                <span>encoding: utf-8</span>
              </div>

              <TypewriterBlock />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
