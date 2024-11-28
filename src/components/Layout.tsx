import { MessageCircle, History, SmilePlus, Lightbulb, Book, Clipboard, ScrollText } from 'lucide-react';
import { useState } from 'react';
import MoodTracker from './MoodTracker';
import MoodHistory from './MoodHistory';
import CopingStrategies from './CopingStrategies';
import Chat from './Chat';
import Diary from './Diary';
import Tests from './Tests';
import Transcripts from './Transcripts';
import type { MoodEntry } from '../types';

type View = 'chat' | 'mood' | 'history' | 'strategies' | 'diary' | 'tests' | 'transcripts';

type Props = {
  entries: MoodEntry[];
  onSaveMood: (entry: Omit<MoodEntry, 'id'>) => void;
};

export default function Layout({ entries, onSaveMood }: Props) {
  const [currentView, setCurrentView] = useState<View>('chat');

  const navigationItems = [
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'mood', icon: SmilePlus, label: 'Mood' },
    { id: 'diary', icon: Book, label: 'Diary' },
    { id: 'tests', icon: Clipboard, label: 'Tests' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'strategies', icon: Lightbulb, label: 'Strategies' },
    { id: 'transcripts', icon: ScrollText, label: 'Transcripts' },
  ] as const;

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return <Chat />;
      case 'mood':
        return <MoodTracker onSaveMood={onSaveMood} />;
      case 'history':
        return <MoodHistory entries={entries} />;
      case 'strategies':
        return <CopingStrategies />;
      case 'diary':
        return <Diary />;
      case 'tests':
        return <Tests />;
      case 'transcripts':
        return <Transcripts />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Side Navigation */}
      <nav className="w-20 bg-white shadow-sm flex flex-col items-center py-6 space-y-8">
        {navigationItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id as View)}
            className={`p-3 rounded-xl hover:bg-gray-100 transition-colors ${
              currentView === id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
            }`}
            title={label}
          >
            <Icon className="w-6 h-6" />
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}