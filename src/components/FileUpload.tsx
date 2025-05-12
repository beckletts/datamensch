import { useState, ChangeEvent, useRef } from 'react';
import { Box, Button, CircularProgress, Paper, Typography, Link, Alert } from '@mui/material';
import Papa from 'papaparse';
import { TrainingRecord } from '../types/TrainingData';

interface FileUploadProps {
  onDataLoaded: (data: TrainingRecord[]) => void;
}

// Map of possible column header names to the standardized format
const COLUMN_MAP: Record<string, string> = {
  // Standard format (sample data)
  'course': 'course',
  'enrollmentDate': 'enrollmentDate',
  'startedDate': 'startedDate',
  'completionDate': 'completionDate',
  'status': 'status',
  'progressPercentage': 'progressPercentage',
  'timeSpentMinutes': 'timeSpentMinutes',
  'quizScore': 'quizScore',
  'centreNumber': 'centreNumber',
  'centreCountry': 'centreCountry',
  
  // Real data format
  'Course': 'course',
  'Enrollment Date (UTC TimeZone)': 'enrollmentDate',
  'Started Date (UTC TimeZone)': 'startedDate',
  'Completion Date (UTC TimeZone)': 'completionDate',
  'Status': 'status',
  'Progress %': 'progressPercentage',
  'Time Spent(minutes)': 'timeSpentMinutes',
  'Quiz Score': 'quizScore',
  'Quiz_score': 'quizScore',
  'Centre Number': 'centreNumber',
  'Centre Country': 'centreCountry'
};

