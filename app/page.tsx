'use client';

import { useEffect, useState } from 'react';
import { DailyFactResponse } from '@/types/fact';

export default function Home() {
  const [dailyFact, setDailyFact] = useState<DailyFactResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyFact = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/daily-fact');
        if (!response.ok) {
          throw new Error(`Failed to fetch daily fact: ${response.status}`);
        }

        const data: DailyFactResponse = await response.json();
        setDailyFact(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching daily fact:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyFact();
  }, []);

  const getResponsiveFontSize = (textLength: number): string => {
    if (textLength < 50) return 'text-5xl';
    if (textLength < 100) return 'text-4xl';
    if (textLength < 150) return 'text-3xl';
    if (textLength < 200) return 'text-2xl';
    return 'text-xl';
  };

  const toTitleCase = (value: string): string =>
    value
      .split(' ')
      .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : ''))
      .join(' ');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-white">Loading today's fact...</p>
        </div>
      </div>
    );
  }

  if (error || !dailyFact) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-red-400 font-semibold">Error</p>
          <p className="text-white mt-2">{error || 'Failed to load the daily fact.'}</p>
        </div>
      </div>
    );
  }

  const { fact, date } = dailyFact;
  const fontSize = getResponsiveFontSize(fact.text.length);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background Image with Blur Fallback */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${fact.imageUrl})`,
        }}
      >
        {/* Blur overlay for background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${fact.imageUrl})`,
            filter: 'blur(40px)',
            transform: 'scale(1.1)',
          }}
        />
      </div>

      {/* Main Image */}
      {fact.imageUrl && (
        <img
          src={fact.imageUrl}
          alt={fact.text}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Bottom Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <p className={`text-white font-semibold leading-tight drop-shadow-2xl ${fontSize} mb-6`}>
            {fact.text}
          </p>
          <div className="flex items-center gap-4">
            <span className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium">
              {toTitleCase(fact.category)}
            </span>
            <span className="text-white text-sm font-medium">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
