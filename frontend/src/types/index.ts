export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ProblemStatus = 'NOT_STARTED' | 'ATTEMPTED' | 'SOLVED' | 'REVISED' | 'MASTERED';
export type Phase = 'PHASE_1' | 'PHASE_2' | 'PHASE_3' | 'PHASE_4';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  streak: number;
}

export interface Problem {
  id: string;
  title: string;
  url: string;
  difficulty: Difficulty;
  topic: string;
  subtopic: string | null;
  companyTags: string[];
  notes: string | null;
  solutionLink: string | null;
  youtubeLink: string | null;
  phase: Phase;
  order: number;
  createdAt: string;
  updatedAt: string;
  userProblem?: UserProblem | null;
}

export interface UserProblem {
  id: string;
  userId: string;
  problemId: string;
  status: ProblemStatus;
  firstSolvedAt: string | null;
  lastRevisedAt: string | null;
  revisionCount: number;
  timeTaken: number | null;
  personalRating: number | null;
  clickCount: number;
  lastOpenedAt: string | null;
  createdAt: string;
  updatedAt: string;
  problem?: Problem;
}

export interface Sheet {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  problemCount: number;
  solvedCount: number;
  createdAt: string;
  updatedAt: string;
  sheetProblems?: SheetProblem[];
}

export interface SheetProblem {
  id: string;
  sheetId: string;
  problemId: string;
  order: number;
  problem: Problem;
}

export interface Roadmap {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  nodes: RoadmapNode[];
}

export interface RoadmapNode {
  id: string;
  roadmapId: string;
  topic: string;
  order: number;
  parentId: string | null;
}

export interface DailyActivity {
  date: string;
  count: number;
}

export interface TopicStat {
  topic: string;
  total: number;
  solved: number;
  percentage: number;
}

export interface DifficultyBreakdown {
  EASY: { total: number; solved: number };
  MEDIUM: { total: number; solved: number };
  HARD: { total: number; solved: number };
}

export interface PhaseProgress {
  phase: Phase;
  total: number;
  solved: number;
  percentage: number;
}

export interface DashboardData {
  user: { streak: number; name: string; avatar: string | null };
  stats: {
    totalProblems: number;
    solved: number;
    attempted: number;
    revised: number;
    mastered: number;
    revisionDue: number;
    streak: number;
    todaySolved: number;
  };
  topicCompletion: TopicStat[];
  difficultyBreakdown: DifficultyBreakdown;
  phaseProgress: PhaseProgress[];
  heatmap: DailyActivity[];
  weakestTopics: TopicStat[];
  strongestTopics: TopicStat[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ProblemFilters {
  topic?: string;
  difficulty?: Difficulty;
  phase?: Phase;
  status?: ProblemStatus;
  search?: string;
  company?: string;
  page?: number;
  limit?: number;
}

export const PHASE_LABELS: Record<Phase, string> = {
  PHASE_1: 'Phase 1 — Core Fundamentals',
  PHASE_2: 'Phase 2 — Structures & Recursion',
  PHASE_3: 'Phase 3 — Graphs & Dynamic Programming',
  PHASE_4: 'Phase 4 — Long Tail',
};

export const STATUS_CONFIG: Record<
  ProblemStatus,
  { label: string; color: string; bg: string }
> = {
  NOT_STARTED: { label: 'Not Started', color: 'text-muted-foreground', bg: 'bg-muted' },
  ATTEMPTED: { label: 'Attempted', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950' },
  SOLVED: { label: 'Solved', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
  REVISED: { label: 'Revised', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
  MASTERED: { label: 'Mastered', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
};

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string; bg: string }
> = {
  EASY: { label: 'Easy', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950' },
  MEDIUM: { label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
  HARD: { label: 'Hard', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950' },
};
