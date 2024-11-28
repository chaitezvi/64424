import { useState, useEffect } from 'react';
import { Book, Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

type DiaryEntry = {
  id: string;
  content: string;
  emoji: string;
  timestamp: string;
};

const commonEmojis = ['📝', '💭', '💡', '💪', '🌟', '❤️', '🎯', '✨', '🌈', '🙏'];

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📝');

  useEffect(() => {
    const saved = localStorage.getItem('mindally-diary');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    if (!newEntry.trim()) return;

    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      content: newEntry,
      emoji: selectedEmoji,
      timestamp: new Date().toISOString(),
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('mindally-diary', JSON.stringify(updatedEntries));
    setNewEntry('');
  };

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('mindally-diary', JSON.stringify(updatedEntries));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Book className="w-6 h-6" />
          My Diary
        </h2>

        <div className="mb-4 flex flex-wrap gap-2">
          {commonEmojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`text-xl p-2 rounded-lg hover:bg-gray-100 transition-colors
                ${selectedEmoji === emoji ? 'bg-blue-100' : ''}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Write your thoughts..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32 resize-none"
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!newEntry.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Entry
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{entry.emoji}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(entry.timestamp), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No diary entries yet. Start writing your thoughts!
          </p>
        )}
      </div>
    </div>
  );
}