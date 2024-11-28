import { useState } from 'react';
import { format } from 'date-fns';
import type { MoodEntry } from '../types';

const moods = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  bad: '😢',
  terrible: '😫',
};

type Props = {
  onSaveMood: (entry: Omit<MoodEntry, 'id'>) => void;
};

export default function MoodTracker({ onSaveMood }: Props) {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [journal, setJournal] = useState('');

  const handleSave = () => {
    if (!selectedMood) return;
    onSaveMood({
      date: new Date().toISOString(),
      mood: selectedMood,
      journal: journal.trim() || undefined,
    });
    setSelectedMood(null);
    setJournal('');
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">How are you feeling today?</h2>
      <p className="text-gray-600 mb-4">{format(new Date(), 'EEEE, MMMM d')}</p>
      
      <div className="flex justify-between mb-6">
        {Object.entries(moods).map(([mood, emoji]) => (
          <button
            key={mood}
            onClick={() => setSelectedMood(mood as MoodEntry['mood'])}
            className={`text-3xl p-2 rounded-full hover:bg-gray-100 transition-colors
              ${selectedMood === mood ? 'bg-blue-100' : ''}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <textarea
        placeholder="How are you feeling? (optional)"
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        className="w-full p-3 border rounded-lg mb-4 h-32 resize-none"
      />

      <button
        onClick={handleSave}
        disabled={!selectedMood}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
          disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Save Entry
      </button>
    </div>
  );
}