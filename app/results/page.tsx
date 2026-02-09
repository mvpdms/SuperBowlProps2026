"use client";

import { useState, useEffect } from "react";
import { sections } from "@/lib/questions";
import { officialAnswers, officialMVP } from "@/lib/official-answers";
import { Trophy, Users, ChevronLeft, RefreshCw, LayoutGrid, List, CheckCircle2, XCircle, Medal } from "lucide-react";

export default function ResultsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/results?t=${Date.now()}`, {
        cache: 'no-store'
      });
      if (res.ok) {
        const json = await res.json();
        
        // Calculate scores and sort
        const scoredData = json.map((submission: any) => {
          const answers = typeof submission.answers === 'string' ? JSON.parse(submission.answers) : submission.answers;
          let score = 0;
          
          Object.entries(officialAnswers).forEach(([qId, correctAns]) => {
            if (answers[qId] === correctAns) {
              score += 1;
            }
          });

          // MVP Tiebreaker bonus
          const mvpCorrect = submission.mvp?.toLowerCase().includes(officialMVP.toLowerCase()) || 
                             officialMVP.toLowerCase().includes(submission.mvp?.toLowerCase());

          return { ...submission, answers, score, mvpCorrect };
        }).sort((a: any, b: any) => {
          if (b.score !== a.score) return b.score - a.score;
          if (b.mvpCorrect !== a.mvpCorrect) return b.mvpCorrect ? 1 : -1;
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        });

        setData(scoredData);
      }
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const allQuestions = sections.flatMap(s => s.questions);
  const winner = data[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-[#121216] border border-[#22222a] p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Trophy className="w-64 h-64 text-[#00d4ff] rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3 text-[#00d4ff] font-black text-sm uppercase tracking-[0.3em]">
            <Trophy className="w-5 h-5" />
            Final Scoring Complete
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
            THE WINNERS CIRCLE
          </h1>
          <p className="text-gray-400 text-lg">
            Scoring based on <span className="text-white font-bold">{allQuestions.length}</span> official prop results
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4">
          <div className="bg-[#0b0b0e] border border-[#22222a] p-1 rounded-xl flex">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#00d4ff] text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-lg transition-all ${viewMode === "list" ? "bg-[#00d4ff] text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-[#1a1a20] border border-[#2c2c2c] rounded-xl hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all font-black text-sm uppercase tracking-widest"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
        </div>
      </div>

      {/* Winner Spotlight */}
      {!loading && winner && (
        <div className="bg-gradient-to-br from-[#00d4ff]/20 to-transparent border-2 border-[#00d4ff] rounded-3xl p-10 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Medal className="w-80 h-80 text-[#00d4ff]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="bg-[#00d4ff] p-8 rounded-2xl shadow-[0_0_50px_rgba(0,212,255,0.3)]">
              <Trophy className="w-16 h-16 text-black" />
            </div>
            <div className="text-center md:text-left space-y-2">
              <div className="text-[#00d4ff] font-black uppercase tracking-[0.4em] text-sm">Overall Champion</div>
              <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter">{winner.name}</h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 text-xs font-bold uppercase block">Final Score</span>
                  <span className="text-3xl font-black text-white">{winner.score} / {allQuestions.length}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
                  <span className="text-gray-400 text-xs font-bold uppercase block">MVP Tiebreaker</span>
                  <span className={`text-xl font-black ${winner.mvpCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {winner.mvpCorrect ? "CORRECT" : "INCORRECT"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><RefreshCw className="animate-spin text-[#00d4ff]" /></div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
          {data.map((submission, idx) => (
            <div key={idx} className={`bg-[#121216] border ${idx === 0 ? 'border-[#00d4ff]' : 'border-[#22222a]'} rounded-3xl overflow-hidden shadow-xl flex flex-col`}>
              <div className="p-8 space-y-6 flex-grow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Rank #{idx + 1}</span>
                      {idx === 0 && <span className="px-2 py-0.5 bg-[#00d4ff] text-black text-[8px] font-black rounded uppercase">Winner</span>}
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{submission.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#00d4ff] leading-none">{submission.score}</div>
                    <div className="text-[8px] font-bold text-gray-500 uppercase">Points</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#0b0b0e] rounded-xl border border-[#1a1a20]">
                    <span className="text-[10px] font-black text-gray-500 uppercase">MVP: {submission.mvp}</span>
                    {submission.mvpCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500/30" />}
                  </div>

                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {allQuestions.map(q => {
                      const isCorrect = submission.answers[q.id] === (officialAnswers as any)[q.id];
                      return (
                        <div key={q.id} className={`flex items-start justify-between p-2 rounded-lg ${isCorrect ? 'bg-green-500/5 border border-green-500/10' : 'bg-red-500/5 border border-red-500/10'}`}>
                          <div className="text-[10px] pr-2">
                            <span className="text-gray-500 font-bold mr-1">{q.id}.</span>
                            <span className="text-gray-300">{submission.answers[q.id] || "—"}</span>
                          </div>
                          {isCorrect ? <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-3 h-3 text-red-500 flex-shrink-0 mt-0.5" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0b0b0e; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2c2c2c; border-radius: 10px; }
      `}</style>
    </div>
  );
}
