import { PrismaClient, Difficulty, Phase } from '@prisma/client';

const prisma = new PrismaClient();

type ProblemSeed = {
  title: string;
  url: string;
  difficulty: Difficulty;
  topic: string;
  subtopic?: string;
  phase: Phase;
  order: number;
  companyTags?: string[];
};

const problems: ProblemSeed[] = [
  // ─────────────────────────────────────────────
  // PHASE 1 — Core Fundamentals
  // ─────────────────────────────────────────────

  // Hashing
  { title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', difficulty: 'EASY', topic: 'Hashing', subtopic: 'Array Lookup', phase: 'PHASE_1', order: 1, companyTags: ['Google', 'Amazon', 'Meta'] },
  { title: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', difficulty: 'EASY', topic: 'Hashing', subtopic: 'Set', phase: 'PHASE_1', order: 2, companyTags: ['Amazon'] },
  { title: 'Valid Anagram', url: 'https://leetcode.com/problems/valid-anagram/', difficulty: 'EASY', topic: 'Hashing', subtopic: 'Frequency Count', phase: 'PHASE_1', order: 3, companyTags: ['Amazon', 'Meta'] },
  { title: 'Concatenation of Array', url: 'https://leetcode.com/problems/concatenation-of-array/', difficulty: 'EASY', topic: 'Hashing', subtopic: 'Array', phase: 'PHASE_1', order: 4 },
  { title: 'Longest Common Prefix', url: 'https://leetcode.com/problems/longest-common-prefix/', difficulty: 'EASY', topic: 'Hashing', subtopic: 'String', phase: 'PHASE_1', order: 5, companyTags: ['Google'] },
  { title: 'Remove Element', url: 'https://leetcode.com/problems/remove-element/', difficulty: 'EASY', topic: 'Hashing', subtopic: 'Array', phase: 'PHASE_1', order: 6 },
  { title: 'Design HashSet', url: 'https://leetcode.com/problems/design-hashset/', difficulty: 'EASY', topic: 'Hashing', subtopic: 'Design', phase: 'PHASE_1', order: 7 },
  { title: 'Design HashMap', url: 'https://leetcode.com/problems/design-hashmap/', difficulty: 'EASY', topic: 'Hashing', subtopic: 'Design', phase: 'PHASE_1', order: 8 },
  { title: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/', difficulty: 'MEDIUM', topic: 'Hashing', subtopic: 'Grouping', phase: 'PHASE_1', order: 9, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Top K Frequent Elements', url: 'https://leetcode.com/problems/top-k-frequent-elements/', difficulty: 'MEDIUM', topic: 'Hashing', subtopic: 'Bucket Sort', phase: 'PHASE_1', order: 10, companyTags: ['Amazon', 'Google'] },
  { title: 'Longest Consecutive Sequence', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', difficulty: 'MEDIUM', topic: 'Hashing', subtopic: 'Set', phase: 'PHASE_1', order: 11, companyTags: ['Google', 'Amazon'] },
  { title: 'Encode and Decode Strings', url: 'https://leetcode.com/problems/encode-and-decode-strings/', difficulty: 'MEDIUM', topic: 'Hashing', subtopic: 'String Encoding', phase: 'PHASE_1', order: 12, companyTags: ['Google'] },
  { title: 'Valid Sudoku', url: 'https://leetcode.com/problems/valid-sudoku/', difficulty: 'MEDIUM', topic: 'Hashing', subtopic: 'Matrix', phase: 'PHASE_1', order: 13, companyTags: ['Amazon'] },
  { title: 'Detect Squares', url: 'https://leetcode.com/problems/detect-squares/', difficulty: 'MEDIUM', topic: 'Hashing', subtopic: 'Geometry', phase: 'PHASE_1', order: 14 },
  { title: 'First Missing Positive', url: 'https://leetcode.com/problems/first-missing-positive/', difficulty: 'HARD', topic: 'Hashing', subtopic: 'Index Hashing', phase: 'PHASE_1', order: 15, companyTags: ['Amazon', 'Google'] },

  // Two Pointers
  { title: 'Valid Palindrome', url: 'https://leetcode.com/problems/valid-palindrome/', difficulty: 'EASY', topic: 'Two Pointers', subtopic: 'String', phase: 'PHASE_1', order: 16, companyTags: ['Meta', 'Amazon'] },
  { title: 'Reverse String', url: 'https://leetcode.com/problems/reverse-string/', difficulty: 'EASY', topic: 'Two Pointers', subtopic: 'String', phase: 'PHASE_1', order: 17 },
  { title: 'Valid Palindrome II', url: 'https://leetcode.com/problems/valid-palindrome-ii/', difficulty: 'EASY', topic: 'Two Pointers', subtopic: 'String', phase: 'PHASE_1', order: 18, companyTags: ['Meta'] },
  { title: 'Merge Strings Alternately', url: 'https://leetcode.com/problems/merge-strings-alternately/', difficulty: 'EASY', topic: 'Two Pointers', subtopic: 'String', phase: 'PHASE_1', order: 19 },
  { title: 'Merge Sorted Array', url: 'https://leetcode.com/problems/merge-sorted-array/', difficulty: 'EASY', topic: 'Two Pointers', subtopic: 'Array Merge', phase: 'PHASE_1', order: 20, companyTags: ['Amazon', 'Google'] },
  { title: 'Remove Duplicates from Sorted Array', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', difficulty: 'EASY', topic: 'Two Pointers', subtopic: 'Array', phase: 'PHASE_1', order: 21, companyTags: ['Amazon'] },
  { title: 'Two Sum II - Input Array Is Sorted', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', difficulty: 'MEDIUM', topic: 'Two Pointers', subtopic: 'Array', phase: 'PHASE_1', order: 22 },
  { title: 'Move Zeroes', url: 'https://leetcode.com/problems/move-zeroes/', difficulty: 'MEDIUM', topic: 'Two Pointers', subtopic: 'Array', phase: 'PHASE_1', order: 23, companyTags: ['Meta'] },
  { title: '3Sum', url: 'https://leetcode.com/problems/3sum/', difficulty: 'MEDIUM', topic: 'Two Pointers', subtopic: 'Sorting', phase: 'PHASE_1', order: 24, companyTags: ['Google', 'Amazon', 'Meta'] },
  { title: 'Container With Most Water', url: 'https://leetcode.com/problems/container-with-most-water/', difficulty: 'MEDIUM', topic: 'Two Pointers', subtopic: 'Greedy', phase: 'PHASE_1', order: 25, companyTags: ['Amazon', 'Google'] },
  { title: 'Sort Colors', url: 'https://leetcode.com/problems/sort-colors/', difficulty: 'MEDIUM', topic: 'Two Pointers', subtopic: 'Dutch National Flag', phase: 'PHASE_1', order: 26, companyTags: ['Microsoft'] },
  { title: '4Sum', url: 'https://leetcode.com/problems/4sum/', difficulty: 'MEDIUM', topic: 'Two Pointers', subtopic: 'Sorting', phase: 'PHASE_1', order: 27 },
  { title: 'Rotate Array', url: 'https://leetcode.com/problems/rotate-array/', difficulty: 'MEDIUM', topic: 'Two Pointers', subtopic: 'Array', phase: 'PHASE_1', order: 28, companyTags: ['Amazon', 'Microsoft'] },
  { title: 'Boats to Save People', url: 'https://leetcode.com/problems/boats-to-save-people/', difficulty: 'MEDIUM', topic: 'Two Pointers', subtopic: 'Greedy', phase: 'PHASE_1', order: 29 },
  { title: 'Trapping Rain Water', url: 'https://leetcode.com/problems/trapping-rain-water/', difficulty: 'HARD', topic: 'Two Pointers', subtopic: 'Stack / Two Pointers', phase: 'PHASE_1', order: 30, companyTags: ['Amazon', 'Google', 'Meta'] },

  // Sliding Window
  { title: 'Maximum Average Subarray I', url: 'https://leetcode.com/problems/maximum-average-subarray-i/', difficulty: 'EASY', topic: 'Sliding Window', subtopic: 'Fixed Window', phase: 'PHASE_1', order: 31 },
  { title: 'Contains Duplicate II', url: 'https://leetcode.com/problems/contains-duplicate-ii/', difficulty: 'EASY', topic: 'Sliding Window', subtopic: 'Fixed Window', phase: 'PHASE_1', order: 32 },
  { title: 'Best Time to Buy and Sell Stock', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', difficulty: 'EASY', topic: 'Sliding Window', subtopic: 'Dynamic Window', phase: 'PHASE_1', order: 33, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Longest Substring Without Repeating Characters', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', difficulty: 'MEDIUM', topic: 'Sliding Window', subtopic: 'Dynamic Window', phase: 'PHASE_1', order: 34, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Longest Repeating Character Replacement', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', difficulty: 'MEDIUM', topic: 'Sliding Window', subtopic: 'Dynamic Window', phase: 'PHASE_1', order: 35, companyTags: ['Google'] },
  { title: 'Permutation in String', url: 'https://leetcode.com/problems/permutation-in-string/', difficulty: 'MEDIUM', topic: 'Sliding Window', subtopic: 'Anagram', phase: 'PHASE_1', order: 36, companyTags: ['Amazon', 'Google'] },
  { title: 'Max Consecutive Ones III', url: 'https://leetcode.com/problems/max-consecutive-ones-iii/', difficulty: 'MEDIUM', topic: 'Sliding Window', subtopic: 'Dynamic Window', phase: 'PHASE_1', order: 37 },
  { title: 'Minimum Size Subarray Sum', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/', difficulty: 'MEDIUM', topic: 'Sliding Window', subtopic: 'Dynamic Window', phase: 'PHASE_1', order: 38, companyTags: ['Amazon'] },
  { title: 'Find K Closest Elements', url: 'https://leetcode.com/problems/find-k-closest-elements/', difficulty: 'MEDIUM', topic: 'Sliding Window', subtopic: 'Binary Search', phase: 'PHASE_1', order: 39 },
  { title: 'Minimum Window Substring', url: 'https://leetcode.com/problems/minimum-window-substring/', difficulty: 'HARD', topic: 'Sliding Window', subtopic: 'Dynamic Window', phase: 'PHASE_1', order: 40, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Sliding Window Maximum', url: 'https://leetcode.com/problems/sliding-window-maximum/', difficulty: 'HARD', topic: 'Sliding Window', subtopic: 'Deque', phase: 'PHASE_1', order: 41, companyTags: ['Amazon', 'Google'] },
  { title: 'Subarrays with K Different Integers', url: 'https://leetcode.com/problems/subarrays-with-k-different-integers/', difficulty: 'HARD', topic: 'Sliding Window', subtopic: 'Dynamic Window', phase: 'PHASE_1', order: 42 },

  // Binary Search
  { title: 'Binary Search', url: 'https://leetcode.com/problems/binary-search/', difficulty: 'EASY', topic: 'Binary Search', subtopic: 'Classic', phase: 'PHASE_1', order: 43 },
  { title: 'Search Insert Position', url: 'https://leetcode.com/problems/search-insert-position/', difficulty: 'EASY', topic: 'Binary Search', subtopic: 'Lower Bound', phase: 'PHASE_1', order: 44, companyTags: ['Amazon'] },
  { title: 'Guess Number Higher or Lower', url: 'https://leetcode.com/problems/guess-number-higher-or-lower/', difficulty: 'EASY', topic: 'Binary Search', subtopic: 'Classic', phase: 'PHASE_1', order: 45 },
  { title: 'Sqrt(x)', url: 'https://leetcode.com/problems/sqrtx/', difficulty: 'EASY', topic: 'Binary Search', subtopic: 'Classic', phase: 'PHASE_1', order: 46 },
  { title: 'First Bad Version', url: 'https://leetcode.com/problems/first-bad-version/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Lower Bound', phase: 'PHASE_1', order: 47 },
  { title: 'Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Rotated Array', phase: 'PHASE_1', order: 48, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Find Peak Element', url: 'https://leetcode.com/problems/find-peak-element/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Peak', phase: 'PHASE_1', order: 49, companyTags: ['Google'] },
  { title: 'Koko Eating Bananas', url: 'https://leetcode.com/problems/koko-eating-bananas/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Answer Binary Search', phase: 'PHASE_1', order: 50, companyTags: ['Amazon'] },
  { title: 'Find First and Last Position of Element in Sorted Array', url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Bounds', phase: 'PHASE_1', order: 51, companyTags: ['Amazon', 'Google'] },
  { title: 'Search a 2D Matrix', url: 'https://leetcode.com/problems/search-a-2d-matrix/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Matrix', phase: 'PHASE_1', order: 52, companyTags: ['Amazon'] },
  { title: 'Capacity to Ship Packages Within D Days', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Answer Binary Search', phase: 'PHASE_1', order: 53, companyTags: ['Amazon'] },
  { title: 'Find Minimum in Rotated Sorted Array', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Rotated Array', phase: 'PHASE_1', order: 54, companyTags: ['Amazon', 'Google'] },
  { title: 'Search in Rotated Sorted Array II', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Rotated Array', phase: 'PHASE_1', order: 55 },
  { title: 'Time Based Key-Value Store', url: 'https://leetcode.com/problems/time-based-key-value-store/', difficulty: 'MEDIUM', topic: 'Binary Search', subtopic: 'Design', phase: 'PHASE_1', order: 56, companyTags: ['Google'] },
  { title: 'Median of Two Sorted Arrays', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', difficulty: 'HARD', topic: 'Binary Search', subtopic: 'Partition', phase: 'PHASE_1', order: 57, companyTags: ['Google', 'Amazon', 'Apple'] },
  { title: 'Split Array Largest Sum', url: 'https://leetcode.com/problems/split-array-largest-sum/', difficulty: 'HARD', topic: 'Binary Search', subtopic: 'Answer Binary Search', phase: 'PHASE_1', order: 58, companyTags: ['Google'] },
  { title: 'Kth Smallest Element in a Sorted Matrix', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/', difficulty: 'HARD', topic: 'Binary Search', subtopic: 'Matrix', phase: 'PHASE_1', order: 59 },
  { title: 'Find in Mountain Array', url: 'https://leetcode.com/problems/find-in-mountain-array/', difficulty: 'HARD', topic: 'Binary Search', subtopic: 'Mountain Array', phase: 'PHASE_1', order: 60 },

  // Prefix Sum
  { title: 'Running Sum of 1d Array', url: 'https://leetcode.com/problems/running-sum-of-1d-array/', difficulty: 'MEDIUM', topic: 'Prefix Sum', subtopic: 'Basic', phase: 'PHASE_1', order: 61 },
  { title: 'Find Pivot Index', url: 'https://leetcode.com/problems/find-pivot-index/', difficulty: 'MEDIUM', topic: 'Prefix Sum', subtopic: 'Pivot', phase: 'PHASE_1', order: 62 },
  { title: 'Subarray Sum Equals K', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', difficulty: 'MEDIUM', topic: 'Prefix Sum', subtopic: 'HashMap + Prefix', phase: 'PHASE_1', order: 63, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Product of Array Except Self', url: 'https://leetcode.com/problems/product-of-array-except-self/', difficulty: 'MEDIUM', topic: 'Prefix Sum', subtopic: 'Prefix & Suffix Product', phase: 'PHASE_1', order: 64, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Contiguous Array', url: 'https://leetcode.com/problems/contiguous-array/', difficulty: 'MEDIUM', topic: 'Prefix Sum', subtopic: 'HashMap + Prefix', phase: 'PHASE_1', order: 65, companyTags: ['Meta'] },
  { title: 'Subarray Sums Divisible by K', url: 'https://leetcode.com/problems/subarray-sums-divisible-by-k/', difficulty: 'MEDIUM', topic: 'Prefix Sum', subtopic: 'Modulo', phase: 'PHASE_1', order: 66 },
  { title: 'Range Sum Query 2D - Immutable', url: 'https://leetcode.com/problems/range-sum-query-2d-immutable/', difficulty: 'MEDIUM', topic: 'Prefix Sum', subtopic: '2D Prefix Sum', phase: 'PHASE_1', order: 67 },
  { title: 'Count of Range Sum', url: 'https://leetcode.com/problems/count-of-range-sum/', difficulty: 'HARD', topic: 'Prefix Sum', subtopic: 'Merge Sort / Segment Tree', phase: 'PHASE_1', order: 68 },

  // Stack-based Simulation
  { title: 'Baseball Game', url: 'https://leetcode.com/problems/baseball-game/', difficulty: 'EASY', topic: 'Stack', subtopic: 'Simulation', phase: 'PHASE_1', order: 69 },
  { title: 'Valid Parentheses', url: 'https://leetcode.com/problems/valid-parentheses/', difficulty: 'EASY', topic: 'Stack', subtopic: 'Matching', phase: 'PHASE_1', order: 70, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Implement Stack using Queues', url: 'https://leetcode.com/problems/implement-stack-using-queues/', difficulty: 'EASY', topic: 'Stack', subtopic: 'Design', phase: 'PHASE_1', order: 71 },
  { title: 'Implement Queue using Stacks', url: 'https://leetcode.com/problems/implement-queue-using-stacks/', difficulty: 'EASY', topic: 'Stack', subtopic: 'Design', phase: 'PHASE_1', order: 72 },
  { title: 'Min Stack', url: 'https://leetcode.com/problems/min-stack/', difficulty: 'MEDIUM', topic: 'Stack', subtopic: 'Design', phase: 'PHASE_1', order: 73, companyTags: ['Amazon', 'Google'] },
  { title: 'Evaluate Reverse Polish Notation', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', difficulty: 'MEDIUM', topic: 'Stack', subtopic: 'Expression Eval', phase: 'PHASE_1', order: 74, companyTags: ['Amazon'] },
  { title: 'Asteroid Collision', url: 'https://leetcode.com/problems/asteroid-collision/', difficulty: 'MEDIUM', topic: 'Stack', subtopic: 'Simulation', phase: 'PHASE_1', order: 75 },
  { title: 'Car Fleet', url: 'https://leetcode.com/problems/car-fleet/', difficulty: 'MEDIUM', topic: 'Stack', subtopic: 'Monotonic', phase: 'PHASE_1', order: 76 },
  { title: 'Simplify Path', url: 'https://leetcode.com/problems/simplify-path/', difficulty: 'MEDIUM', topic: 'Stack', subtopic: 'String Parsing', phase: 'PHASE_1', order: 77, companyTags: ['Meta'] },
  { title: 'Decode String', url: 'https://leetcode.com/problems/decode-string/', difficulty: 'MEDIUM', topic: 'Stack', subtopic: 'Nested', phase: 'PHASE_1', order: 78, companyTags: ['Amazon', 'Google'] },
  { title: 'Maximum Frequency Stack', url: 'https://leetcode.com/problems/maximum-frequency-stack/', difficulty: 'HARD', topic: 'Stack', subtopic: 'Frequency Map', phase: 'PHASE_1', order: 79, companyTags: ['Amazon'] },

  // Monotonic Stack
  { title: 'Next Greater Element I', url: 'https://leetcode.com/problems/next-greater-element-i/', difficulty: 'MEDIUM', topic: 'Monotonic Stack', subtopic: 'Next Greater', phase: 'PHASE_1', order: 80 },
  { title: 'Daily Temperatures', url: 'https://leetcode.com/problems/daily-temperatures/', difficulty: 'MEDIUM', topic: 'Monotonic Stack', subtopic: 'Next Greater', phase: 'PHASE_1', order: 81, companyTags: ['Amazon', 'Google'] },
  { title: 'Next Greater Element II', url: 'https://leetcode.com/problems/next-greater-element-ii/', difficulty: 'MEDIUM', topic: 'Monotonic Stack', subtopic: 'Circular Array', phase: 'PHASE_1', order: 82 },
  { title: 'Remove K Digits', url: 'https://leetcode.com/problems/remove-k-digits/', difficulty: 'MEDIUM', topic: 'Monotonic Stack', subtopic: 'Greedy', phase: 'PHASE_1', order: 83 },
  { title: 'Sum of Subarray Minimums', url: 'https://leetcode.com/problems/sum-of-subarray-minimums/', difficulty: 'MEDIUM', topic: 'Monotonic Stack', subtopic: 'Contribution Technique', phase: 'PHASE_4', order: 84 },
  { title: 'Online Stock Span', url: 'https://leetcode.com/problems/online-stock-span/', difficulty: 'MEDIUM', topic: 'Monotonic Stack', subtopic: 'Online Algorithm', phase: 'PHASE_4', order: 85 },
  { title: 'Largest Rectangle in Histogram', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', difficulty: 'HARD', topic: 'Monotonic Stack', subtopic: 'Area', phase: 'PHASE_1', order: 86, companyTags: ['Amazon', 'Google'] },
  { title: 'Maximal Rectangle', url: 'https://leetcode.com/problems/maximal-rectangle/', difficulty: 'HARD', topic: 'Monotonic Stack', subtopic: 'Area', phase: 'PHASE_4', order: 87, companyTags: ['Amazon', 'Google'] },

  // Matrix Traversal
  { title: 'Transpose Matrix', url: 'https://leetcode.com/problems/transpose-matrix/', difficulty: 'EASY', topic: 'Matrix Traversal', subtopic: 'Basic', phase: 'PHASE_1', order: 88 },
  { title: 'Rotate Image', url: 'https://leetcode.com/problems/rotate-image/', difficulty: 'MEDIUM', topic: 'Matrix Traversal', subtopic: 'In-place Rotation', phase: 'PHASE_1', order: 89, companyTags: ['Amazon', 'Google'] },
  { title: 'Spiral Matrix', url: 'https://leetcode.com/problems/spiral-matrix/', difficulty: 'MEDIUM', topic: 'Matrix Traversal', subtopic: 'Simulation', phase: 'PHASE_1', order: 90, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Set Matrix Zeroes', url: 'https://leetcode.com/problems/set-matrix-zeroes/', difficulty: 'MEDIUM', topic: 'Matrix Traversal', subtopic: 'In-place', phase: 'PHASE_1', order: 91, companyTags: ['Amazon', 'Google'] },

  // Math & String Simulation
  { title: 'Excel Sheet Column Title', url: 'https://leetcode.com/problems/excel-sheet-column-title/', difficulty: 'EASY', topic: 'Math & String', subtopic: 'Base Conversion', phase: 'PHASE_1', order: 92 },
  { title: 'Greatest Common Divisor of Strings', url: 'https://leetcode.com/problems/greatest-common-divisor-of-strings/', difficulty: 'EASY', topic: 'Math & String', subtopic: 'GCD', phase: 'PHASE_1', order: 93 },
  { title: 'Plus One', url: 'https://leetcode.com/problems/plus-one/', difficulty: 'EASY', topic: 'Math & String', subtopic: 'Array Math', phase: 'PHASE_1', order: 94, companyTags: ['Google'] },
  { title: 'Roman to Integer', url: 'https://leetcode.com/problems/roman-to-integer/', difficulty: 'EASY', topic: 'Math & String', subtopic: 'String Parsing', phase: 'PHASE_1', order: 95, companyTags: ['Amazon', 'Google'] },
  { title: 'Multiply Strings', url: 'https://leetcode.com/problems/multiply-strings/', difficulty: 'MEDIUM', topic: 'Math & String', subtopic: 'Big Integer', phase: 'PHASE_1', order: 96, companyTags: ['Amazon', 'Google'] },

  // ─────────────────────────────────────────────
  // PHASE 2 — Structures & Recursion
  // ─────────────────────────────────────────────

  // Fast & Slow Pointers
  { title: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/', difficulty: 'EASY', topic: 'Fast & Slow Pointers', subtopic: 'Cycle Detection', phase: 'PHASE_2', order: 1, companyTags: ['Amazon', 'Google'] },
  { title: 'Happy Number', url: 'https://leetcode.com/problems/happy-number/', difficulty: 'EASY', topic: 'Fast & Slow Pointers', subtopic: 'Cycle Detection', phase: 'PHASE_2', order: 2, companyTags: ['Amazon'] },
  { title: 'Middle of the Linked List', url: 'https://leetcode.com/problems/middle-of-the-linked-list/', difficulty: 'MEDIUM', topic: 'Fast & Slow Pointers', subtopic: 'Two Pointer', phase: 'PHASE_2', order: 3 },
  { title: 'Linked List Cycle II', url: 'https://leetcode.com/problems/linked-list-cycle-ii/', difficulty: 'MEDIUM', topic: 'Fast & Slow Pointers', subtopic: 'Cycle Detection', phase: 'PHASE_2', order: 4, companyTags: ['Amazon'] },
  { title: 'Find the Duplicate Number', url: 'https://leetcode.com/problems/find-the-duplicate-number/', difficulty: 'MEDIUM', topic: 'Fast & Slow Pointers', subtopic: 'Cycle Detection', phase: 'PHASE_2', order: 5, companyTags: ['Amazon', 'Google'] },
  { title: 'Reorder List', url: 'https://leetcode.com/problems/reorder-list/', difficulty: 'MEDIUM', topic: 'Fast & Slow Pointers', subtopic: 'Reversal + Merge', phase: 'PHASE_2', order: 6, companyTags: ['Amazon'] },

  // In-place List Reversal
  { title: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', difficulty: 'EASY', topic: 'In-place List Reversal', subtopic: 'Iterative / Recursive', phase: 'PHASE_2', order: 7, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Reverse Linked List II', url: 'https://leetcode.com/problems/reverse-linked-list-ii/', difficulty: 'MEDIUM', topic: 'In-place List Reversal', subtopic: 'Partial Reversal', phase: 'PHASE_2', order: 8, companyTags: ['Amazon'] },
  { title: 'Swap Nodes in Pairs', url: 'https://leetcode.com/problems/swap-nodes-in-pairs/', difficulty: 'MEDIUM', topic: 'In-place List Reversal', subtopic: 'Pairwise Swap', phase: 'PHASE_2', order: 9 },
  { title: 'Reverse Nodes in k-Group', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', difficulty: 'HARD', topic: 'In-place List Reversal', subtopic: 'k-Group Reversal', phase: 'PHASE_2', order: 10, companyTags: ['Amazon', 'Google', 'Meta'] },

  // Linked List Manipulation
  { title: 'Merge Two Sorted Lists', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', difficulty: 'EASY', topic: 'Linked List', subtopic: 'Merge', phase: 'PHASE_2', order: 11, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Remove Nth Node from End of List', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', difficulty: 'MEDIUM', topic: 'Linked List', subtopic: 'Two Pointer', phase: 'PHASE_2', order: 12, companyTags: ['Amazon', 'Google'] },
  { title: 'Copy List with Random Pointer', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/', difficulty: 'MEDIUM', topic: 'Linked List', subtopic: 'Deep Copy', phase: 'PHASE_2', order: 13, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Add Two Numbers', url: 'https://leetcode.com/problems/add-two-numbers/', difficulty: 'MEDIUM', topic: 'Linked List', subtopic: 'Math on List', phase: 'PHASE_2', order: 14, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Design Circular Queue', url: 'https://leetcode.com/problems/design-circular-queue/', difficulty: 'MEDIUM', topic: 'Linked List', subtopic: 'Design', phase: 'PHASE_2', order: 15 },
  { title: 'LRU Cache', url: 'https://leetcode.com/problems/lru-cache/', difficulty: 'MEDIUM', topic: 'Linked List', subtopic: 'Design + HashMap', phase: 'PHASE_2', order: 16, companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'] },
  { title: 'Insert Greatest Common Divisors in Linked List', url: 'https://leetcode.com/problems/insert-greatest-common-divisors-in-linked-list/', difficulty: 'MEDIUM', topic: 'Linked List', subtopic: 'Insertion', phase: 'PHASE_2', order: 17 },
  { title: 'LFU Cache', url: 'https://leetcode.com/problems/lfu-cache/', difficulty: 'HARD', topic: 'Linked List', subtopic: 'Design + Frequency Map', phase: 'PHASE_2', order: 18, companyTags: ['Amazon', 'Google'] },

  // Tree Traversal
  { title: 'Maximum Depth of Binary Tree', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'DFS', phase: 'PHASE_2', order: 19, companyTags: ['Amazon', 'Google'] },
  { title: 'Invert Binary Tree', url: 'https://leetcode.com/problems/invert-binary-tree/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'DFS', phase: 'PHASE_2', order: 20, companyTags: ['Google'] },
  { title: 'Diameter of Binary Tree', url: 'https://leetcode.com/problems/diameter-of-binary-tree/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'DFS', phase: 'PHASE_2', order: 21, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Binary Tree Inorder Traversal', url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'Traversal', phase: 'PHASE_2', order: 22, companyTags: ['Amazon', 'Microsoft'] },
  { title: 'Binary Tree Preorder Traversal', url: 'https://leetcode.com/problems/binary-tree-preorder-traversal/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'Traversal', phase: 'PHASE_2', order: 23 },
  { title: 'Binary Tree Postorder Traversal', url: 'https://leetcode.com/problems/binary-tree-postorder-traversal/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'Traversal', phase: 'PHASE_2', order: 24 },
  { title: 'Balanced Binary Tree', url: 'https://leetcode.com/problems/balanced-binary-tree/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'DFS', phase: 'PHASE_2', order: 25, companyTags: ['Amazon'] },
  { title: 'Same Tree', url: 'https://leetcode.com/problems/same-tree/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'DFS', phase: 'PHASE_2', order: 26, companyTags: ['Amazon'] },
  { title: 'Subtree of Another Tree', url: 'https://leetcode.com/problems/subtree-of-another-tree/', difficulty: 'EASY', topic: 'Tree Traversal', subtopic: 'DFS', phase: 'PHASE_2', order: 27, companyTags: ['Amazon'] },
  { title: 'Symmetric Tree', url: 'https://leetcode.com/problems/symmetric-tree/', difficulty: 'MEDIUM', topic: 'Tree Traversal', subtopic: 'Mirror DFS', phase: 'PHASE_2', order: 28, companyTags: ['Amazon', 'Microsoft'] },
  { title: 'Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', difficulty: 'MEDIUM', topic: 'Tree Traversal', subtopic: 'BFS', phase: 'PHASE_2', order: 29, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Binary Tree Right Side View', url: 'https://leetcode.com/problems/binary-tree-right-side-view/', difficulty: 'MEDIUM', topic: 'Tree Traversal', subtopic: 'BFS', phase: 'PHASE_2', order: 30, companyTags: ['Amazon', 'Meta'] },
  { title: 'Lowest Common Ancestor of a Binary Tree', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', difficulty: 'MEDIUM', topic: 'Tree Traversal', subtopic: 'LCA', phase: 'PHASE_2', order: 31, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Construct Binary Tree from Preorder and Inorder Traversal', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', difficulty: 'MEDIUM', topic: 'Tree Traversal', subtopic: 'Reconstruction', phase: 'PHASE_2', order: 32, companyTags: ['Amazon', 'Google'] },
  { title: 'Construct Quad Tree', url: 'https://leetcode.com/problems/construct-quad-tree/', difficulty: 'MEDIUM', topic: 'Tree Traversal', subtopic: 'Divide & Conquer', phase: 'PHASE_2', order: 33 },
  { title: 'Count Good Nodes in Binary Tree', url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/', difficulty: 'MEDIUM', topic: 'Tree Traversal', subtopic: 'DFS', phase: 'PHASE_2', order: 34 },
  { title: 'Delete Leaves With a Given Value', url: 'https://leetcode.com/problems/delete-leaves-with-a-given-value/', difficulty: 'MEDIUM', topic: 'Tree Traversal', subtopic: 'Post-order', phase: 'PHASE_2', order: 35 },
  { title: 'Binary Tree Maximum Path Sum', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', difficulty: 'HARD', topic: 'Tree Traversal', subtopic: 'DFS', phase: 'PHASE_2', order: 36, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Serialize and Deserialize Binary Tree', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', difficulty: 'HARD', topic: 'Tree Traversal', subtopic: 'BFS/DFS', phase: 'PHASE_2', order: 37, companyTags: ['Amazon', 'Google', 'Meta'] },

  // BST
  { title: 'Search in a Binary Search Tree', url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', difficulty: 'MEDIUM', topic: 'BST', subtopic: 'Basic', phase: 'PHASE_2', order: 38 },
  { title: 'Convert Sorted Array to Binary Search Tree', url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', difficulty: 'MEDIUM', topic: 'BST', subtopic: 'Construction', phase: 'PHASE_2', order: 39, companyTags: ['Amazon'] },
  { title: 'Validate Binary Search Tree', url: 'https://leetcode.com/problems/validate-binary-search-tree/', difficulty: 'MEDIUM', topic: 'BST', subtopic: 'Validation', phase: 'PHASE_2', order: 40, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Kth Smallest Element in a BST', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', difficulty: 'MEDIUM', topic: 'BST', subtopic: 'In-order', phase: 'PHASE_2', order: 41, companyTags: ['Amazon', 'Google'] },
  { title: 'Lowest Common Ancestor of a Binary Search Tree', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', difficulty: 'MEDIUM', topic: 'BST', subtopic: 'LCA', phase: 'PHASE_2', order: 42, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Recover Binary Search Tree', url: 'https://leetcode.com/problems/recover-binary-search-tree/', difficulty: 'MEDIUM', topic: 'BST', subtopic: 'In-order', phase: 'PHASE_2', order: 43 },
  { title: 'Insert into a Binary Search Tree', url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/', difficulty: 'MEDIUM', topic: 'BST', subtopic: 'Insertion', phase: 'PHASE_2', order: 44 },
  { title: 'Delete Node in a BST', url: 'https://leetcode.com/problems/delete-node-in-a-bst/', difficulty: 'MEDIUM', topic: 'BST', subtopic: 'Deletion', phase: 'PHASE_2', order: 45 },

  // Top-K / K-way Merge (Heap)
  { title: 'Kth Largest Element in a Stream', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', difficulty: 'EASY', topic: 'Heap', subtopic: 'Min Heap', phase: 'PHASE_2', order: 46, companyTags: ['Amazon', 'Google'] },
  { title: 'Last Stone Weight', url: 'https://leetcode.com/problems/last-stone-weight/', difficulty: 'EASY', topic: 'Heap', subtopic: 'Max Heap', phase: 'PHASE_2', order: 47 },
  { title: 'K Closest Points to Origin', url: 'https://leetcode.com/problems/k-closest-points-to-origin/', difficulty: 'MEDIUM', topic: 'Heap', subtopic: 'Min Heap', phase: 'PHASE_2', order: 48, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Task Scheduler', url: 'https://leetcode.com/problems/task-scheduler/', difficulty: 'MEDIUM', topic: 'Heap', subtopic: 'Greedy + Heap', phase: 'PHASE_2', order: 49, companyTags: ['Amazon', 'Google'] },
  { title: 'Design Twitter', url: 'https://leetcode.com/problems/design-twitter/', difficulty: 'MEDIUM', topic: 'Heap', subtopic: 'Design + Heap', phase: 'PHASE_2', order: 50, companyTags: ['Twitter'] },
  { title: 'Single-Threaded CPU', url: 'https://leetcode.com/problems/single-threaded-cpu/', difficulty: 'MEDIUM', topic: 'Heap', subtopic: 'Priority Queue', phase: 'PHASE_2', order: 51 },
  { title: 'Reorganize String', url: 'https://leetcode.com/problems/reorganize-string/', difficulty: 'MEDIUM', topic: 'Heap', subtopic: 'Greedy + Heap', phase: 'PHASE_2', order: 52, companyTags: ['Amazon', 'Google'] },
  { title: 'Longest Happy String', url: 'https://leetcode.com/problems/longest-happy-string/', difficulty: 'MEDIUM', topic: 'Heap', subtopic: 'Greedy + Heap', phase: 'PHASE_2', order: 53 },
  { title: 'Find Median from Data Stream', url: 'https://leetcode.com/problems/find-median-from-data-stream/', difficulty: 'HARD', topic: 'Heap', subtopic: 'Two Heaps', phase: 'PHASE_2', order: 54, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Merge k Sorted Lists', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', difficulty: 'HARD', topic: 'Heap', subtopic: 'K-way Merge', phase: 'PHASE_2', order: 55, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'IPO', url: 'https://leetcode.com/problems/ipo/', difficulty: 'HARD', topic: 'Heap', subtopic: 'Two Heaps', phase: 'PHASE_2', order: 56 },

  // Divide & Conquer
  { title: 'Majority Element', url: 'https://leetcode.com/problems/majority-element/', difficulty: 'EASY', topic: 'Divide & Conquer', subtopic: 'Boyer-Moore', phase: 'PHASE_2', order: 57, companyTags: ['Amazon', 'Google'] },
  { title: 'Pow(x, n)', url: 'https://leetcode.com/problems/powx-n/', difficulty: 'MEDIUM', topic: 'Divide & Conquer', subtopic: 'Fast Exponentiation', phase: 'PHASE_2', order: 58, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', difficulty: 'MEDIUM', topic: 'Divide & Conquer', subtopic: 'Merge Sort', phase: 'PHASE_2', order: 59 },
  { title: 'Kth Largest Element in an Array', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', difficulty: 'MEDIUM', topic: 'Divide & Conquer', subtopic: 'QuickSelect', phase: 'PHASE_2', order: 60, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Different Ways to Add Parentheses', url: 'https://leetcode.com/problems/different-ways-to-add-parentheses/', difficulty: 'MEDIUM', topic: 'Divide & Conquer', subtopic: 'Memoization', phase: 'PHASE_2', order: 61 },
  { title: 'Majority Element II', url: 'https://leetcode.com/problems/majority-element-ii/', difficulty: 'MEDIUM', topic: 'Divide & Conquer', subtopic: 'Boyer-Moore', phase: 'PHASE_2', order: 62 },
  { title: 'Count of Smaller Numbers After Self', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/', difficulty: 'HARD', topic: 'Divide & Conquer', subtopic: 'Merge Sort / BIT', phase: 'PHASE_2', order: 63, companyTags: ['Google', 'Amazon'] },
  { title: 'Reverse Pairs', url: 'https://leetcode.com/problems/reverse-pairs/', difficulty: 'HARD', topic: 'Divide & Conquer', subtopic: 'Merge Sort', phase: 'PHASE_2', order: 64 },

  // Backtracking
  { title: 'Sum of All Subsets XOR Total', url: 'https://leetcode.com/problems/sum-of-all-subset-xor-totals/', difficulty: 'EASY', topic: 'Backtracking', subtopic: 'Subsets', phase: 'PHASE_2', order: 65 },
  { title: 'Subsets', url: 'https://leetcode.com/problems/subsets/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Subsets', phase: 'PHASE_2', order: 66, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Permutations', url: 'https://leetcode.com/problems/permutations/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Permutations', phase: 'PHASE_2', order: 67, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Combination Sum', url: 'https://leetcode.com/problems/combination-sum/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Combinations', phase: 'PHASE_2', order: 68, companyTags: ['Amazon', 'Google'] },
  { title: 'Generate Parentheses', url: 'https://leetcode.com/problems/generate-parentheses/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Recursive Generation', phase: 'PHASE_2', order: 69, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Word Search', url: 'https://leetcode.com/problems/word-search/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'DFS Grid', phase: 'PHASE_2', order: 70, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Palindrome Partitioning', url: 'https://leetcode.com/problems/palindrome-partitioning/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Partition', phase: 'PHASE_2', order: 71, companyTags: ['Amazon', 'Google'] },
  { title: 'Sudoku Solver', url: 'https://leetcode.com/problems/sudoku-solver/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Constraint Satisfaction', phase: 'PHASE_2', order: 72, companyTags: ['Amazon', 'Google'] },
  { title: 'Combination Sum II', url: 'https://leetcode.com/problems/combination-sum-ii/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Combinations', phase: 'PHASE_2', order: 73 },
  { title: 'Combinations', url: 'https://leetcode.com/problems/combinations/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Combinations', phase: 'PHASE_2', order: 74 },
  { title: 'Subsets II', url: 'https://leetcode.com/problems/subsets-ii/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Subsets with Duplicates', phase: 'PHASE_2', order: 75 },
  { title: 'Permutations II', url: 'https://leetcode.com/problems/permutations-ii/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Permutations with Duplicates', phase: 'PHASE_2', order: 76 },
  { title: 'Letter Combinations of a Phone Number', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Combinations', phase: 'PHASE_2', order: 77, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Matchsticks to Square', url: 'https://leetcode.com/problems/matchsticks-to-square/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Partitioning', phase: 'PHASE_2', order: 78 },
  { title: 'Partition to K Equal Sum Subsets', url: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/', difficulty: 'MEDIUM', topic: 'Backtracking', subtopic: 'Partitioning', phase: 'PHASE_2', order: 79, companyTags: ['Amazon', 'Google'] },
  { title: 'N-Queens', url: 'https://leetcode.com/problems/n-queens/', difficulty: 'HARD', topic: 'Backtracking', subtopic: 'Constraint Satisfaction', phase: 'PHASE_2', order: 80, companyTags: ['Amazon', 'Google'] },
  { title: 'Word Search II', url: 'https://leetcode.com/problems/word-search-ii/', difficulty: 'HARD', topic: 'Backtracking', subtopic: 'Trie + DFS', phase: 'PHASE_2', order: 81, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'N-Queens II', url: 'https://leetcode.com/problems/n-queens-ii/', difficulty: 'HARD', topic: 'Backtracking', subtopic: 'Constraint Satisfaction', phase: 'PHASE_2', order: 82 },
  { title: 'Word Break II', url: 'https://leetcode.com/problems/word-break-ii/', difficulty: 'HARD', topic: 'Backtracking', subtopic: 'Memoization', phase: 'PHASE_2', order: 83, companyTags: ['Amazon', 'Google'] },

  // ─────────────────────────────────────────────
  // PHASE 3 — Graphs & Dynamic Programming
  // ─────────────────────────────────────────────

  // Graph Traversal
  { title: 'Island Perimeter', url: 'https://leetcode.com/problems/island-perimeter/', difficulty: 'EASY', topic: 'Graph Traversal', subtopic: 'Grid DFS', phase: 'PHASE_3', order: 1 },
  { title: 'Verifying an Alien Dictionary', url: 'https://leetcode.com/problems/verifying-an-alien-dictionary/', difficulty: 'EASY', topic: 'Graph Traversal', subtopic: 'Ordering', phase: 'PHASE_3', order: 2, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Find the Town Judge', url: 'https://leetcode.com/problems/find-the-town-judge/', difficulty: 'EASY', topic: 'Graph Traversal', subtopic: 'In-degree', phase: 'PHASE_3', order: 3 },
  { title: 'Flood Fill', url: 'https://leetcode.com/problems/flood-fill/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'DFS Grid', phase: 'PHASE_3', order: 4 },
  { title: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'DFS/BFS Grid', phase: 'PHASE_3', order: 5, companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'] },
  { title: 'Clone Graph', url: 'https://leetcode.com/problems/clone-graph/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'BFS Deep Copy', phase: 'PHASE_3', order: 6, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Rotting Oranges', url: 'https://leetcode.com/problems/rotting-oranges/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'Multi-source BFS', phase: 'PHASE_3', order: 7, companyTags: ['Amazon', 'Google'] },
  { title: 'Pacific Atlantic Water Flow', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'Multi-source DFS', phase: 'PHASE_3', order: 8, companyTags: ['Google'] },
  { title: 'Is Graph Bipartite', url: 'https://leetcode.com/problems/is-graph-bipartite/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: '2-Coloring', phase: 'PHASE_3', order: 9, companyTags: ['Google'] },
  { title: 'Max Area of Island', url: 'https://leetcode.com/problems/max-area-of-island/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'DFS Grid', phase: 'PHASE_3', order: 10, companyTags: ['Amazon', 'Google'] },
  { title: 'Walls and Gates', url: 'https://leetcode.com/problems/walls-and-gates/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'Multi-source BFS', phase: 'PHASE_3', order: 11, companyTags: ['Meta'] },
  { title: 'Surrounded Regions', url: 'https://leetcode.com/problems/surrounded-regions/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'DFS Border', phase: 'PHASE_3', order: 12, companyTags: ['Amazon', 'Google'] },
  { title: 'Open the Lock', url: 'https://leetcode.com/problems/open-the-lock/', difficulty: 'MEDIUM', topic: 'Graph Traversal', subtopic: 'BFS', phase: 'PHASE_3', order: 13 },
  { title: 'Word Ladder', url: 'https://leetcode.com/problems/word-ladder/', difficulty: 'HARD', topic: 'Graph Traversal', subtopic: 'BFS Shortest Path', phase: 'PHASE_3', order: 14, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Word Ladder II', url: 'https://leetcode.com/problems/word-ladder-ii/', difficulty: 'HARD', topic: 'Graph Traversal', subtopic: 'BFS + Backtrack', phase: 'PHASE_3', order: 15, companyTags: ['Amazon', 'Google'] },
  { title: 'Reconstruct Itinerary', url: 'https://leetcode.com/problems/reconstruct-itinerary/', difficulty: 'HARD', topic: 'Graph Traversal', subtopic: 'Eulerian Path', phase: 'PHASE_3', order: 16, companyTags: ['Google'] },

  // Topological Sort
  { title: 'Course Schedule', url: 'https://leetcode.com/problems/course-schedule/', difficulty: 'MEDIUM', topic: 'Topological Sort', subtopic: 'Cycle Detection', phase: 'PHASE_3', order: 17, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Course Schedule II', url: 'https://leetcode.com/problems/course-schedule-ii/', difficulty: 'MEDIUM', topic: 'Topological Sort', subtopic: 'Kahn\'s Algorithm', phase: 'PHASE_3', order: 18, companyTags: ['Amazon', 'Google'] },
  { title: 'Minimum Height Trees', url: 'https://leetcode.com/problems/minimum-height-trees/', difficulty: 'MEDIUM', topic: 'Topological Sort', subtopic: 'Leaf Pruning', phase: 'PHASE_3', order: 19, companyTags: ['Google'] },
  { title: 'Alien Dictionary', url: 'https://leetcode.com/problems/alien-dictionary/', difficulty: 'HARD', topic: 'Topological Sort', subtopic: 'Kahn\'s Algorithm', phase: 'PHASE_3', order: 20, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Sequence Reconstruction', url: 'https://leetcode.com/problems/sequence-reconstruction/', difficulty: 'HARD', topic: 'Topological Sort', subtopic: 'Unique Topo Order', phase: 'PHASE_3', order: 21 },
  { title: 'Build a Matrix With Conditions', url: 'https://leetcode.com/problems/build-a-matrix-with-conditions/', difficulty: 'HARD', topic: 'Topological Sort', subtopic: 'Kahn\'s Algorithm', phase: 'PHASE_3', order: 22 },

  // Union-Find
  { title: 'Number of Provinces', url: 'https://leetcode.com/problems/number-of-provinces/', difficulty: 'MEDIUM', topic: 'Union-Find', subtopic: 'Connected Components', phase: 'PHASE_3', order: 23, companyTags: ['Amazon', 'Google'] },
  { title: 'Redundant Connection', url: 'https://leetcode.com/problems/redundant-connection/', difficulty: 'MEDIUM', topic: 'Union-Find', subtopic: 'Cycle Detection', phase: 'PHASE_3', order: 24, companyTags: ['Amazon', 'Google'] },
  { title: 'Accounts Merge', url: 'https://leetcode.com/problems/accounts-merge/', difficulty: 'MEDIUM', topic: 'Union-Find', subtopic: 'Grouping', phase: 'PHASE_3', order: 25, companyTags: ['Google', 'Meta'] },
  { title: 'Graph Valid Tree', url: 'https://leetcode.com/problems/graph-valid-tree/', difficulty: 'MEDIUM', topic: 'Union-Find', subtopic: 'Cycle + Connected', phase: 'PHASE_3', order: 26, companyTags: ['Google', 'Linkedin'] },
  { title: 'Number of Islands II', url: 'https://leetcode.com/problems/number-of-islands-ii/', difficulty: 'MEDIUM', topic: 'Union-Find', subtopic: 'Online Algorithm', phase: 'PHASE_3', order: 27, companyTags: ['Google'] },
  { title: 'Smallest String With Swaps', url: 'https://leetcode.com/problems/smallest-string-with-swaps/', difficulty: 'MEDIUM', topic: 'Union-Find', subtopic: 'Grouping', phase: 'PHASE_3', order: 28 },
  { title: 'Number of Connected Components in an Undirected Graph', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', difficulty: 'MEDIUM', topic: 'Union-Find', subtopic: 'Connected Components', phase: 'PHASE_3', order: 29, companyTags: ['Amazon', 'Google', 'Linkedin'] },
  { title: 'Min Cost to Connect All Points', url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/', difficulty: 'MEDIUM', topic: 'Union-Find', subtopic: 'Kruskal MST', phase: 'PHASE_3', order: 30 },
  { title: 'Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree', url: 'https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/', difficulty: 'HARD', topic: 'Union-Find', subtopic: 'MST', phase: 'PHASE_3', order: 31 },
  { title: 'Greatest Common Divisor Traversal', url: 'https://leetcode.com/problems/greatest-common-divisor-traversal/', difficulty: 'HARD', topic: 'Union-Find', subtopic: 'Graph Construction', phase: 'PHASE_3', order: 32 },

  // Greedy
  { title: 'Assign Cookies', url: 'https://leetcode.com/problems/assign-cookies/', difficulty: 'EASY', topic: 'Greedy', subtopic: 'Sorting', phase: 'PHASE_3', order: 33 },
  { title: 'Lemonade Change', url: 'https://leetcode.com/problems/lemonade-change/', difficulty: 'EASY', topic: 'Greedy', subtopic: 'Simulation', phase: 'PHASE_3', order: 34 },
  { title: 'Best Time to Buy and Sell Stock II', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Peak Valley', phase: 'PHASE_3', order: 35, companyTags: ['Amazon', 'Google'] },
  { title: 'Jump Game', url: 'https://leetcode.com/problems/jump-game/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Reachability', phase: 'PHASE_3', order: 36, companyTags: ['Amazon', 'Google'] },
  { title: 'Jump Game II', url: 'https://leetcode.com/problems/jump-game-ii/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'BFS Greedy', phase: 'PHASE_3', order: 37, companyTags: ['Amazon', 'Google'] },
  { title: 'Gas Station', url: 'https://leetcode.com/problems/gas-station/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Circular Array', phase: 'PHASE_3', order: 38, companyTags: ['Amazon', 'Google'] },
  { title: 'Partition Labels', url: 'https://leetcode.com/problems/partition-labels/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Interval', phase: 'PHASE_3', order: 39, companyTags: ['Amazon', 'Google'] },
  { title: 'Non-overlapping Intervals', url: 'https://leetcode.com/problems/non-overlapping-intervals/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Interval Scheduling', phase: 'PHASE_3', order: 40, companyTags: ['Amazon', 'Google'] },
  { title: 'Maximum Sum Circular Subarray', url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Kadane + Total', phase: 'PHASE_3', order: 41 },
  { title: 'Longest Turbulent Subarray', url: 'https://leetcode.com/problems/longest-turbulent-subarray/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Sliding Window', phase: 'PHASE_3', order: 42 },
  { title: 'Jump Game VII', url: 'https://leetcode.com/problems/jump-game-vii/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Sliding Window', phase: 'PHASE_3', order: 43 },
  { title: 'Hand of Straights', url: 'https://leetcode.com/problems/hand-of-straights/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Sorting + HashMap', phase: 'PHASE_3', order: 44, companyTags: ['Amazon'] },
  { title: 'Dota2 Senate', url: 'https://leetcode.com/problems/dota2-senate/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Queue Simulation', phase: 'PHASE_3', order: 45 },
  { title: 'Merge Triplets to Form Target Triplet', url: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Filtering', phase: 'PHASE_3', order: 46 },
  { title: 'Valid Parenthesis String', url: 'https://leetcode.com/problems/valid-parenthesis-string/', difficulty: 'MEDIUM', topic: 'Greedy', subtopic: 'Range Tracking', phase: 'PHASE_3', order: 47, companyTags: ['Amazon', 'Google'] },
  { title: 'Candy', url: 'https://leetcode.com/problems/candy/', difficulty: 'HARD', topic: 'Greedy', subtopic: 'Two Pass', phase: 'PHASE_3', order: 48, companyTags: ['Amazon', 'Google'] },
  { title: 'Course Schedule III', url: 'https://leetcode.com/problems/course-schedule-iii/', difficulty: 'HARD', topic: 'Greedy', subtopic: 'Heap + Greedy', phase: 'PHASE_3', order: 49 },

  // Interval Merging
  { title: 'Meeting Rooms', url: 'https://leetcode.com/problems/meeting-rooms/', difficulty: 'EASY', topic: 'Interval Merging', subtopic: 'Sorting', phase: 'PHASE_3', order: 50, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Merge Intervals', url: 'https://leetcode.com/problems/merge-intervals/', difficulty: 'MEDIUM', topic: 'Interval Merging', subtopic: 'Sorting + Merge', phase: 'PHASE_3', order: 51, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Insert Interval', url: 'https://leetcode.com/problems/insert-interval/', difficulty: 'MEDIUM', topic: 'Interval Merging', subtopic: 'Merge + Insert', phase: 'PHASE_3', order: 52, companyTags: ['Google', 'Meta'] },
  { title: 'Meeting Rooms II', url: 'https://leetcode.com/problems/meeting-rooms-ii/', difficulty: 'MEDIUM', topic: 'Interval Merging', subtopic: 'Min Heap', phase: 'PHASE_3', order: 53, companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'] },
  { title: 'Minimum Number of Arrows to Burst Balloons', url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/', difficulty: 'MEDIUM', topic: 'Interval Merging', subtopic: 'Greedy', phase: 'PHASE_3', order: 54 },
  { title: 'Interval List Intersections', url: 'https://leetcode.com/problems/interval-list-intersections/', difficulty: 'MEDIUM', topic: 'Interval Merging', subtopic: 'Two Pointer', phase: 'PHASE_3', order: 55, companyTags: ['Meta'] },
  { title: 'Employee Free Time', url: 'https://leetcode.com/problems/employee-free-time/', difficulty: 'HARD', topic: 'Interval Merging', subtopic: 'Merge + Gap', phase: 'PHASE_3', order: 56, companyTags: ['Google', 'Uber'] },
  { title: 'Meeting Rooms III', url: 'https://leetcode.com/problems/meeting-rooms-iii/', difficulty: 'HARD', topic: 'Interval Merging', subtopic: 'Priority Queue', phase: 'PHASE_3', order: 57 },

  // Sweep Line
  { title: 'Car Pooling', url: 'https://leetcode.com/problems/car-pooling/', difficulty: 'MEDIUM', topic: 'Sweep Line', subtopic: 'Difference Array', phase: 'PHASE_3', order: 58, companyTags: ['Amazon'] },
  { title: 'My Calendar I', url: 'https://leetcode.com/problems/my-calendar-i/', difficulty: 'MEDIUM', topic: 'Sweep Line', subtopic: 'Binary Search', phase: 'PHASE_3', order: 59 },
  { title: 'The Skyline Problem', url: 'https://leetcode.com/problems/the-skyline-problem/', difficulty: 'HARD', topic: 'Sweep Line', subtopic: 'Heap + Events', phase: 'PHASE_3', order: 60, companyTags: ['Google', 'Microsoft'] },
  { title: 'Rectangle Area II', url: 'https://leetcode.com/problems/rectangle-area-ii/', difficulty: 'HARD', topic: 'Sweep Line', subtopic: 'Coordinate Compression', phase: 'PHASE_3', order: 61 },
  { title: 'My Calendar III', url: 'https://leetcode.com/problems/my-calendar-iii/', difficulty: 'HARD', topic: 'Sweep Line', subtopic: 'Segment Tree', phase: 'PHASE_3', order: 62 },
  { title: 'Minimum Interval to Include Each Query', url: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/', difficulty: 'HARD', topic: 'Sweep Line', subtopic: 'Sorting + Heap', phase: 'PHASE_3', order: 63 },

  // Dynamic Programming
  { title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/', difficulty: 'EASY', topic: 'Dynamic Programming', subtopic: 'Fibonacci', phase: 'PHASE_3', order: 64, companyTags: ['Amazon', 'Apple', 'Google'] },
  { title: 'Min Cost Climbing Stairs', url: 'https://leetcode.com/problems/min-cost-climbing-stairs/', difficulty: 'EASY', topic: 'Dynamic Programming', subtopic: 'Fibonacci Variant', phase: 'PHASE_3', order: 65 },
  { title: 'N-th Tribonacci Number', url: 'https://leetcode.com/problems/n-th-tribonacci-number/', difficulty: 'EASY', topic: 'Dynamic Programming', subtopic: 'Fibonacci Variant', phase: 'PHASE_3', order: 66 },
  { title: 'House Robber', url: 'https://leetcode.com/problems/house-robber/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: '1D DP', phase: 'PHASE_3', order: 67, companyTags: ['Amazon', 'Google'] },
  { title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Kadane', phase: 'PHASE_3', order: 68, companyTags: ['Amazon', 'Google', 'Meta', 'Microsoft'] },
  { title: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Unbounded Knapsack', phase: 'PHASE_3', order: 69, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Longest Increasing Subsequence', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'LIS', phase: 'PHASE_3', order: 70, companyTags: ['Amazon', 'Google', 'Microsoft'] },
  { title: 'Longest Common Subsequence', url: 'https://leetcode.com/problems/longest-common-subsequence/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'LCS', phase: 'PHASE_3', order: 71, companyTags: ['Amazon', 'Google', 'Microsoft'] },
  { title: 'Unique Paths', url: 'https://leetcode.com/problems/unique-paths/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Grid DP', phase: 'PHASE_3', order: 72, companyTags: ['Amazon', 'Google', 'Microsoft'] },
  { title: 'Word Break', url: 'https://leetcode.com/problems/word-break/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'String DP', phase: 'PHASE_3', order: 73, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Partition Equal Subset Sum', url: 'https://leetcode.com/problems/partition-equal-subset-sum/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: '0/1 Knapsack', phase: 'PHASE_3', order: 74, companyTags: ['Amazon', 'Google'] },
  { title: 'Decode Ways', url: 'https://leetcode.com/problems/decode-ways/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: '1D DP', phase: 'PHASE_3', order: 75, companyTags: ['Amazon', 'Meta'] },
  { title: 'Target Sum', url: 'https://leetcode.com/problems/target-sum/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: '0/1 Knapsack', phase: 'PHASE_3', order: 76, companyTags: ['Amazon', 'Google'] },
  { title: 'Best Time to Buy and Sell Stock with Cooldown', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'State Machine DP', phase: 'PHASE_3', order: 77, companyTags: ['Amazon', 'Google'] },
  { title: 'Edit Distance', url: 'https://leetcode.com/problems/edit-distance/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'String DP', phase: 'PHASE_3', order: 78, companyTags: ['Amazon', 'Google', 'Microsoft'] },
  { title: 'House Robber II', url: 'https://leetcode.com/problems/house-robber-ii/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: '1D DP Circular', phase: 'PHASE_3', order: 79, companyTags: ['Amazon'] },
  { title: 'House Robber III', url: 'https://leetcode.com/problems/house-robber-iii/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Tree DP', phase: 'PHASE_3', order: 80, companyTags: ['Amazon'] },
  { title: 'Longest Palindromic Substring', url: 'https://leetcode.com/problems/longest-palindromic-substring/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Palindrome DP', phase: 'PHASE_3', order: 81, companyTags: ['Amazon', 'Google', 'Microsoft'] },
  { title: 'Palindromic Substrings', url: 'https://leetcode.com/problems/palindromic-substrings/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Palindrome DP', phase: 'PHASE_3', order: 82, companyTags: ['Amazon', 'Google'] },
  { title: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Kadane Variant', phase: 'PHASE_3', order: 83, companyTags: ['Amazon', 'Google', 'Microsoft'] },
  { title: 'Combination Sum IV', url: 'https://leetcode.com/problems/combination-sum-iv/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Unbounded Knapsack', phase: 'PHASE_3', order: 84, companyTags: ['Amazon', 'Google'] },
  { title: 'Perfect Squares', url: 'https://leetcode.com/problems/perfect-squares/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Unbounded Knapsack', phase: 'PHASE_3', order: 85, companyTags: ['Amazon', 'Google'] },
  { title: 'Integer Break', url: 'https://leetcode.com/problems/integer-break/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: '1D DP', phase: 'PHASE_3', order: 86 },
  { title: 'Unique Paths II', url: 'https://leetcode.com/problems/unique-paths-ii/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Grid DP', phase: 'PHASE_3', order: 87, companyTags: ['Amazon', 'Google'] },
  { title: 'Minimum Path Sum', url: 'https://leetcode.com/problems/minimum-path-sum/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Grid DP', phase: 'PHASE_3', order: 88, companyTags: ['Amazon', 'Google'] },
  { title: 'Last Stone Weight II', url: 'https://leetcode.com/problems/last-stone-weight-ii/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: '0/1 Knapsack', phase: 'PHASE_3', order: 89 },
  { title: 'Coin Change II', url: 'https://leetcode.com/problems/coin-change-ii/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Unbounded Knapsack', phase: 'PHASE_3', order: 90, companyTags: ['Amazon', 'Google'] },
  { title: 'Interleaving String', url: 'https://leetcode.com/problems/interleaving-string/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: '2D DP', phase: 'PHASE_3', order: 91, companyTags: ['Amazon', 'Google'] },
  { title: 'Stone Game', url: 'https://leetcode.com/problems/stone-game/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Game Theory DP', phase: 'PHASE_3', order: 92 },
  { title: 'Stone Game II', url: 'https://leetcode.com/problems/stone-game-ii/', difficulty: 'MEDIUM', topic: 'Dynamic Programming', subtopic: 'Game Theory DP', phase: 'PHASE_3', order: 93 },
  { title: 'Burst Balloons', url: 'https://leetcode.com/problems/burst-balloons/', difficulty: 'HARD', topic: 'Dynamic Programming', subtopic: 'Interval DP', phase: 'PHASE_3', order: 94, companyTags: ['Google'] },
  { title: 'Regular Expression Matching', url: 'https://leetcode.com/problems/regular-expression-matching/', difficulty: 'HARD', topic: 'Dynamic Programming', subtopic: 'String DP', phase: 'PHASE_3', order: 95, companyTags: ['Google', 'Meta'] },
  { title: 'Distinct Subsequences', url: 'https://leetcode.com/problems/distinct-subsequences/', difficulty: 'HARD', topic: 'Dynamic Programming', subtopic: 'String DP', phase: 'PHASE_3', order: 96, companyTags: ['Amazon', 'Google'] },
  { title: 'Shortest Path Visiting All Nodes', url: 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/', difficulty: 'HARD', topic: 'Dynamic Programming', subtopic: 'Bitmask DP + BFS', phase: 'PHASE_3', order: 97, companyTags: ['Google'] },
  { title: 'Stone Game III', url: 'https://leetcode.com/problems/stone-game-iii/', difficulty: 'HARD', topic: 'Dynamic Programming', subtopic: 'Game Theory DP', phase: 'PHASE_3', order: 98 },
  { title: 'Longest Increasing Path in a Matrix', url: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/', difficulty: 'HARD', topic: 'Dynamic Programming', subtopic: 'Memoization DFS', phase: 'PHASE_3', order: 99, companyTags: ['Google', 'Amazon'] },

  // ─────────────────────────────────────────────
  // PHASE 4 — Long Tail
  // ─────────────────────────────────────────────

  // Trie
  { title: 'Implement Trie (Prefix Tree)', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', difficulty: 'MEDIUM', topic: 'Trie', subtopic: 'Design', phase: 'PHASE_4', order: 1, companyTags: ['Amazon', 'Google', 'Microsoft'] },
  { title: 'Design Add and Search Words Data Structure', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', difficulty: 'MEDIUM', topic: 'Trie', subtopic: 'Wildcard DFS', phase: 'PHASE_4', order: 2, companyTags: ['Meta'] },
  { title: 'Replace Words', url: 'https://leetcode.com/problems/replace-words/', difficulty: 'MEDIUM', topic: 'Trie', subtopic: 'Prefix Matching', phase: 'PHASE_4', order: 3 },
  { title: 'Map Sum Pairs', url: 'https://leetcode.com/problems/map-sum-pairs/', difficulty: 'MEDIUM', topic: 'Trie', subtopic: 'Prefix Sum', phase: 'PHASE_4', order: 4 },
  { title: 'Maximum XOR of Two Numbers in an Array', url: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/', difficulty: 'MEDIUM', topic: 'Trie', subtopic: 'Bit Trie', phase: 'PHASE_4', order: 5, companyTags: ['Google'] },
  { title: 'Extra Characters in a String', url: 'https://leetcode.com/problems/extra-characters-in-a-string/', difficulty: 'MEDIUM', topic: 'Trie', subtopic: 'Trie + DP', phase: 'PHASE_4', order: 6 },
  { title: 'Concatenated Words', url: 'https://leetcode.com/problems/concatenated-words/', difficulty: 'HARD', topic: 'Trie', subtopic: 'Trie + DP', phase: 'PHASE_4', order: 7, companyTags: ['Google'] },

  // Shortest Path
  { title: 'Network Delay Time', url: 'https://leetcode.com/problems/network-delay-time/', difficulty: 'MEDIUM', topic: 'Shortest Path', subtopic: 'Dijkstra', phase: 'PHASE_4', order: 8, companyTags: ['Amazon', 'Google'] },
  { title: 'Cheapest Flights Within K Stops', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', difficulty: 'MEDIUM', topic: 'Shortest Path', subtopic: 'Bellman-Ford / Dijkstra', phase: 'PHASE_4', order: 9, companyTags: ['Amazon', 'Google'] },
  { title: 'Path with Minimum Effort', url: 'https://leetcode.com/problems/path-with-minimum-effort/', difficulty: 'MEDIUM', topic: 'Shortest Path', subtopic: 'Dijkstra / Binary Search', phase: 'PHASE_4', order: 10 },
  { title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', url: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/', difficulty: 'MEDIUM', topic: 'Shortest Path', subtopic: 'Floyd-Warshall', phase: 'PHASE_4', order: 11 },
  { title: 'Course Schedule IV', url: 'https://leetcode.com/problems/course-schedule-iv/', difficulty: 'MEDIUM', topic: 'Shortest Path', subtopic: 'Transitive Closure', phase: 'PHASE_4', order: 12 },
  { title: 'Evaluate Division', url: 'https://leetcode.com/problems/evaluate-division/', difficulty: 'MEDIUM', topic: 'Shortest Path', subtopic: 'Weighted Graph BFS', phase: 'PHASE_4', order: 13, companyTags: ['Amazon', 'Google'] },
  { title: 'Swim in Rising Water', url: 'https://leetcode.com/problems/swim-in-rising-water/', difficulty: 'HARD', topic: 'Shortest Path', subtopic: 'Dijkstra / Binary Search', phase: 'PHASE_4', order: 14, companyTags: ['Google'] },
  { title: 'Minimum Cost to Make at Least One Valid Path in a Grid', url: 'https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/', difficulty: 'HARD', topic: 'Shortest Path', subtopic: '0-1 BFS', phase: 'PHASE_4', order: 15 },

  // Bit Manipulation
  { title: 'Single Number', url: 'https://leetcode.com/problems/single-number/', difficulty: 'EASY', topic: 'Bit Manipulation', subtopic: 'XOR', phase: 'PHASE_4', order: 16, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Number of 1 Bits', url: 'https://leetcode.com/problems/number-of-1-bits/', difficulty: 'EASY', topic: 'Bit Manipulation', subtopic: 'Bit Count', phase: 'PHASE_4', order: 17, companyTags: ['Apple', 'Google'] },
  { title: 'Counting Bits', url: 'https://leetcode.com/problems/counting-bits/', difficulty: 'EASY', topic: 'Bit Manipulation', subtopic: 'DP + Bits', phase: 'PHASE_4', order: 18 },
  { title: 'Missing Number', url: 'https://leetcode.com/problems/missing-number/', difficulty: 'EASY', topic: 'Bit Manipulation', subtopic: 'XOR / Math', phase: 'PHASE_4', order: 19, companyTags: ['Amazon', 'Google', 'Microsoft'] },
  { title: 'Add Binary', url: 'https://leetcode.com/problems/add-binary/', difficulty: 'EASY', topic: 'Bit Manipulation', subtopic: 'Binary Addition', phase: 'PHASE_4', order: 20, companyTags: ['Amazon', 'Google'] },
  { title: 'Reverse Bits', url: 'https://leetcode.com/problems/reverse-bits/', difficulty: 'EASY', topic: 'Bit Manipulation', subtopic: 'Bit Reversal', phase: 'PHASE_4', order: 21, companyTags: ['Apple', 'Google'] },
  { title: 'Single Number II', url: 'https://leetcode.com/problems/single-number-ii/', difficulty: 'MEDIUM', topic: 'Bit Manipulation', subtopic: 'Bit Counting', phase: 'PHASE_4', order: 22 },
  { title: 'Single Number III', url: 'https://leetcode.com/problems/single-number-iii/', difficulty: 'MEDIUM', topic: 'Bit Manipulation', subtopic: 'XOR', phase: 'PHASE_4', order: 23 },
  { title: 'Sum of Two Integers', url: 'https://leetcode.com/problems/sum-of-two-integers/', difficulty: 'MEDIUM', topic: 'Bit Manipulation', subtopic: 'Bit Adder', phase: 'PHASE_4', order: 24, companyTags: ['Amazon', 'Google', 'Meta'] },
  { title: 'Reverse Integer', url: 'https://leetcode.com/problems/reverse-integer/', difficulty: 'MEDIUM', topic: 'Bit Manipulation', subtopic: 'Math', phase: 'PHASE_4', order: 25, companyTags: ['Amazon', 'Google'] },
  { title: 'Bitwise AND of Numbers Range', url: 'https://leetcode.com/problems/bitwise-and-of-numbers-range/', difficulty: 'MEDIUM', topic: 'Bit Manipulation', subtopic: 'Common Prefix', phase: 'PHASE_4', order: 26 },
  { title: 'Minimum Array End', url: 'https://leetcode.com/problems/minimum-array-end/', difficulty: 'MEDIUM', topic: 'Bit Manipulation', subtopic: 'Bit Construction', phase: 'PHASE_4', order: 27 },

  // Range Query
  { title: 'Range Sum Query - Mutable', url: 'https://leetcode.com/problems/range-sum-query-mutable/', difficulty: 'MEDIUM', topic: 'Range Query', subtopic: 'Fenwick Tree / Segment Tree', phase: 'PHASE_4', order: 28, companyTags: ['Amazon', 'Google'] },

  // Meet in the Middle
  { title: '4Sum II', url: 'https://leetcode.com/problems/4sum-ii/', difficulty: 'MEDIUM', topic: 'Meet in the Middle', subtopic: 'HashMap', phase: 'PHASE_4', order: 29, companyTags: ['Amazon', 'Google'] },
  { title: 'Partition Array Into Two Arrays to Minimize Sum Difference', url: 'https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/', difficulty: 'HARD', topic: 'Meet in the Middle', subtopic: 'Subset Sum + Binary Search', phase: 'PHASE_4', order: 30 },
  { title: 'Closest Subsequence Sum', url: 'https://leetcode.com/problems/closest-subsequence-sum/', difficulty: 'HARD', topic: 'Meet in the Middle', subtopic: 'Subset Enumeration', phase: 'PHASE_4', order: 31 },
];

async function main() {
  console.log('🌱 Seeding DSA Tracker database...');

  // Upsert all problems — safe to run multiple times
  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { url: problem.url },
      update: {
        title: problem.title,
        difficulty: problem.difficulty,
        topic: problem.topic,
        subtopic: problem.subtopic,
        companyTags: problem.companyTags ?? [],
        phase: problem.phase,
        order: problem.order,
      },
      create: {
        title: problem.title,
        url: problem.url,
        difficulty: problem.difficulty,
        topic: problem.topic,
        subtopic: problem.subtopic,
        companyTags: problem.companyTags ?? [],
        phase: problem.phase,
        order: problem.order,
      },
    });
  }

  const total = await prisma.problem.count();
  console.log(`✅ Seeded ${total} problems successfully.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
