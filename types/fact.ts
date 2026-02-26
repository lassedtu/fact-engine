export interface Fact {
    id: string;
    text: string;
    imageKeyword: string;
    category: string;
}

export interface DailyFactResponse {
    date: string;
    fact: {
        id: string;
        text: string;
        category: string;
        imageUrl: string;
    };
}

export interface PexelsImage {
    id: number;
    photographer: string;
    width: number;
    height: number;
    src: {
        original: string;
        large2x?: string;
        large: string;
        medium: string;
        small: string;
        portrait: string;
        landscape: string;
        tiny: string;
    };
}

export interface PexelsSearchResponse {
    page: number;
    per_page: number;
    photos: PexelsImage[];
    total_results: number;
    next_page: string;
}
