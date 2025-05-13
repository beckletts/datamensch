import Papa from 'papaparse';
import { loadStoryLaneData } from './storylaneDataProcessor.js';
import { parseDate } from './dateHelpers.js';

// Column mapping for LMS data
const COLUMN_MAP = {
    // English column names
    'Course': 'course',
    'Enrollment Date (UTC TimeZone)': 'enrollmentDate',
    'Started Date (UTC TimeZone)': 'startedDate',
    'Completion Date (UTC TimeZone)': 'completionDate',
    'Status': 'status',
    'Progress %': 'progressPercentage',
    'Time Spent(minutes)': 'timeSpentMinutes',
    'Quiz_score': 'quizScore',
    'Centre Number': 'centreNumber',
    'Centre Country': 'centreCountry',
    
    // Alternate column names that might be present
    'course': 'course',
    'enrollment_date': 'enrollmentDate',
    'started_date': 'startedDate',
    'completion_date': 'completionDate',
    'status': 'status',
    'progress': 'progressPercentage',
    'time_spent': 'timeSpentMinutes',
    'quiz_score': 'quizScore',
    'centre_number': 'centreNumber',
    'centre_country': 'centreCountry'
};

// Process LMS data
const processLMSData = (rawData) => {
    if (!rawData || rawData.length === 0) {
        console.error('No data to process');
        return [];
    }
    
    // Normalize the data (map column headers)
    const normalizeData = (rawData) => {
        if (!rawData.length) return [];
        
        const firstRow = rawData[0];
        const availableColumns = Object.keys(firstRow);
        
        console.log('Available columns:', availableColumns);
        
        // Create a mapping for this specific CSV format
        const columnMapping = {};
        for (const column of availableColumns) {
            const normalizedColumn = COLUMN_MAP[column];
            if (normalizedColumn) {
                columnMapping[column] = normalizedColumn;
            }
        }
        
        // Map each row to the normalized format
        return rawData.map(row => {
            const normalizedRow = {};
            
            for (const [originalColumn, value] of Object.entries(row)) {
                const normalizedColumn = columnMapping[originalColumn];
                if (normalizedColumn) {
                    normalizedRow[normalizedColumn] = value;
                }
            }
            
            return normalizedRow;
        });
    };
    
    // Normalize the data
    const normalizedData = normalizeData(rawData);
    
    // Process the normalized data to match TrainingRecord interface
    const processedData = normalizedData
        .filter((row) => row.course) // Filter out empty rows
        .map((row) => ({
            course: row.course || '',
            enrollmentDate: parseDate(row.enrollmentDate) || new Date(),
            startedDate: parseDate(row.startedDate),
            completionDate: parseDate(row.completionDate),
            status: (row.status || 'Not Started'),
            progressPercentage: parseFloat(row.progressPercentage || '0'),
            timeSpentMinutes: parseInt(row.timeSpentMinutes || '0', 10),
            quizScore: row.quizScore ? parseFloat(row.quizScore) : null,
            centreNumber: row.centreNumber || '',
            centreCountry: row.centreCountry || ''
        }));
    
    return processedData;
};

// Load LMS data
export const loadLMSData = async () => {
    try {
        const response = await fetch('/data for cursor.csv');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const csvText = await response.text();
        
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    try {
                        if (results.errors && results.errors.length > 0) {
                            console.error('LMS data parse errors:', results.errors);
                            reject(`Error parsing LMS data: ${results.errors[0].message}`);
                            return;
                        }
                        
                        const processedData = processLMSData(results.data);
                        console.log('Processed LMS data:', processedData.length, 'records');
                        resolve(processedData);
                    } catch (err) {
                        console.error('Error processing LMS data:', err);
                        reject(`Error processing LMS data: ${err.message}`);
                    }
                },
                error: (error) => {
                    console.error('Error parsing LMS CSV:', error);
                    reject(`Error loading LMS data: ${error.message}`);
                }
            });
        });
    } catch (err) {
        console.error('Error fetching LMS data:', err);
        throw err;
    }
};

// Load all data for the application
export const loadAllData = async () => {
    try {
        // Load both datasets in parallel
        const [lmsData, storylaneData] = await Promise.all([
            loadLMSData(),
            loadStoryLaneData()
        ]);
        
        console.log(`Data loaded: ${lmsData.length} LMS records, ${storylaneData.length} Storylane records`);
        
        return {
            lmsData,
            storylaneData
        };
    } catch (error) {
        console.error('Error loading application data:', error);
        return {
            lmsData: [],
            storylaneData: []
        };
    }
}; 