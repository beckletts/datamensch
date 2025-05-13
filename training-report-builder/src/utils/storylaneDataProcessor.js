// Parse Storylane CSV data
export const parseStoryLaneCSV = (csv) => {
    console.log("CSV length:", csv.length);
    
    // Convert line endings and split into lines
    const lines = csv.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    console.log("Line count:", lines.length);
    
    // Create records
    const records = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split by comma
        const parts = line.split(",");
        
        // Need at least 8 parts for a valid record
        if (parts.length >= 8) {
            // Combine country parts (for "United Kingdom", "United Arab Emirates", etc.)
            const country = parts.slice(7).join(",");
            
            // Determine if CTA was clicked (true if contains a URL)
            const openedCTA = parts[6].trim();
            const ctaClicked = openedCTA !== '-' && openedCTA.includes('http');
            
            // Create record object
            const record = {
                demo: parts[0],
                link: parts[1],
                lastView: parts[2],
                totalTime: parts[3],
                stepsCompleted: parseInt(parts[4], 10) || 0,
                percentComplete: parseFloat(parts[5]) || 0,
                openedCTA: openedCTA,
                ctaClicked: ctaClicked,
                country: country
            };
            
            // Add to records array
            records.push(record);
        }
    }
    
    console.log("Found", records.length, "records");
    return records;
};

// Load Storylane data from the public folder
export const loadStoryLaneData = async () => {
    try {
        console.log("Looking for Storylane data in public folder...");
        const response = await fetch('/Storylane all.csv');
        
        if (!response.ok) {
            if (response.status === 404) {
                console.warn("Storylane data file 'Storylane all.csv' was not found in the public folder. To use Storylane analytics, please add this file.");
                return [];
            }
            throw new Error(`Failed to load Storylane data: ${response.status} ${response.statusText}`);
        }
        
        const content = await response.text();
        return parseStoryLaneCSV(content);
    } catch (error) {
        console.error("Error loading Storylane data:", error);
        return [];
    }
}; 