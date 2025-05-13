import { useState, useEffect } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme, CircularProgress, Box, Typography } from '@mui/material'
import { FileUpload } from './components/FileUpload'
import { Dashboard } from './components/Dashboard'
import { TrainingRecord } from './types/TrainingData'
import { loadLMSData, loadAllData } from './utils/dataLoader'

// Create theme outside of component to prevent recreation
const theme = createTheme({
    palette: {
        mode: 'light',
    },
    components: {
        MuiUseMediaQuery: {
            defaultProps: {
                noSsr: true
            }
        }
    }
})

function App() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [trainingData, setTrainingData] = useState<TrainingRecord[]>([])
    const [storylaneData, setStoryLaneData] = useState<any[]>([])

    // Load data automatically when the app starts
    useEffect(() => {
        let mounted = true;
        
        const loadData = async () => {
            if (!mounted) return;
            
            try {
                setLoading(true)
                setError(null)

                // Try to load all data (both LMS and Storylane)
                try {
                    const { lmsData, storylaneData } = await loadAllData()
                    if (!mounted) return;
                    setTrainingData(lmsData)
                    setStoryLaneData(storylaneData)
                    console.log(`Successfully loaded ${lmsData.length} LMS records and ${storylaneData.length} Storylane records`)
                } catch (allDataError) {
                    console.error('Error loading all data:', allDataError)
                    // Fallback to just loading LMS data
                    console.log('Falling back to loading only LMS data')
                    const lmsData = await loadLMSData()
                    if (!mounted) return;
                    setTrainingData(lmsData)
                    console.log(`Successfully loaded ${lmsData.length} LMS records`)
                }

                if (!mounted) return;
                setLoading(false)
            } catch (err) {
                console.error('Error loading data:', err)
                if (!mounted) return;
                setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`)
                setLoading(false)
            }
        }
        
        loadData()
        
        return () => {
            mounted = false;
        }
    }, [])
    
    // Handle manual data uploads if needed
    const handleTrainingDataLoaded = (data: TrainingRecord[]) => {
        setTrainingData(data)
    }

    const appContent = loading ? (
        <Container maxWidth="lg" sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                Loading training data...
            </Typography>
        </Container>
    ) : error ? (
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
    ) : (
        <Container maxWidth="lg">
            {trainingData.length === 0 ? (
                <FileUpload onDataLoaded={handleTrainingDataLoaded} />
            ) : (
                <>
                    <Dashboard data={trainingData} storylaneData={storylaneData} />
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
    )

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {appContent}
        </ThemeProvider>
    )
}

export default App
