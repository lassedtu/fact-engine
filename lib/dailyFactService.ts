import { Fact } from '@/types/fact';
import { facts } from './facts';

// Fixed start date for deterministic selection
const START_DATE = new Date('2024-01-01');

/**
 * Seeded random number generator using the same seed always produces the same sequence.
 * This ensures that shuffle operations are deterministic and consistent.
 */
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * Fisher-Yates shuffle using a seed.
 * Returns a shuffled copy of the array based on the seed.
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
    const result = [...array];
    let rng = seed;

    for (let i = result.length - 1; i > 0; i--) {
        rng = (rng * 9301 + 49297) % 233280;
        const j = Math.floor(seededRandom(rng) * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

/**
 * Calculate the number of days since the START_DATE.
 */
function getDaysSinceStart(date: Date): number {
    const resetDate = new Date(date);
    resetDate.setHours(0, 0, 0, 0);
    const startDate = new Date(START_DATE);
    startDate.setHours(0, 0, 0, 0);
    const diffTime = resetDate.getTime() - startDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get the fact for a specific date.
 * Ensures deterministic selection and no consecutive days with same category.
 */
export function getDailyFact(date: Date, previousCategory?: string): Fact {
    const daysSinceStart = getDaysSinceStart(date);

    // Use days since start as seed for shuffle
    const cycleLength = facts.length;
    const cycleIndex = daysSinceStart % cycleLength;
    const cycleNumber = Math.floor(daysSinceStart / cycleLength);

    // Create seed from cycle
    const seed = cycleNumber * 1000 + 42;
    const shuffledFacts = seededShuffle(facts, seed);

    // Get the fact based on cycle index
    let fact = shuffledFacts[cycleIndex];

    // If previous category is provided, ensure we don't have consecutive categories
    if (previousCategory && fact.category === previousCategory) {
        // Try to find a different fact within the current cycle
        for (let i = 0; i < cycleLength; i++) {
            const nextIndex = (cycleIndex + i) % cycleLength;
            const candidateFact = shuffledFacts[nextIndex];
            if (candidateFact.category !== previousCategory) {
                fact = candidateFact;
                break;
            }
        }
    }

    return fact;
}

/**
 * Get the fact for today.
 */
export function getTodaysFact(): Fact {
    return getDailyFact(new Date());
}

/**
 * Get the fact for a specific date string (YYYY-MM-DD format).
 */
export function getDailyFactByDateString(dateString: string): Fact {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date string: ${dateString}`);
    }
    return getDailyFact(date);
}

/**
 * Get the formatted date string in YYYY-MM-DD format.
 */
export function getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
