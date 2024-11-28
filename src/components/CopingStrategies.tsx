import { useEffect, useState } from 'react';
import { Lightbulb, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';
import type { CopingStrategy } from '../types';

const defaultStrategies: CopingStrategy[] = [
  {
    id: '1',
    title: 'Deep Breathing',
    description: 'Take 5 deep breaths, counting to 4 on inhale and 4 on exhale.',
  },
  {
    id: '2',
    title: 'Mindful Walking',
    description: 'Take a short walk and focus on your surroundings and sensations.',
  },
  {
    id: '3',
    title: 'Positive Affirmation',
    description: 'Repeat: "I am capable of handling whatever comes my way."',
  },
  {
    id: '4',
    title: '5-4-3-2-1 Grounding',
    description: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.',
  },
];

type CompletedStrategy = {
  id: string;
  lastCompleted: string;
};

export default function CopingStrategies() {
  const [completedStrategies, setCompletedStrategies] = useState<CompletedStrategy[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mindally-completed-strategies');
    if (saved) {
      setCompletedStrategies(JSON.parse(saved));
    }
  }, []);

  const toggleStrategy = (strategyId: string) => {
    let updated: CompletedStrategy[];
    
    if (completedStrategies.some(s => s.id === strategyId)) {
      updated = completedStrategies.filter(s => s.id !== strategyId);
    } else {
      updated = [...completedStrategies, {
        id: strategyId,
        lastCompleted: new Date().toISOString()
      }];
    }
    
    setCompletedStrategies(updated);
    localStorage.setItem('mindally-completed-strategies', JSON.stringify(updated));
  };

  const getLastCompletedDate = (strategyId: string) => {
    const strategy = completedStrategies.find(s => s.id === strategyId);
    return strategy ? format(new Date(strategy.lastCompleted), 'MMM d, h:mm a') : null;
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="w-6 h-6" />
        Coping Strategies
      </h2>
      <div className="space-y-4">
        {defaultStrategies.map((strategy) => {
          const isCompleted = completedStrategies.some(s => s.id === strategy.id);
          const lastCompleted = getLastCompletedDate(strategy.id);

          return (
            <div 
              key={strategy.id} 
              className={`p-4 rounded-lg transition-colors ${
                isCompleted ? 'bg-green-50' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium mb-2">{strategy.title}</h3>
                  <p className="text-gray-600 mb-2">{strategy.description}</p>
                  {lastCompleted && (
                    <p className="text-sm text-gray-500">
                      Last completed: {lastCompleted}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleStrategy(strategy.id)}
                  className="mt-1 text-gray-600 hover:text-green-600 transition-colors"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}