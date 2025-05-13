// First approach - standard comma parsing
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
            
            // Create record object
            const record = {
                demo: parts[0],
                link: parts[1],
                lastView: parts[2],
                totalTime: parts[3],
                stepsCompleted: parseInt(parts[4], 10) || 0,
                percentComplete: parseFloat(parts[5]) || 0,
                openedCTA: parts[6],
                country: country
            };
            
            // Add to records array
            records.push(record);
        }
    }
    
    console.log("Found", records.length, "records");
    return records;
};

// Standard comma-delimited parsing
function parseCommaDelimited(csvContent) {
    // Normalize line endings
    const normalizedContent = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    
    // Split the content into lines
    const lines = normalizedContent.split("\n");
    console.log("Total lines in CSV:", lines.length);
    
    if (lines.length <= 1) {
        console.error("CSV has too few lines:", lines.length);
        console.log("First line:", lines[0]);
        return [];
    }
    
    // Log the header
    console.log("CSV Header:", lines[0]);
    
    // Skip header row
    const records = [];
    let validLines = 0;
    let invalidLines = 0;
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split by comma
        const values = line.split(",");
        
        // Check if we have enough columns
        if (values.length >= 8) {
            try {
                // For country names with commas
                let country = values[7];
                
                // If there are more parts, concatenate them for the country
                if (values.length > 8) {
                    for (let j = 8; j < values.length; j++) {
                        country += ',' + values[j];
                    }
                }
                
                const record = {
                    demo: values[0],
                    link: values[1],
                    lastView: values[2],
                    totalTime: values[3],
                    stepsCompleted: parseInt(values[4], 10) || 0,
                    percentComplete: parseFloat(values[5]) || 0,
                    openedCTA: values[6],
                    country: country
                };
                
                records.push(record);
                validLines++;
            } catch (error) {
                console.error(`Error parsing line ${i}:`, error);
                invalidLines++;
            }
        } else {
            invalidLines++;
        }
    }
    
    console.log(`Comma-delimited parsing: ${validLines} valid lines, ${invalidLines} invalid lines`);
    return records;
}

// Tab-delimited parsing
function parseTabDelimited(csvContent) {
    const normalizedContent = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = normalizedContent.split("\n");
    
    if (lines.length <= 1) return [];
    
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split("\t");
        
        if (values.length >= 8) {
            try {
                records.push({
                    demo: values[0],
                    link: values[1],
                    lastView: values[2],
                    totalTime: values[3],
                    stepsCompleted: parseInt(values[4], 10) || 0,
                    percentComplete: parseFloat(values[5]) || 0,
                    openedCTA: values[6],
                    country: values[7]
                });
            } catch (error) {
                console.error(`Error parsing tab-delimited line ${i}:`, error);
            }
        }
    }
    
    console.log(`Tab-delimited parsing: ${records.length} records found`);
    return records;
}

// Semicolon-delimited parsing
function parseSemicolonDelimited(csvContent) {
    const normalizedContent = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = normalizedContent.split("\n");
    
    if (lines.length <= 1) return [];
    
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(";");
        
        if (values.length >= 8) {
            try {
                records.push({
                    demo: values[0],
                    link: values[1],
                    lastView: values[2],
                    totalTime: values[3],
                    stepsCompleted: parseInt(values[4], 10) || 0,
                    percentComplete: parseFloat(values[5]) || 0,
                    openedCTA: values[6],
                    country: values[7]
                });
            } catch (error) {
                console.error(`Error parsing semicolon-delimited line ${i}:`, error);
            }
        }
    }
    
    console.log(`Semicolon-delimited parsing: ${records.length} records found`);
    return records;
}

// Flexible parsing - try to determine structure based on content
function parseFlexible(csvContent) {
    console.log("Using flexible parsing as last resort");
    
    // Try to detect if this is CSV data at all
    if (!csvContent.includes(',') && !csvContent.includes('\t') && !csvContent.includes(';')) {
        console.error("Content doesn't appear to be CSV format");
        return [];
    }
    
    const normalizedContent = csvContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const lines = normalizedContent.split("\n");
    
    if (lines.length <= 1) return [];
    
    // Examine first line to determine likely header names
    const headerLine = lines[0].toLowerCase();
    const hasDemo = headerLine.includes('demo');
    const hasLink = headerLine.includes('link');
    const hasLastView = headerLine.includes('last view') || headerLine.includes('lastview');
    const hasTotalTime = headerLine.includes('total time') || headerLine.includes('totaltime');
    const hasSteps = headerLine.includes('steps');
    const hasPercent = headerLine.includes('percent');
    const hasCTA = headerLine.includes('cta');
    const hasCountry = headerLine.includes('country');
    
    console.log("Header detection:", { 
        hasDemo, hasLink, hasLastView, hasTotalTime, 
        hasSteps, hasPercent, hasCTA, hasCountry 
    });
    
    // If headers look right, try one more parsing approach
    if (hasDemo && hasLastView && hasSteps) {
        console.log("Headers look like StoryLane format, trying one more parsing approach");
        
        // Try to parse without assuming delimiter
        const records = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.length < 10) continue;
            
            try {
                // Try to extract parts based on content patterns rather than delimiters
                const demoEnd = line.indexOf(',', 0);
                if (demoEnd <= 0) continue;
                
                const demo = line.substring(0, demoEnd).trim();
                
                // We'll make a simplification and just look for known patterns
                // This is a last resort approach
                const stepsMatch = line.match(/(\d+)\s*,\s*([\d\.]+)/);
                const countryMatch = /(United Kingdom|United Arab Emirates|China|Ireland)/i;
                
                if (demo && stepsMatch && countryMatch.test(line)) {
                    records.push({
                        demo: demo,
                        link: 'unknown',
                        lastView: 'unknown',
                        totalTime: 'unknown',
                        stepsCompleted: parseInt(stepsMatch[1], 10) || 0,
                        percentComplete: parseFloat(stepsMatch[2]) || 0,
                        openedCTA: 'unknown',
                        country: line.match(countryMatch)[0] || 'unknown'
                    });
                }
            } catch (error) {
                console.error(`Error in flexible parsing, line ${i}:`, error);
            }
        }
        
        console.log(`Flexible parsing: ${records.length} records found`);
        return records;
    }
    
    return [];
} 