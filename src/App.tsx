import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import './index.css';
import Layout from './components/Layout';
import type { MoodEntry } from './types';

function App() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mindfull-entries');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const handleSaveMood = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('mindfull-entries', JSON.stringify(updatedEntries));
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-6 h-6 text-blue-600" />
            Mindfull
          </h1>
        </div>
      </header>

      <Layout entries={entries} onSaveMood={handleSaveMood} />
    </div>
  );
}

export default App;