import React from 'react';
import { FiTrash2, FiMapPin, FiHeart, FiZap } from 'react-icons/fi';

const WalkingTable = ({ entries, onDelete, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {entries.map((entry, index) => (
        <div 
          key={entry.id} 
          onClick={() => onSelect(entry)}
          className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer"
        >
          {/* IMAGE SECTION */}
          <div className="relative h-48 bg-slate-100">
            {entry.image ? (
              <img src={entry.image} alt="Walk" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                <FiMapPin className="w-8 h-8 mb-2" />
                <span className="text-xs font-bold uppercase">No Photo</span>
              </div>
            )}
            
            {/* Day Badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-slate-700 uppercase shadow-sm">
              Day {index + 1}
            </div>

            {/* Delete Button (Top Right) */}
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening modal
                onDelete(entry.id);
              }}
              className="absolute top-4 right-4 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-full backdrop-blur-md transition shadow-sm"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>

          {/* CONTENT SECTION */}
          <div className="p-5">
            
            {/* Date & Activity */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date Recorded</p>
                <h3 className="text-xl font-extrabold text-slate-800">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
              </div>
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                <FiMapPin className="w-3 h-3" />
                Activity
              </span>
            </div>

            {/* Heart Rate Zones */}
            <div className="mb-6">
              <div className="flex items-center gap-1 mb-2 text-slate-400">
                 <FiHeart className="w-3 h-3" />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Heart Rate Zones</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                 {/* Start */}
                 <div className="bg-rose-50 rounded-xl p-2 text-center">
                    <span className="block text-lg font-black text-rose-500 leading-none">
                      {entry.heartRate?.start || '-'}
                    </span>
                    <span className="text-[9px] font-bold text-rose-300 uppercase">Start</span>
                 </div>
                 {/* Train */}
                 <div className="bg-amber-50 rounded-xl p-2 text-center">
                    <span className="block text-lg font-black text-amber-500 leading-none">
                      {entry.heartRate?.train || '-'}
                    </span>
                    <span className="text-[9px] font-bold text-amber-300 uppercase">Train</span>
                 </div>
                 {/* Rest */}
                 <div className="bg-emerald-50 rounded-xl p-2 text-center">
                    <span className="block text-lg font-black text-emerald-500 leading-none">
                      {entry.heartRate?.rest || '-'}
                    </span>
                    <span className="text-[9px] font-bold text-emerald-300 uppercase">Rest</span>
                 </div>
              </div>
            </div>

            {/* Footer: Nutrition */}
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nutrition</span>
              <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <FiZap className="w-3 h-3 text-orange-400" />
                {entry.calories || 0} kcal
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default WalkingTable;