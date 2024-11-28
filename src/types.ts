export type MoodEntry = {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  journal?: string;
};

export type CopingStrategy = {
  id: string;
  title: string;
  description: string;
};

export type TestResult = {
  id: string;
  testId: string;
  date: string;
  score: number;
  severity: string;
  answers: Record<string, number>;
};

export type Test = {
  id: string;
  name: string;
  description: string;
  timeToComplete: string;
  questions: {
    id: string;
    text: string;
    options: {
      value: number;
      label: string;
    }[];
  }[];
  scoring: {
    ranges: {
      min: number;
      max: number;
      severity: string;
      description: string;
    }[];
  };
};