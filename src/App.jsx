import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // <--- Import Supabase
import WalkingTable from './components/WalkingTable';
import AddEntryModal from './components/AddEntryModal';
import EntryDetailModal from './components/EntryDetailModal';
import Highlights from './components/Highlights';   
import { FiTrendingUp, FiActivity, FiDatabase, FiLoader } from 'react-icons/fi';

const App = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [showModal, setShowModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // 1. FETCH DATA FROM SUPABASE
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('date', { ascending: true }); // Sort by date

    if (error) {
      console.error("Error fetching:", error);
    } else {
      // Map database columns back to your app's variable names if needed
      // (Supabase returns 'heart_rate', your app uses 'heartRate')
      const formattedData = data.map(item => ({
        ...item,
        heartRate: item.heart_rate, // Fix naming difference
      }));
      setEntries(formattedData);
    }
    setLoading(false);
  };

  // 2. ADD ENTRY TO SUPABASE
  const addEntry = async (entry) => {
    // Prepare data for DB (convert CamelCase to snake_case)
    const { id, heartRate, ...rest } = entry; // Remove ID (let DB handle it) and rename heartRate
    
    const { data, error } = await supabase
      .from('entries')
      .insert([
        { 
          ...rest, 
          heart_rate: heartRate 
        }
      ])
      .select();

    if (error) {
      alert("Error saving to cloud! " + error.message);
    } else {
      // Update local state immediately
      const newEntry = { ...data[0], heartRate: data[0].heart_rate };
      setEntries([newEntry, ...entries]);
      setShowModal(false);
    }
  };

  // 3. DELETE ENTRY FROM SUPABASE
  const deleteEntry = async (id) => {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      if (selectedEntry && selectedEntry.id === id) {
        setSelectedEntry(null);
      }
    }
  };

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
  const progress = Math.min((entries.length / 7) * 100, 100);

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 text-slate-900 pb-20">
      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-3xl"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-200/30 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                Fitness Challenge
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              7-Day <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Walking Routine</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-lg max-w-2xl">
              Documenting the journey: daily routes, heart health, and nutrition tracking.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-xl md:rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
          >
            <FiTrendingUp className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
            New Entry
          </button>
        </div>

        {/* --- MAIN CONTENT --- */}
        {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <FiLoader className="w-8 h-8 animate-spin mb-2 text-indigo-500"/>
                <p>Loading entries from cloud...</p>
            </div>
        ) : (
            <div className="space-y-8">
            
            {/* Highlights Row */}
            {entries.length > 0 && <Highlights entries={entries} />}

            {/* Progress Bar */}
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

            {/* Walking Cards */}
            {entries.length > 0 ? (
                <WalkingTable 
                entries={sortedEntries} 
                onDelete={deleteEntry}
                onSelect={setSelectedEntry} 
                />
            ) : (
                <div className="text-center py-12 md:py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiActivity className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Ready to publish!</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto px-4">
                    Your database is connected. Add your first entry to the cloud!
                </p>
                <button
                    onClick={() => setShowModal(true)}
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