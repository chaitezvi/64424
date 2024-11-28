import { useState, useEffect } from 'react';
import { Clipboard, ArrowRight, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { Test, TestResult } from '../types';

const mentalHealthTests: Test[] = [
  {
    id: 'phq9',
    name: 'PHQ-9 Depression Screening',
    description: 'The Patient Health Questionnaire-9 is a widely used screening tool for depression.',
    timeToComplete: '5 minutes',
    questions: [
      {
        id: '1',
        text: 'Little interest or pleasure in doing things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: '2',
        text: 'Feeling down, depressed, or hopeless',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: '3',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: '4',
        text: 'Feeling tired or having little energy',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: '5',
        text: 'Poor appetite or overeating',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ],
    scoring: {
      ranges: [
        { min: 0, max: 4, severity: 'Minimal', description: 'Your symptoms suggest minimal depression.' },
        { min: 5, max: 9, severity: 'Mild', description: 'Your symptoms suggest mild depression.' },
        { min: 10, max: 14, severity: 'Moderate', description: 'Your symptoms suggest moderate depression.' },
        { min: 15, max: 27, severity: 'Severe', description: 'Your symptoms suggest severe depression.' }
      ]
    }
  },
  {
    id: 'gad7',
    name: 'GAD-7 Anxiety Screening',
    description: 'The Generalized Anxiety Disorder-7 is a screening tool for anxiety.',
    timeToComplete: '3 minutes',
    questions: [
      {
        id: '1',
        text: 'Feeling nervous, anxious, or on edge',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: '2',
        text: 'Not being able to stop or control worrying',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      },
      {
        id: '3',
        text: 'Worrying too much about different things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' }
        ]
      }
    ],
    scoring: {
      ranges: [
        { min: 0, max: 4, severity: 'Minimal', description: 'Your symptoms suggest minimal anxiety.' },
        { min: 5, max: 9, severity: 'Mild', description: 'Your symptoms suggest mild anxiety.' },
        { min: 10, max: 14, severity: 'Moderate', description: 'Your symptoms suggest moderate anxiety.' },
        { min: 15, max: 21, severity: 'Severe', description: 'Your symptoms suggest severe anxiety.' }
      ]
    }
  }
];

export default function Tests() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, number>>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mindally-test-results');
    if (saved) {
      setTestResults(JSON.parse(saved));
    }
  }, []);

  const handleAnswer = (questionId: string, value: number) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateScore = (answers: Record<string, number>) => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  const getSeverity = (test: Test, score: number) => {
    const range = test.scoring.ranges.find(
      range => score >= range.min && score <= range.max
    );
    return range || test.scoring.ranges[0];
  };

  const handleComplete = () => {
    if (!selectedTest) return;

    const score = calculateScore(currentAnswers);
    const severity = getSeverity(selectedTest, score);

    const result: TestResult = {
      id: crypto.randomUUID(),
      testId: selectedTest.id,
      date: new Date().toISOString(),
      score,
      severity: severity.severity,
      answers: currentAnswers
    };

    const updatedResults = [result, ...testResults];
    setTestResults(updatedResults);
    localStorage.setItem('mindally-test-results', JSON.stringify(updatedResults));
    
    setSelectedTest(null);
    setCurrentAnswers({});
  };

  const getLatestResult = (testId: string) => {
    return testResults.find(result => result.testId === testId);
  };

  if (selectedTest) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => setSelectedTest(null)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to tests
        </button>

        <h2 className="text-2xl font-semibold mb-2">{selectedTest.name}</h2>
        <p className="text-gray-600 mb-6">{selectedTest.description}</p>

        <div className="space-y-6">
          {selectedTest.questions.map((question) => (
            <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="mb-3">{question.text}</p>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={currentAnswers[question.id] === option.value}
                      onChange={() => handleAnswer(question.id, option.value)}
                      className="mr-3"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleComplete}
          disabled={selectedTest.questions.some(q => currentAnswers[q.id] === undefined)}
          className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Complete Test
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Clipboard className="w-6 h-6" />
        Mental Health Assessments
      </h2>

      <div className="space-y-4">
        {mentalHealthTests.map((test) => {
          const latestResult = getLatestResult(test.id);

          return (
            <div key={test.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-2">{test.name}</h3>
                  <p className="text-gray-600 mb-2">{test.description}</p>
                  <p className="text-sm text-gray-500">Time: {test.timeToComplete}</p>
                </div>
                <button
                  onClick={() => setSelectedTest(test)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Take Test
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {latestResult && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Last taken: {format(new Date(latestResult.date), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm">
                    Result: <span className="font-medium">{latestResult.severity}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}