import React, { useState } from 'react';
import { FiX, FiCamera, FiTrash2, FiUploadCloud, FiHeart, FiCalendar, FiMapPin, FiActivity, FiClock } from 'react-icons/fi';

const AddEntryModal = ({ onClose, onAdd }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [day, setDay] = useState('');
  const [route, setRoute] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  
  const [stravaScreenshot, setStravaScreenshot] = useState('');
  const [heartRate, setHeartRate] = useState({ start: '', train: '', rest: '' });

  const [meals, setMeals] = useState([
    { name: 'Breakfast', image: null, calories: '' },
    { name: 'Lunch', image: null, calories: '' },
    { name: 'Dinner', image: null, calories: '' }
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  // --- AGGRESSIVE COMPRESSION ---
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // CRITICAL CHANGE: Reduced from 800 to 400 for maximum storage efficiency
          const MAX_WIDTH = 400; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // CRITICAL CHANGE: Quality reduced to 0.5 (50%)
          resolve(canvas.toDataURL('image/jpeg', 0.5)); 
        };
      };
    });
  };

  const handleStravaUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessing(true);
      try {
        const compressed = await compressImage(file);
        setStravaScreenshot(compressed);
      } catch (err) {
        alert("Error processing image");
      }
      setIsProcessing(false);
    }
  };

  const handleFoodUpload = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessing(true);
      try {
        const compressed = await compressImage(file);
        const newMeals = [...meals];
        newMeals[index].image = compressed;
        setMeals(newMeals);
      } catch (err) {
        alert("Error processing image");
      }
      setIsProcessing(false);
    }
  };

  const removeFoodImage = (index) => {
    const newMeals = [...meals];
    newMeals[index].image = null;
    setMeals(newMeals);
  };

  const handleCalorieChange = (index, value) => {
    const newMeals = [...meals];
    newMeals[index].calories = parseInt(value) || 0;
    setMeals(newMeals);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const totalCalories = meals.reduce((acc, meal) => acc + (parseInt(meal.calories) || 0), 0);

    const newEntry = {
      id: Date.now().toString(),
      date,
      day,
      route,
      distance: parseFloat(distance) || 0,
      duration: parseFloat(duration) || 0,
      image: stravaScreenshot,
      calories: totalCalories,
      heartRate,
      meals: meals
    };
    
    onAdd(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full h-[95vh] md:h-auto md:max-h-[90vh] md:max-w-3xl md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in slide-in-from-bottom-10 md:fade-in">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div>
             <h2 className="text-xl md:text-2xl font-bold text-slate-900">Log Activity</h2>
             <p className="text-xs md:text-sm text-slate-500">
               {isProcessing ? "Optimizing photo size..." : "Photos are auto-compressed to save space"}
             </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8 pb-10">
            
            {/* Basics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FiCalendar /> Date
                </label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   Day Label
                </label>
                <input 
                  type="text" 
                  value={day} 
                  onChange={(e) => setDay(e.target.value)} 
                  placeholder="e.g. Day 1" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <FiMapPin /> Route Name
                </label>
                <input 
                  type="text" 
                  value={route} 
                  onChange={(e) => setRoute(e.target.value)} 
                  placeholder="e.g. Morning Park Loop" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Strava & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-semibold text-slate-700">Strava Activity Screenshot</label>
                  <div className={`relative group border-2 border-dashed rounded-2xl transition-all ${stravaScreenshot ? 'border-indigo-200 bg-indigo-50' : 'border-slate-300'}`}>
                    {stravaScreenshot ? (
                      <div className="relative h-48 md:h-64 w-full rounded-2xl overflow-hidden p-2">
                        <img src={stravaScreenshot} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                        <button 
                          type="button"
                          onClick={() => setStravaScreenshot('')}
                          className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-full shadow-md"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer active:bg-slate-50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUploadCloud className={`w-8 h-8 ${isProcessing ? 'text-slate-400 animate-pulse' : 'text-indigo-400'} mb-2`} />
                          <p className="mb-1 text-sm text-slate-500">
                             {isProcessing ? "Compressing..." : "Tap to upload screenshot"}
                          </p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleStravaUpload} disabled={isProcessing} />
                      </label>
                    )}
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiActivity /> Distance (km)
                  </label>
                  <input 
                    type="number" step="0.01" 
                    value={distance} 
                    onChange={(e) => setDistance(e.target.value)} 
                    placeholder="0.0" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FiClock /> Duration (min)
                  </label>
                  <input 
                    type="number" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    placeholder="0" 
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
               </div>
            </div>

            {/* Heart Rate */}
            <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-100">
               <label className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <FiHeart className="text-rose-500" /> Heart Rate Data
               </label>
               <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Start', color: 'bg-rose-500', val: heartRate.start, set: (v) => setHeartRate({...heartRate, start: v}) },
                    { label: 'Train', color: 'bg-amber-500', val: heartRate.train, set: (v) => setHeartRate({...heartRate, train: v}) },
                    { label: 'Rest', color: 'bg-emerald-500', val: heartRate.rest, set: (v) => setHeartRate({...heartRate, rest: v}) }
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="flex justify-center items-center gap-1 mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                        <span className="text-[10px] md:text-xs font-bold uppercase text-slate-500">{item.label}</span>
                      </div>
                      <input 
                        type="number" 
                        value={item.val} 
                        onChange={(e) => item.set(e.target.value)} 
                        className="w-full text-center font-mono font-bold text-lg py-2 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                        placeholder="-"
                      />
                    </div>
                  ))}
               </div>
            </div>

            {/* Nutrition Log */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Nutrition Log</label>
              <div className="space-y-4">
                {meals.map((meal, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="shrink-0">
                       <label className="relative block w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-slate-100 cursor-pointer border border-dashed border-slate-300">
                          {meal.image ? (
                            <img src={meal.image} className="w-full h-full object-cover" alt="food" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <FiCamera />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFoodUpload(index, e)} disabled={isProcessing} />
                             </div>
                          )}
                          {meal.image && (
                            <button onClick={(e) => {e.preventDefault(); removeFoodImage(index)}} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100"><FiTrash2/></button>
                          )}
                       </label>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{meal.name}</p>
                      <p className="text-xs text-slate-400">Enter calories</p>
                    </div>

                    <div className="w-20 md:w-24 relative">
                       <input 
                          type="number" 
                          placeholder="0"
                          value={meal.calories}
                          onChange={(e) => handleCalorieChange(index, e.target.value)}
                          className="w-full pl-2 pr-8 py-2 text-sm border border-slate-200 rounded-lg text-center outline-none focus:border-indigo-500"
                       />
                       <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-bold mt-0.5">kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/30 transition-all ${isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 active:scale-95'}`}
              >
                {isProcessing ? 'Processing Images...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEntryModal;