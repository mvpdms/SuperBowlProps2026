"use client";

import { useState } from "react";
import { Trophy, Download, Lock, Users } from "lucide-react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/submissions?password=${password}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setIsLoggedIn(true);
      } else {
        alert("Incorrect Admin Password");
      }
    } catch (err) {
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    
    // Create CSV header from all question IDs (1-32) + basic info
    const headers = ["Name", "MVP", "Submitted At", ...Array.from({length: 32}, (_, i) => `Q${i+1}`)].join(",");
    
    const rows = data.map(row => {
      const answers = typeof row.answers === 'string' ? JSON.parse(row.answers) : row.answers;
      const qAnswers = Array.from({length: 32}, (_, i) => `"${answers[i+1] || ""}"`);
      return [`"${row.name}"`, `"${row.mvp}"`, `"${new Date(row.created_at).toLocaleString()}"`, ...qAnswers].join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "superbowl_submissions.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-[#121216] border border-[#22222a] p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-[#1a1a20] rounded-full text-[#00d4ff] mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Admin Portal</h1>
            <p className="text-gray-500 text-sm">Enter password to view results</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password..."
              className="w-full bg-[#0b0b0e] border border-[#2c2c2c] rounded-xl px-6 py-4 text-white focus:border-[#00d4ff] transition-all"
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#00d4ff] text-black font-black py-4 rounded-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "UNLOCK DASHBOARD"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#121216] border border-[#22222a] p-8 rounded-2xl shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#00d4ff] font-bold text-xs uppercase tracking-[0.2em]">
            <Users className="w-4 h-4" />
            Live Responses
          </div>
          <h1 className="text-4xl font-black text-white italic">SUBMISSION OVERVIEW</h1>
          <p className="text-gray-500">Total Entries: <span className="text-white font-bold">{data.length}</span></p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-[#1a1a20] border border-[#2c2c2c] rounded-xl hover:border-[#00d4ff] transition-all font-bold"
        >
          <Download className="w-4 h-4" />
          EXPORT TO EXCEL
        </button>
      </div>

      <div className="bg-[#121216] border border-[#22222a] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a1a20] border-b border-[#22222a]">
                <th className="px-6 py-4 text-xs font-black text-[#888888] uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-black text-[#888888] uppercase tracking-widest">MVP Pick</th>
                <th className="px-6 py-4 text-xs font-black text-[#888888] uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black text-[#888888] uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#22222a]">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{row.name}</td>
                  <td className="px-6 py-4 text-gray-300">{row.mvp}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(row.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full border border-green-500/20">
                      COMPLETE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
