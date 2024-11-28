import { format } from 'date-fns';
import { History } from 'lucide-react';
import type { MoodEntry } from '../types';

const moods = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  bad: '😢',
  terrible: '😫',
};

type Props = {
  entries: MoodEntry[];
};

export default function MoodHistory({ entries }: Props) {
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <History className="w-6 h-6" />
        Mood History
      </h2>
      <div className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No entries yet. Start tracking your mood!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">
                  {format(new Date(entry.date), 'MMM d, yyyy h:mm a')}
                </span>
                <span className="text-2xl">{moods[entry.mood]}</span>
              </div>
              {entry.journal && (
                <p className="text-gray-700 mt-2">{entry.journal}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}