import { NextRequest, NextResponse } from 'next/server';
import { getDailyFact, getFormattedDate } from '@/lib/dailyFactService';
import { getImageUrl } from '@/lib/pexels';
import { DailyFactResponse } from '@/types/fact';

/**
 * GET /api/daily-fact
 * Returns the daily fact with image URL.
 */
export async function GET(request: NextRequest): Promise<NextResponse<DailyFactResponse>> {
    try {
        const today = new Date();
        const fact = getDailyFact(today);
        const dateString = getFormattedDate(today);

        // Use the date as seed for deterministic image selection
        const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
        const imageUrl = await getImageUrl(fact.imageKeyword, daysSinceEpoch);

        const response: DailyFactResponse = {
            date: dateString,
            fact: {
                id: fact.id,
                text: fact.text,
                category: fact.category,
                imageUrl,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching daily fact:', error);

        return NextResponse.json(
            {
                date: new Date().toISOString().split('T')[0],
                fact: {
                    id: 'error',
                    text: 'Failed to load the daily fact. Please try again later.',
                    category: 'error',
                    imageUrl: '',
                },
            },
            { status: 500 }
        );
    }
}
