import { useState } from 'react'
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { FileUpload } from './components/FileUpload'
import { Dashboard } from './components/Dashboard'
import { TrainingRecord } from './types/TrainingData'

const theme = createTheme({
    palette: {
        mode: 'light',
    },
})

function App() {
    const [trainingData, setTrainingData] = useState<TrainingRecord[]>([])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <FileUpload onDataLoaded={setTrainingData} />
                {trainingData.length > 0 && <Dashboard data={trainingData} />}
            </Container>
        </ThemeProvider>
    )
}

export default App
