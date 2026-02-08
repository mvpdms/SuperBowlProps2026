"use client";

import { useState, useEffect } from "react";
import { sections } from "@/lib/questions";
import { Trophy, Users, ChevronLeft, RefreshCw, LayoutGrid, List } from "lucide-react";

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
        setData(json);
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
            Super Bowl LX 2026
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
            THE LEADERBOARD
          </h1>
          <p className="text-gray-400 text-lg flex items-center gap-2">
            Viewing <span className="text-white font-bold px-2 py-0.5 bg-[#1a1a20] rounded-lg border border-[#2c2c2c]">{data.length}</span> active submissions
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-4">
          <div className="bg-[#0b0b0e] border border-[#22222a] p-1 rounded-xl flex">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-3 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#00d4ff] text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
              title="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-3 rounded-lg transition-all ${viewMode === "list" ? "bg-[#00d4ff] text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-[#1a1a20] border border-[#2c2c2c] rounded-xl hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all font-black text-sm uppercase tracking-widest disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "SYNCING..." : "REFRESH"}
          </button>
        </div>
      </div>

      {loading && data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <RefreshCw className="w-12 h-12 text-[#00d4ff] animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest">Loading entries...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-[#121216] border border-[#22222a] rounded-3xl p-20 text-center space-y-6">
          <div className="inline-flex p-6 bg-[#1a1a20] rounded-full text-gray-700 mb-4">
            <Users className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-white">NO SUBMISSIONS YET</h2>
          <p className="text-gray-500 max-w-md mx-auto">The board is waiting for its first contender. Share the link and get the game started!</p>
          <a href="/" className="inline-block px-10 py-4 bg-[#00d4ff] text-black font-black rounded-xl hover:scale-105 transition-all">
            SUBMIT YOURS NOW
          </a>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((submission, idx) => {
            const answers = typeof submission.answers === 'string' ? JSON.parse(submission.answers) : submission.answers;
            return (
              <div key={idx} className="group bg-[#121216] border border-[#22222a] rounded-3xl overflow-hidden shadow-xl hover:border-[#00d4ff]/50 transition-all duration-500 flex flex-col">
                <div className="p-8 space-y-6 flex-grow">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-[#00d4ff] uppercase tracking-[0.2em]">Participant</div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-[#00d4ff] transition-colors">
                        {submission.name}
                      </h3>
                    </div>
                    <div className="bg-[#1a1a20] px-3 py-1 rounded-full border border-[#2c2c2c] text-[10px] font-black text-gray-500">
                      #{data.length - idx}
                    </div>
                  </div>

                  <div className="p-4 bg-[#0b0b0e] rounded-2xl border border-[#1a1a20] space-y-2">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      Tiebreaker MVP
                    </div>
                    <div className="text-white font-bold italic uppercase">{submission.mvp}</div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Question Breakdown</div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {allQuestions.map(q => (
                        <div key={q.id} className="text-sm">
                          <p className="text-gray-500 mb-1 leading-tight"><span className="text-[#00d4ff] font-bold mr-1">{q.id}.</span> {q.text}</p>
                          <p className="text-white font-black bg-[#1a1a20] px-3 py-2 rounded-lg inline-block border border-[#2c2c2c]">
                            {answers[q.id] || "No Answer"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-8 py-4 bg-[#1a1a20] border-t border-[#22222a] flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase">
                  <span>Submitted</span>
                  <span className="text-gray-400">{new Date(submission.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View (Table) */
        <div className="bg-[#121216] border border-[#22222a] rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1a20] border-b border-[#22222a]">
                  <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Name</th>
                  <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">MVP Pick</th>
                  {allQuestions.map(q => (
                    <th key={q.id} className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest whitespace-nowrap min-w-[200px]">
                      Q{q.id}: {q.text.substring(0, 30)}...
                    </th>
                  ))}
                  <th className="px-8 py-6 text-xs font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#22222a]">
                {data.map((submission, idx) => {
                  const answers = typeof submission.answers === 'string' ? JSON.parse(submission.answers) : submission.answers;
                  return (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 font-black text-white uppercase italic">{submission.name}</td>
                      <td className="px-8 py-6 text-[#00d4ff] font-bold uppercase">{submission.mvp}</td>
                      {allQuestions.map(q => (
                        <td key={q.id} className="px-8 py-6 text-gray-300">
                          <span className="bg-[#0b0b0e] px-4 py-2 rounded-lg border border-[#22222a] whitespace-nowrap">
                            {answers[q.id] || "—"}
                          </span>
                        </td>
                      ))}
                      <td className="px-8 py-6 text-gray-500 text-xs font-bold whitespace-nowrap">
                        {new Date(submission.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-8">
        <a href="/" className="flex items-center gap-2 text-gray-500 hover:text-[#00d4ff] transition-colors font-black text-sm uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" />
          Back to Submission Form
        </a>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0b0b0e;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2c2c2c;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00d4ff;
        }
      `}</style>
    </div>
  );
}
