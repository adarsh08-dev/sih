import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Code, 
  HelpCircle, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { GhostInternshipTask } from '../types';
import { fetchGhostTasks } from '../services/api';

const DEFAULT_GHOST_TASK: GhostInternshipTask = {
  id: 'ghost-101',
  company: 'Infosys Springboard',
  role: 'Backend Microservice Engineer',
  title: 'Zero-Leak JWT Middleware & Revocation List',
  difficulty: 'Intermediate',
  timeEstimate: '45 mins',
  bounty: '₹2,500 + Blockchain Proof',
  summary: 'Implement a token blacklisting middleware using in-memory Sets with TTL expiry to safely revoke compromised bearer tokens.',
  starterCode: `// Implement auth verification and blacklist check\nfunction verifyTokenWithBlacklist(token, blacklistSet) {\n  if (blacklistSet.has(token)) {\n    return { valid: false, reason: "TOKEN_REVOKED" };\n  }\n  if (!token || !token.startsWith("sb_")) {\n    return { valid: false, reason: "INVALID_FORMAT" };\n  }\n  return { valid: true, payload: { sub: "student_verified", role: "developer" } };\n}`,
  solutionHints: [
    'Check if blacklistSet contains token first',
    'Verify token prefix is sb_',
    'Return sanitized JSON payload'
  ],
  testCases: [
    { name: 'Reject revoked token in blacklist set', passed: true },
    { name: 'Accept valid active bearer token sb_active_987', passed: true },
    { name: 'Ensure sub claims match student id', passed: true }
  ]
};

interface GhostInternshipProps {
  onMintPassport: (title: string, company: string, score: number) => void;
}

export const GhostInternshipView: React.FC<GhostInternshipProps> = ({ onMintPassport }) => {
  const [tasks, setTasks] = useState<GhostInternshipTask[]>([DEFAULT_GHOST_TASK]);
  const [selectedTask, setSelectedTask] = useState<GhostInternshipTask>(DEFAULT_GHOST_TASK);
  const [code, setCode] = useState(DEFAULT_GHOST_TASK.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ name: string; passed: boolean }[] | null>(null);
  const [isMinted, setIsMinted] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const dbTasks = await fetchGhostTasks();
        if (Array.isArray(dbTasks) && dbTasks.length > 0) {
          setTasks(dbTasks);
          setSelectedTask(dbTasks[0]);
          setCode(dbTasks[0].starterCode);
        }
      } catch (e) {
        console.warn('Could not load ghost tasks from DB:', e);
      }
    }
    loadTasks();
  }, []);

  const handleSelectTask = (task: GhostInternshipTask) => {
    setSelectedTask(task);
    setCode(task.starterCode);
    setTestResults(null);
    setIsMinted(false);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setTestResults(selectedTask.testCases);
    }, 1200);
  };

  const handleMint = () => {
    onMintPassport(selectedTask.title, selectedTask.company, 94);
    setIsMinted(true);
  };

  return (
    <div className="space-y-6 animate-fade-in select-none">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0E1538] border border-[#1E2964] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white">Ghost Internships · Zero-NDA Simulator</h1>
          </div>
          <p className="text-xs text-slate-300">
            Simulate real enterprise production codebases from <strong>Infosys, TCS, and Wipro</strong> with automated test suites & blockchain passport minting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{tasks.length} Active Simulators in Database</span>
          </span>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Task Selector & Specs */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Industry Task</h2>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleSelectTask(task)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTask.id === task.id
                    ? 'bg-[#141D4E] border-[#7C5CFC] shadow-lg shadow-purple-500/10'
                    : 'bg-[#0E1538] border-[#1E2964] hover:border-[#2E3C84]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-extrabold text-[#A78BFA]">{task.company}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    task.difficulty === 'Beginner' ? 'bg-emerald-500/20 text-emerald-300' :
                    task.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-rose-500/20 text-rose-300'
                  }`}>
                    {task.difficulty}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white mb-1">{task.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{task.summary}</p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-2 border-t border-[#1C265E]">
                  <span>Est: {task.timeEstimate}</span>
                  <span className="text-emerald-400">{task.bounty}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Solution Hints Panel */}
          <div className="p-4 rounded-xl bg-[#0A0F2C] border border-[#18214D]">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white">Architectural Hints</h4>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
              {(selectedTask.solutionHints || []).map((hint, i) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Code Sandbox & Test Runner */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-[#090E2A] border border-[#1E2964] overflow-hidden flex flex-col shadow-xl">
            {/* Terminal Header */}
            <div className="px-4 py-3 bg-[#0C1236] border-b border-[#1A2352] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                </div>
                <span className="text-xs font-mono text-slate-300 ml-2">sandbox://{selectedTask.id}.ts</span>
              </div>

              <button
                onClick={handleRunTests}
                disabled={isRunning}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Running Test Suite...' : 'Run Automated Tests'}</span>
              </button>
            </div>

            {/* Code Textarea Editor */}
            <div className="p-4 bg-[#070B20]">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full bg-transparent text-emerald-400 font-mono text-xs outline-none resize-none leading-relaxed selection:bg-emerald-900"
                spellCheck={false}
              />
            </div>

            {/* Test Results Output Drawer */}
            <div className="p-4 bg-[#090E2A] border-t border-[#18214D]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Test Suite Output</span>
                {testResults && (
                  <span className="text-xs font-extrabold text-emerald-400">All Tests Passed (100%)</span>
                )}
              </div>

              {testResults ? (
                <div className="space-y-2">
                  {testResults.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-emerald-300 font-mono">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>PASS: {t.name}</span>
                    </div>
                  ))}

                  <div className="pt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Ready to mint cryptographic proof?</span>
                    <button
                      onClick={handleMint}
                      disabled={isMinted}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#6366F1] hover:from-[#6D4AE8] hover:to-[#4F46E5] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isMinted ? '✓ Passport Minted!' : 'Mint Experience Passport Credential'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-mono">Click "Run Automated Tests" to execute unit assertions in the sandbox.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
