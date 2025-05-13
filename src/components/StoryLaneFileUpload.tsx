import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { parseStoryLaneCSV } from '../utils/storylaneDataProcessor.js';

// Define the record type
interface StoryLaneRecord {
    demo: string;
    link: string;
    lastView: string;
    totalTime: string;
    stepsCompleted: number;
    percentComplete: number;
    openedCTA: string;
    country: string;
}

interface Props {
    onDataLoaded: (data: StoryLaneRecord[]) => void;
}

// Component for uploading StoryLane data
export const StoryLaneFileUpload: React.FC<Props> = ({ onDataLoaded }) => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        
        // Reset states
        setError(null);
        setSuccess(null);
        
        // Check file type
        if (!file.name.toLowerCase().endsWith('.csv')) {
            setError('Please upload a CSV file');
            return;
        }
        
        // Read the file
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                console.log("File content preview:", content.substring(0, 100));
                
                // Parse the CSV
                const data = parseStoryLaneCSV(content);
                
                if (data.length === 0) {
                    setError('No valid records found in the CSV file');
                    return;
                }
                
                setSuccess(`Successfully loaded ${data.length} records`);
                onDataLoaded(data);
            } catch (err) {
                console.error("Error processing file:", err);
                setError('Error processing the file. Please check the format.');
            }
        };
        
        reader.onerror = () => {
            setError('Error reading the file. Please try again.');
        };
        
        reader.readAsText(file);
    };
    
    // Load sample data function
    const loadSampleData = () => {
        fetch('/Storylane all.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load sample data');
                }
                return response.text();
            })
            .then(content => {
                const data = parseStoryLaneCSV(content);
                if (data.length === 0) {
                    setError('No valid records found in the sample data');
                } else {
                    setSuccess(`Successfully loaded ${data.length} sample records`);
                    onDataLoaded(data);
                }
            })
            .catch(error => {
                console.error("Error loading sample:", error);
                setError('Error loading sample data: ' + error.message);
            });
    };
    
    // Automatically load sample data when component mounts
    useEffect(() => {
        console.log('Automatically loading sample StoryLane data...');
        loadSampleData();
    }, []);
    
    return (
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                StoryLane Data Upload
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                    {success}
                </Alert>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload CSV
                    <input
                        type="file"
                        hidden
                        accept=".csv"
                        onChange={handleFileUpload}
                    />
                </Button>
                
                <Button 
                    variant="outlined"
                    onClick={loadSampleData}
                >
                    Use Sample Data
                </Button>
            </Box>
        </Paper>
    );
}; 