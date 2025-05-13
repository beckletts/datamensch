import { StoryLaneRecord, StoryLaneStats } from '../types/StoryLaneData';

export const parseStoryLaneCSV = (csvContent: string): StoryLaneRecord[] => {
    try {
        // Replace DOS line endings if present
        const normalizedContent = csvContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        
        // Split the content into lines
        const lines = normalizedContent.split('\n');
        
        if (lines.length <= 1) {
            console.error('CSV has too few lines:', lines.length);
            return [];
        }
        
        // Skip header row
        const records: StoryLaneRecord[] = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Split by comma
            // Note: This is a simplification that works for the given format
            // A more robust solution would handle quoted values with commas
            const values = line.split(',');
            
            // Check if we have enough columns
            if (values.length >= 8) {
                try {
                    // For the United Kingdom rows, values[7] will be "United" and values[8] will be "Kingdom"
                    // For United Arab Emirates, we'll have more parts
                    let country = values[7];
                    
                    // If there are more parts, concatenate them for the country
                    if (values.length > 8) {
                        for (let j = 8; j < values.length; j++) {
                            country += ',' + values[j];
                        }
                    }
                    
                    records.push({
                        demo: values[0],
                        link: values[1],
                        lastView: values[2],
                        totalTime: values[3],
                        stepsCompleted: parseInt(values[4], 10) || 0,
                        percentComplete: parseFloat(values[5]) || 0,
                        openedCTA: values[6],
                        country: country
                    });
                } catch (error) {
                    console.error(`Error parsing line ${i}:`, error);
                    console.error('Line content:', line);
                }
            }
        }
        
        console.log(`Successfully parsed ${records.length} records from CSV`);
        return records;
    } catch (error) {
        console.error('Error parsing CSV:', error);
        return [];
    }
};

export const getStoryLaneDemoStats = (
    data: StoryLaneRecord[], 
    demoName: string
): StoryLaneStats => {
    const demoRecords = data.filter(record => record.demo === demoName);
    
    if (demoRecords.length === 0) {
        return {
            avgStepsCompleted: 0,
            avgPercentComplete: 0,
            ctaClicks: 0,
            totalViews: 0,
            countriesBreakdown: {}
        };
    }
    
    const totalSteps = demoRecords.reduce((sum, record) => sum + record.stepsCompleted, 0);
    const totalPercent = demoRecords.reduce((sum, record) => sum + record.percentComplete, 0);
    
    // Count CTA clicks
    const ctaClicks = demoRecords.filter(record => 
        record.openedCTA && 
        record.openedCTA.trim() !== '-' && 
        record.openedCTA.trim() !== ''
    ).length;
    
    // Build country breakdown
    const countriesBreakdown: { [country: string]: number } = {};
    
    demoRecords.forEach(record => {
        const country = record.country.trim();
        if (country) {
            countriesBreakdown[country] = (countriesBreakdown[country] || 0) + 1;
        }
    });
    
    return {
        avgStepsCompleted: totalSteps / demoRecords.length,
        avgPercentComplete: totalPercent / demoRecords.length,
        ctaClicks,
        totalViews: demoRecords.length,
        countriesBreakdown
    };
};

export const filterStoryLaneData = (
    data: StoryLaneRecord[],
    month: string | null,
    demoType: string | null
): StoryLaneRecord[] => {
    return data.filter(record => {
        // Filter by month
        if (month) {
            try {
                // Format is "M/D/YY HH:MM" (e.g., "5/7/25 13:25")
                const dateParts = record.lastView.trim().split(' ')[0].split('/');
                if (dateParts.length === 3) {
                    // Convert YY to YYYY (assuming 20xx for simplicity)
                    const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
                    // Month is in position 0
                    const monthNum = parseInt(dateParts[0], 10);
                    // Format as YYYY-MM
                    const recordMonth = `${year}-${String(monthNum).padStart(2, '0')}`;
                    
                    if (recordMonth !== month) {
                        return false;
                    }
                }
            } catch (error) {
                console.error('Error parsing date:', record.lastView, error);
                // If date parsing fails, we'll skip this filter
            }
        }
        
        // Filter by demo type
        if (demoType && !record.demo.includes(demoType)) {
            return false;
        }
        
        return true;
    });
};

export const getAllDemoTypes = (data: StoryLaneRecord[]): string[] => {
    const demoSet = new Set<string>();
    
    data.forEach(record => {
        demoSet.add(record.demo);
    });
    
    return Array.from(demoSet).sort();
}; 