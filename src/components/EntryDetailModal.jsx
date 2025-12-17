import React, { useState } from 'react';
import { FiX, FiMapPin, FiHeart, FiZap, FiCalendar, FiClock, FiActivity, FiCamera } from 'react-icons/fi';

const EntryDetailModal = ({ entry, onClose }) => {
  // State to manage which image is currently zoomed in (if any)
  const [zoomedImage, setZoomedImage] = useState(null);

  if (!entry) return null;

  // Calculate Pace
  const pace = (entry.distance > 0 && entry.duration > 0) 
    ? (entry.duration / entry.distance).toFixed(1) 
    : '-';

  // Helper to close the modal only if no image is zoomed
  const handleCloseModal = () => {
    if (!zoomedImage) {
        onClose();
    }
  };

  return (
    // Main Modal Backdrop
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={handleCloseModal}>
      
      {/* Main Modal Content Card */}
      {/* We stop propagation here so clicking inside the card doesn't close it */}
      <div 
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()} 
      >
        
        {/* 1. MAIN IMAGE HEADER (Clickable for zoom) */}
        <div className="relative h-72 bg-slate-100 group">
          {entry.image ? (
            <div 
                className="w-full h-full cursor-zoom-in relative"
                onClick={() => setZoomedImage(entry.image)}
            >
                 <img 
                   src={entry.image} 
                   alt="Main activity" 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 />
                 {/* Zoom hint overlay */}
                 <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <FiCamera className="text-white w-8 h-8 drop-shadow-lg" />
                 </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
              <FiMapPin className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-sm font-medium">No photo added</span>
            </div>
          )}
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition z-10"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Date & Day Labels */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                 <FiCalendar className="text-indigo-500 w-4 h-4" />
                 <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                 </span>
            </div>
            {entry.day && (
                <div className="bg-indigo-600/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm">
                 {entry.day}
                </div>
            )}
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Route Title & Stats Row */}
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-6">{entry.route}</h2>
            
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-indigo-50 p-4 rounded-2xl flex flex-col items-center justify-center">
                  <FiActivity className="text-indigo-400 w-5 h-5 mb-2"/>
                  <p className="text-xl font-black text-indigo-700 leading-none mb-1">{entry.distance}</p>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">km</p>
               </div>
               <div className="bg-indigo-50 p-4 rounded-2xl flex flex-col items-center justify-center">
                  <FiClock className="text-indigo-400 w-5 h-5 mb-2"/>
                  <p className="text-xl font-black text-indigo-700 leading-none mb-1">{entry.duration}</p>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">min</p>
               </div>
               <div className="bg-indigo-50 p-4 rounded-2xl flex flex-col items-center justify-center">
                  <FiZap className="text-indigo-400 w-5 h-5 mb-2"/>
                  <p className="text-xl font-black text-indigo-700 leading-none mb-1">{pace}</p>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">min/km</p>
               </div>
            </div>
          </div>

          {/* Heart Rate Section */}
          {entry.heartRate && (
             <div>
               <h4 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
                 <FiHeart className="text-rose-500" /> Heart Rate Zones
               </h4>
               <div className="grid grid-cols-3 gap-3">
                 <div className="bg-rose-50 border border-rose-100 p-3 rounded-2xl text-center">
                    <p className="text-2xl font-black text-rose-500">{entry.heartRate.start || '-'}</p>
                    <p className="text-[10px] font-bold text-rose-300 uppercase mt-1">Start</p>
                 </div>
                 <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl text-center">
                    <p className="text-2xl font-black text-amber-500">{entry.heartRate.train || '-'}</p>
                    <p className="text-[10px] font-bold text-amber-300 uppercase mt-1">Train</p>
                 </div>
                 <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl text-center">
                    <p className="text-2xl font-black text-emerald-500">{entry.heartRate.rest || '-'}</p>
                    <p className="text-[10px] font-bold text-emerald-300 uppercase mt-1">Rest</p>
                 </div>
               </div>
             </div>
          )}

          {/* Nutrition / Meals Section (Added back and made clickable) */}
          {entry.meals && entry.meals.length > 0 && (
             <div className="border-t border-slate-100 pt-8">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-700 uppercase flex items-center gap-2">
                    <FiZap className="text-orange-500" /> Nutrition Log
                  </h4>
                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-xs font-bold">
                    Total: {entry.calories} kcal
                  </span>
               </div>
               
               <div className="space-y-3">
                 {entry.meals.map((meal, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                       {/* Meal Image thumbnail - Clickable */}
                       <div 
                          className="w-16 h-16 shrink-0 bg-white rounded-lg overflow-hidden border border-slate-200 cursor-zoom-in relative group"
                          onClick={() => meal.image && setZoomedImage(meal.image)}
                       >
                          {meal.image ? (
                            <>
                                <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><FiCamera/></div>
                          )}
                       </div>
                       <div className="flex-1">
                          <p className="font-bold text-slate-800">{meal.name}</p>
                          <p className="text-xs text-slate-400">{meal.calories > 0 ? `${meal.calories} kcal` : 'No calories logged'}</p>
                       </div>
                    </div>
                 ))}
               </div>
             </div>
          )}

        </div>
      </div>

      {/* ========================================= */}
      {/* LIGHTBOX OVERLAY (Shows when image clicked) */}
      {/* ========================================= */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
           {/* Close button for lightbox */}
           <button className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition">
              <FiX className="w-6 h-6"/>
           </button>

           {/* The large image */}
          <img 
            src={zoomedImage} 
            alt="Zoomed view" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent click on image from closing lightbox
          />
        </div>
      )}

    </div>
  );
};

export default EntryDetailModal;