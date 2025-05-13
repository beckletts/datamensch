// Parse a date string from various formats
export const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // Remove any extra whitespace
    const cleanDateString = dateString.trim();
    
    // If the string is empty after trimming, return null
    if (!cleanDateString) return null;
    
    // Format: "M/D/YY H:MM" (e.g. "5/7/24 13:25")
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}\s+\d{1,2}:\d{2}$/.test(cleanDateString)) {
        const [datePart, timePart] = cleanDateString.split(' ');
        const [month, day, year] = datePart.split('/');
        const [hour, minute] = timePart.split(':');
        
        // Convert 2-digit year to 4-digit (assuming 20xx)
        const fullYear = year.length === 2 ? `20${year}` : year;
        
        return new Date(Number(fullYear), Number(month) - 1, Number(day), Number(hour), Number(minute));
    }
    
    // Try built-in Date parsing as a fallback
    const parsedDate = new Date(cleanDateString);
    
    // Check if the date is valid
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }
    
    // If we got here, we couldn't parse the date
    console.warn(`Could not parse date: ${dateString}`);
    return null;
}; 