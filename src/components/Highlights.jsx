import React, { useMemo } from 'react';
import { FiTarget, FiAward, FiClock } from 'react-icons/fi';

const Highlights = ({ entries }) => {
  // Calculate stats automatically whenever 'entries' changes
  const stats = useMemo(() => {
    if (entries.length === 0) return { totalDist: 0, longest: 0, totalDuration: 0 };

    const totalDist = entries.reduce((acc, curr) => acc + Number(curr.distance), 0);
    const totalDuration = entries.reduce((acc, curr) => acc + Number(curr.duration), 0);
    const longest = Math.max(...entries.map(e => Number(e.distance)));

    return { totalDist, longest, totalDuration };
  }, [entries]);

  // Helper to format Pace (min/km)
  const avgPace = stats.totalDist > 0 
    ? (stats.totalDuration / stats.totalDist).toFixed(1) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Card 1: Total Distance */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-indigo-50 rounded-xl">
          <FiTarget className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium">Total Distance</p>
          <h4 className="text-2xl font-bold text-slate-800">{stats.totalDist.toFixed(1)} km</h4>
        </div>
      </div>

      {/* Card 2: Longest Walk */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-purple-50 rounded-xl">
          <FiAward className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium">Longest Walk</p>
          <h4 className="text-2xl font-bold text-slate-800">{stats.longest.toFixed(1)} km</h4>
        </div>
      </div>

      {/* Card 3: Average Pace */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="p-3 bg-orange-50 rounded-xl">
          <FiClock className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <p className="text-slate-500 text-sm font-medium">Avg Pace</p>
          <h4 className="text-2xl font-bold text-slate-800">{avgPace} <span className="text-sm text-slate-400 font-normal">min/km</span></h4>
        </div>
      </div>
    </div>
  );
};

export default Highlights;