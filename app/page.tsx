"use client";

import { useState } from "react";
import { sections } from "@/lib/questions";
import { Trophy, CheckCircle2, Send } from "lucide-react";

export default function PropSheet() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [mvp, setMvp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (qId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("Please enter your name");
      return;
    }
    if (Object.keys(answers).length < 32) {
      alert("Please answer all 32 questions");
      return;
    }
    
    // For now, we simulate submission. 
    // In a real app, this would POST to /api/submit
    console.log("Submitting:", { name, answers, mvp });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
        <h1 className="text-4xl font-bold text-white">Entry Submitted!</h1>
        <p className="text-gray-400 text-lg">Good luck on Game Day, {name}.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-6 py-2 bg-[#1a1a20] border border-[#2c2c2c] rounded-lg hover:border-[#00d4ff] transition-all"
        >
          View Form
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#1a1a20] border border-[#2c2c2c] rounded-full text-[#00d4ff] text-sm font-bold tracking-wider">
          <Trophy className="w-4 h-4" />
          SUPER BOWL LX PROPS
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white italic">GAME DAY CHALLENGE</h1>
        <p className="text-gray-500">Fill out the prop sheet below for a chance to win the pool.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Name Input */}
        <div className="bg-[#121216] border border-[#22222a] p-8 rounded-2xl shadow-xl space-y-4">
          <label className="block text-sm font-bold text-[#888888] uppercase tracking-widest">Your Name</label>
          <input 
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter full name..."
            className="w-full bg-[#0b0b0e] border border-[#2c2c2c] rounded-xl px-6 py-4 text-xl text-white focus:border-[#00d4ff] transition-all"
          />
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title} className="space-y-6">
            <h2 className="text-2xl font-black text-[#00d4ff] flex items-center gap-4">
              <span className="h-px flex-1 bg-gradient-to-r from-[#00d4ff]/20 to-transparent"></span>
              {section.title}
              <span className="h-px flex-1 bg-gradient-to-l from-[#00d4ff]/20 to-transparent"></span>
            </h2>
            
            <div className="grid gap-4">
              {section.questions.map((q) => (
                <div key={q.id} className="bg-[#121216] border border-[#22222a] p-6 rounded-xl hover:border-[#2c2c2c] transition-colors group">
                  <p className="text-lg font-medium text-gray-200 mb-4 group-hover:text-white transition-colors">
                    <span className="text-[#00d4ff] mr-2">Q{q.id}.</span>
                    {q.text}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleOptionChange(q.id, opt)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                          answers[q.id] === opt 
                            ? "bg-[#00d4ff] border-[#00d4ff] text-black shadow-[0_0_15px_rgba(0,212,255,0.3)]" 
                            : "bg-[#0b0b0e] border-[#2c2c2c] text-gray-400 hover:border-[#444444]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Tiebreaker */}
        <div className="bg-[#121216] border border-[#00d4ff]/30 p-8 rounded-2xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Trophy className="w-32 h-32" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white italic">TIEBREAKER BONUS</h2>
            <p className="text-gray-400 text-sm">Who will be named Super Bowl MVP?</p>
          </div>
          <input 
            type="text"
            value={mvp}
            onChange={(e) => setMvp(e.target.value)}
            placeholder="MVP Name..."
            className="w-full bg-[#0b0b0e] border border-[#2c2c2c] rounded-xl px-6 py-4 text-white focus:border-[#00d4ff] transition-all"
          />
        </div>

        {/* Submit */}
        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-[#00d4ff] to-[#008f5d] text-black text-xl font-black py-6 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[#00d4ff]/20"
        >
          <Send className="w-6 h-6" />
          SUBMIT OFFICIAL ENTRY
        </button>
      </form>

      {/* Footer */}
      <footer className="text-center py-10 opacity-30 text-xs tracking-[0.2em] font-bold">
        SUPER BOWL LX • ARIZONA • 2026
      </footer>
    </div>
  );
}
