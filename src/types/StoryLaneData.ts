export interface StoryLaneRecord {
    demo: string;
    link: string;
    lastView: string;
    totalTime: string;
    stepsCompleted: number;
    percentComplete: number;
    openedCTA: string;
    country: string;
}

export interface StoryLaneStats {
    avgStepsCompleted: number;
    avgPercentComplete: number;
    ctaClicks: number;
    totalViews: number;
    countriesBreakdown: { [country: string]: number };
}

export interface StoryLaneFilterOptions {
    month: string | null;
    demoType: string | null;
} 