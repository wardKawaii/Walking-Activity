import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import WalkingTable from './components/WalkingTable';
import AddEntryModal from './components/AddEntryModal';
import EntryDetailModal from './components/EntryDetailModal';
import Highlights from './components/Highlights';   
import { FiTrendingUp, FiActivity, FiLoader, FiUser } from 'react-icons/fi';

// --- SECURITY CONFIGURATION ---
const ADMIN_PASSWORD = "PathFitCS201"; // <--- UPDATED PASSWORD
// -----------------------------

const App = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error("Error fetching:", error);
    } else {
      const formattedData = data.map(item => ({
        ...item,
        heartRate: item.heart_rate,
      }));
      setEntries(formattedData);
    }
    setLoading(false);
  };

  // --- PASSWORD CHECK HELPER ---
  const verifyAdmin = () => {
    const input = prompt("Enter Admin Password to continue:");
    if (input === ADMIN_PASSWORD) {
      return true;
    } else {
      alert("🚫 Access Denied: Incorrect Password");
      return false;
    }
  };

  const handleNewEntryClick = () => {
    // Ask for password BEFORE opening the form
    if (verifyAdmin()) {
      setShowModal(true);
    }
  };

  const addEntry = async (entry) => {
    const { id, heartRate, ...rest } = entry;
    const { data, error } = await supabase
      .from('entries')
      .insert([{ ...rest, heart_rate: heartRate }])
      .select();

    if (error) {
      alert("Error saving to cloud! " + error.message);
    } else {
      const newEntry = { ...data[0], heartRate: data[0].heart_rate };
      setEntries([newEntry, ...entries]);
      setShowModal(false);
    }
  };

  const deleteEntry = async (id) => {
    // Ask for password BEFORE deleting
    if (!verifyAdmin()) return;

    if (!confirm("Are you sure you want to delete this entry?")) return;

    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      setEntries(entries.filter(entry => entry.id !== id));
      if (selectedEntry && selectedEntry.id === id) setSelectedEntry(null);
    }
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const progress = Math.min((entries.length / 7) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 text-slate-900 pb-20">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-3xl"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-200/30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* === PROFILE HEADER === */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-10 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
          
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="relative group shrink-0">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-200">
                  <img 
                    src="/profile.jpg" 
                    onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} 
                    alt="Edward Mendoza" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="hidden w-full h-full items-center justify-center bg-indigo-100 text-indigo-400">
                    <FiUser className="w-10 h-10" />
                  </div>
               </div>
               <div className="absolute -bottom-2 md:bottom-0 left-1/2 md:left-auto md:right-0 -translate-x-1/2 md:translate-x-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                  CS - 201
               </div>
            </div>

            <div>
               <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
                 Edward Mendoza
               </h1>
               <div className="flex flex-col md:flex-row items-center md:items-start gap-2 text-slate-500 font-medium mb-4">
                 <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs uppercase font-bold tracking-wider">
                   PathFit Requirement
                 </span>
                 <span className="hidden md:inline">•</span>
                 <span>7-Day Walking Activity Journey</span>
               </div>
               <p className="text-slate-600 text-sm md:text-base max-w-lg leading-relaxed">
                 "Documenting my journey to a healthier lifestyle. Tracking my daily routes, heart rate zones, and nutrition to build consistency."
               </p>
            </div>
          </div>

          {/* Action Button (Now Protected) */}
          <div className="shrink-0 mt-2 md:mt-4">
            <button
              onClick={handleNewEntryClick} // <--- Checks password first
              className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
            >
              <FiTrendingUp className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
              New Entry
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <FiLoader className="w-8 h-8 animate-spin mb-2 text-indigo-500"/>
                <p>Loading entries from cloud...</p>
            </div>
        ) : (
            <div className="space-y-8">
              {entries.length > 0 && <Highlights entries={entries} />}

              <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-slate-700 text-sm">Challenge Progress</span>
                    <span className="font-bold text-indigo-600 text-sm">{entries.length} / 7 Days</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                  </div>
              </div>

              {entries.length > 0 ? (
                  <WalkingTable 
                    entries={sortedEntries} 
                    onDelete={deleteEntry} // <--- Checks password first
                    onSelect={setSelectedEntry} 
                  />
              ) : (
                  <div className="text-center py-12 md:py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiActivity className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Ready to publish!</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto px-4">
                        Add your first entry to start your public journey.
                    </p>
                    <button
                        onClick={handleNewEntryClick} // <--- Checks password first
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                    >
                        + Create First Entry
                    </button>
                  </div>
              )}
            </div>
        )}

        {showModal && <AddEntryModal onClose={() => setShowModal(false)} onAdd={addEntry} />}
        
        {selectedEntry && (
          <EntryDetailModal 
            entry={selectedEntry} 
            onClose={() => setSelectedEntry(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;