export interface FilterState {
    categories: string[];
    centres: string[];
    courses: string[];
    startDate: string;
    endDate: string;
    startMonth: string;
    endMonth: string;
    eLearningCourse: string | null;
    qualificationType: 'all' | 'vq' | 'gq';
} 