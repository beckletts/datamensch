export interface TrainingRecord {
    course: string;
    enrollmentDate: Date;
    startedDate: Date | null;
    completionDate: Date | null;
    status: 'Completed' | 'In Progress' | 'Not Started' | 'Unenrolled';
    progressPercentage: number;
    timeSpentMinutes: number;
    quizScore: number | null;
    centreNumber: string;
    centreCountry: string;
}

export interface AnalyticsData {
    completionRates: {
        liveWebinar: number;
        recording: number;
        eLearning: number;
    };
    geographicDistribution: {
        uk: number;
        international: number;
    };
    averageEngagement: {
        timeSpent: number;
        progressPercentage: number;
    };
}