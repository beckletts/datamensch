import { useState, useEffect } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme, CircularProgress, Box, Typography } from '@mui/material'
import Papa from 'papaparse'
import { FileUpload } from './components/FileUpload'
import { Dashboard } from './components/Dashboard'
import { TrainingRecord } from './types/TrainingData'

const theme = createTheme({
    palette: {
        mode: 'light',
    },
})

function App() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [trainingData, setTrainingData] = useState<TrainingRecord[]>([])

    // Function to parse dates in different formats
    const parseDate = (dateString: string | null | undefined) => {
        if (!dateString) return null;
        const cleanDateString = dateString.trim();
        if (!cleanDateString) return null;
        
        try {
            // Parse date and return a new Date object
            const date = new Date(cleanDateString);
            if (isNaN(date.getTime())) return null;
            return date;
        } catch (error) {
            console.warn(`Could not parse date: ${dateString}`);
            return null;
        }
    };

    // Load data automatically when the app starts
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                setError(null)
                
                // Load training data from CSV
                const response = await fetch('/data for cursor.csv')
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const csvText = await response.text()
                
                // Parse CSV
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.errors && results.errors.length > 0) {
                            console.error('Parse errors:', results.errors);
                            setError(`CSV parsing error: ${results.errors[0].message}`);
                            setLoading(false);
                            return;
                        }
                        
                        if (!results.data || results.data.length === 0) {
                            setError('No data found in CSV file');
                            setLoading(false);
                            return;
                        }
                        
                        // Process the raw data
                        const processedData = results.data
                            .filter((row: any) => row.Course) // Filter out empty rows
                            .map((row: any) => ({
                                course: row.Course || '',
                                enrollmentDate: parseDate(row['Enrollment Date (UTC TimeZone)']) || new Date(),
                                startedDate: parseDate(row['Started Date (UTC TimeZone)']),
                                completionDate: parseDate(row['Completion Date (UTC TimeZone)']),
                                status: (row.Status || 'Not Started') as 'Completed' | 'In Progress' | 'Not Started' | 'Unenrolled',
                                progressPercentage: parseFloat(row['Progress %'] || '0'),
                                timeSpentMinutes: parseInt(row['Time Spent(minutes)'] || '0', 10),
                                quizScore: row.Quiz_score ? parseFloat(row.Quiz_score) : null,
                                centreNumber: row['Centre Number'] || '',
                                centreCountry: row['Centre Country'] || ''
                            }));
                        
                        console.log(`Loaded ${processedData.length} training records`);
                        setTrainingData(processedData);
                        setLoading(false);
                    },
                    error: (error: Error) => {
                        console.error('Error parsing CSV file:', error);
                        setError(`Error parsing CSV file: ${error.message}`);
                        setLoading(false);
                    }
                });
            } catch (err) {
                console.error('Error loading data:', err)
                setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`)
                setLoading(false)
            }
        }
        
        loadData()
    }, [])
    
    // Handle manual data uploads if needed
    const handleTrainingDataLoaded = (data: TrainingRecord[]) => {
        setTrainingData(data)
    }

    if (loading) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="lg" sx={{ textAlign: 'center', py: 10 }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Loading training data...
                    </Typography>
                </Container>
            </ThemeProvider>
        )
    }

    if (error) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="lg" sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h5" color="error" gutterBottom>
                        Error Loading Data
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {error}
                    </Typography>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="body2">
                            You can still try to upload data manually:
                        </Typography>
                        <FileUpload onDataLoaded={handleTrainingDataLoaded} />
                    </Box>
                </Container>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                {trainingData.length === 0 ? (
                    <FileUpload onDataLoaded={handleTrainingDataLoaded} />
                ) : (
                    <>
                        <Dashboard data={trainingData} />
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="body2" color="text.secondary" align="center">
                                Data is loaded automatically. To load different data, use the upload button below:
                            </Typography>
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <FileUpload onDataLoaded={handleTrainingDataLoaded} />
                            </Box>
                        </Box>
                    </>
                )}
            </Container>
        </ThemeProvider>
    )
}

export default App 