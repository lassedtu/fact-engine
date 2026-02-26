import { PexelsSearchResponse, PexelsImage } from '@/types/fact';

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';
const MIN_IMAGE_WIDTH = 1920;
const MIN_IMAGE_HEIGHT = 1080;

if (!PEXELS_API_KEY) {
    console.warn('NEXT_PUBLIC_PEXELS_API_KEY is not set. Image fetching will fail.');
}

/**
 * Fetch images from Pexels API based on search keyword.
 */
async function searchImages(keyword: string, perPage: number = 15): Promise<PexelsImage[]> {
    if (!PEXELS_API_KEY) {
        throw new Error('Pexels API key is not configured');
    }

    try {
        const response = await fetch(
            `${PEXELS_API_URL}?query=${encodeURIComponent(keyword)}&per_page=${perPage}`,
            {
                headers: {
                    Authorization: PEXELS_API_KEY,
                },
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        );

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
        }

        const data: PexelsSearchResponse = await response.json();
        const photos = data.photos || [];
        const highQuality = photos.filter(
            (photo) => photo.width >= MIN_IMAGE_WIDTH && photo.height >= MIN_IMAGE_HEIGHT
        );

        // If no images meet the minimum threshold, fall back to all results.
        return highQuality.length > 0 ? highQuality : photos;
    } catch (error) {
        console.error('Failed to fetch images from Pexels:', error);
        throw error;
    }
}

/**
 * Get a deterministic image URL based on keyword and seed.
 * Uses seeded selection to ensure the same image is returned for the same keyword+seed combination.
 */
export async function getImageUrl(keyword: string, seed: number): Promise<string> {
    try {
        const images = await searchImages(keyword);

        if (images.length === 0) {
            // Fallback to a generic placeholder if no images found
            return `https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg`;
        }

        // Use seed to deterministically select an image
        const selectedIndex = seed % images.length;
        const selectedImage = images[selectedIndex];

        return selectedImage.src.large2x || selectedImage.src.original || selectedImage.src.large;
    } catch (error) {
        console.error(`Failed to get image for keyword "${keyword}":`, error);
        // Return a fallback image if fetch fails
        return `https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg`;
    }
}