export const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Helper function to parse dates in various formats
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr || dateStr.trim() === '') return null;
    
    // Try multiple date formats
    // Format: MM/DD/YY (e.g., 12/9/24)
    const mmddyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{2})(\s.*)?$/;
    if (mmddyyRegex.test(dateStr)) {
      const match = dateStr.match(mmddyyRegex);
      if (match) {
        const [, month, day, year] = match;
        // Assuming 20xx for year
        return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }
    
    // Standard ISO format (YYYY-MM-DD)
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
    
    // If we can't parse it, return null
    console.warn(`Could not parse date: ${dateStr}`);
    return null;
  };
  
  // Normalize the raw data by mapping column headers
  const normalizeData = (rawData: any[]): any[] => {
    // If empty array, return empty array
    if (!rawData.length) return [];
    
    // Get the first row to check available columns
    const firstRow = rawData[0];
    const availableColumns = Object.keys(firstRow);
    
    console.log('Available columns:', availableColumns);
    
    // Create a mapping for this specific CSV format
    const columnMapping: Record<string, string> = {};
    for (const column of availableColumns) {
      const normalizedColumn = COLUMN_MAP[column];
      if (normalizedColumn) {
        columnMapping[column] = normalizedColumn;
      }
    }
    
    console.log('Column mapping:', columnMapping);
    
    // Map each row to the normalized format
    return rawData.map(row => {
      const normalizedRow: Record<string, any> = {};
      
      for (const [originalColumn, value] of Object.entries(row)) {
        const normalizedColumn = columnMapping[originalColumn];
        if (normalizedColumn) {
          normalizedRow[normalizedColumn] = value;
        }
      }
      
      return normalizedRow;
    });
  };
  
  const processData = (rawData: any[]): TrainingRecord[] => {
    if (!rawData || rawData.length === 0) {
      console.error('No data to process');
      return [];
    }
    
    console.log('RAW DATA SAMPLE (first 3 rows):', rawData.slice(0, 3));
    console.log('Total rows in CSV:', rawData.length);
    
    // Normalize the data to have consistent column names
    const normalizedData = normalizeData(rawData);
    
    // Sample the normalized data
    console.log('NORMALIZED DATA SAMPLE (first 3 rows):', normalizedData.slice(0, 3));
    
    // Check for webinars in the raw data
    const rawWebinars = rawData.filter(row => {
      const course = row.course || row.Course || '';
      return course.toLowerCase().includes('webinar');
    });
    console.log('RAW WEBINARS COUNT:', rawWebinars.length);
    console.log('RAW WEBINAR EXAMPLES:', rawWebinars.slice(0, 3));
    
    // Process the normalized data to match our TrainingRecord interface
    const processedData: TrainingRecord[] = normalizedData
      .filter((row: any) => row.course) // Filter out empty rows
      .map((row: any) => ({
        course: row.course || '',
        enrollmentDate: parseDate(row.enrollmentDate) || new Date(),
        startedDate: parseDate(row.startedDate),
        completionDate: parseDate(row.completionDate),
        status: (row.status || 'Not Started') as 'Completed' | 'In Progress' | 'Not Started' | 'Unenrolled',
        progressPercentage: parseFloat(row.progressPercentage || '0'),
        timeSpentMinutes: parseInt(row.timeSpentMinutes || '0', 10),
        quizScore: row.quizScore ? parseFloat(row.quizScore) : null,
        centreNumber: row.centreNumber || '',
        centreCountry: row.centreCountry || ''
      }));
    
    // Count webinars in processed data
    const processedWebinars = processedData.filter(record => 
      record.course.toLowerCase().includes('webinar')
    );
    console.log('PROCESSED WEBINARS COUNT:', processedWebinars.length);
    console.log('PROCESSED WEBINAR EXAMPLES:', processedWebinars.slice(0, 3));
    
    return processedData;
  };
  
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError("No file selected");
      return;
    }
    
    console.log("File selected:", file.name, file.type, file.size);
    setIsLoading(true);
    setError(null);
    
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            console.log('Parsed data:', results);
            if (results.errors && results.errors.length > 0) {
              console.error('Parse errors:', results.errors);
              setError(`CSV parsing error: ${results.errors[0].message}`);
              setIsLoading(false);
              return;
            }
            
            if (!results.data || results.data.length === 0) {
              setError('No data found in CSV file');
              setIsLoading(false);
              return;
            }
            
            // Process the data using our processing function
            const processedData = processData(results.data);
            console.log('Processed data:', processedData);
            
            if (processedData.length === 0) {
              setError('No valid records found in the uploaded file');
              setIsLoading(false);
              return;
            }
            
            onDataLoaded(processedData);
            // Reset the file input so the same file can be selected again
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          } catch (err) {
            console.error('Error processing data:', err);
            setError(`Error processing data: ${err instanceof Error ? err.message : 'Unknown error'}`);
          } finally {
            setIsLoading(false);
          }
        },
        error: (error: Error) => {
          console.error('Error parsing CSV file:', error);
          setError(`Error parsing CSV file: ${error.message}`);
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };
  
  const loadSampleData = () => {
    setIsLoading(true);
    setError(null);
    
    fetch('/sample-data.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            try {
              if (results.errors && results.errors.length > 0) {
                console.error('Sample data parse errors:', results.errors);
                setError(`Error parsing sample data: ${results.errors[0].message}`);
                setIsLoading(false);
                return;
              }
              
              const processedData = processData(results.data);
              
              onDataLoaded(processedData);
            } catch (err) {
              console.error('Error processing sample data:', err);
              setError(`Error processing sample data: ${err instanceof Error ? err.message : 'Unknown error'}`);
            } finally {
              setIsLoading(false);
            }
          },
          error: (error: Error) => {
            console.error('Error parsing sample CSV:', error);
            setError(`Error loading sample data: ${error.message}`);
            setIsLoading(false);
          }
        });
      })
      .catch(err => {
        console.error('Error fetching sample data:', err);
        setError(`Error loading sample data file: ${err.message}`);
        setIsLoading(false);
      });
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Training Report Builder
      </Typography>
      <Typography variant="body1" paragraph>
        Upload your training data CSV file to generate reports and visualizations.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          id="csv-upload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="csv-upload">
          <Button
            variant="contained"
            component="span"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Upload CSV Data'}
          </Button>
        </label>
        
        <Button
          variant="outlined"
          onClick={loadSampleData}
          disabled={isLoading}
        >
          Use Sample Data
        </Button>
      </Box>
      
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Supports various CSV formats. <Link href="/sample-data.csv" target="_blank">View sample format</Link>
      </Typography>
    </Paper>
  );
}; 