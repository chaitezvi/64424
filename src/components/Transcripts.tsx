import { useEffect, useState } from 'react';
import { ScrollText, User, Bot } from 'lucide-react';
import { format } from 'date-fns';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

export default function Transcripts() {
  const [transcripts, setTranscripts] = useState<Message[]>([]);

  useEffect(() => {
    // Load existing transcripts from localStorage
    const saved = localStorage.getItem('mindally-transcripts');
    if (saved) {
      setTranscripts(JSON.parse(saved));
    }

    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== 'https://widget.synthflow.ai') return;

      // Handle new message
      const { type, content } = event.data;
      if (type === 'message') {
        const newMessage: Message = {
          id: crypto.randomUUID(),
          content,
          sender: event.data.sender,
          timestamp: new Date().toISOString(),
        };

        setTranscripts(prev => {
          const updated = [newMessage, ...prev];
          localStorage.setItem('mindally-transcripts', JSON.stringify(updated));
          return updated;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const clearTranscripts = () => {
    setTranscripts([]);
    localStorage.removeItem('mindally-transcripts');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <ScrollText className="w-6 h-6" />
            Chat Transcripts
          </h2>
          {transcripts.length > 0 && (
            <button
              onClick={clearTranscripts}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {transcripts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No chat history yet. Start a conversation with the AI!
          </p>
        ) : (
          <div className="space-y-4">
            {transcripts.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}
                >
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="mb-1">{message.content}</p>
                  <p
                    className={`text-xs ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}