"use client";
import React, { useLayoutEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import DraggableColumns from '../components/DraggableColumns';


const Home = () => {
    const [inputCols, setInputCols] = useState(3); // Default to 3 columns
    const [inputValue, setInputValue] = useState(String(inputCols)); // Default input value matches the number of columns

    useLayoutEffect(() => {
        // This code will run only in the browser
        try {
            const savedColumnCount = localStorage.getItem('numColumns');
            if (savedColumnCount) {
                const numCols = Number(savedColumnCount);
                // Validate the retrieved value
                if (!isNaN(numCols) && numCols >= 1 && numCols <= 4) {
                    setInputCols(numCols);
                    setInputValue(savedColumnCount); // Update input value
                }
            }
        } catch (error) {
            console.error('Failed to access localStorage:', error);
            // If there's an error, we stay with the default value
        }
    }, []);

    // Update columns in local storage on input change
    useLayoutEffect(() => {
        try {
            localStorage.setItem('numColumns', String(inputCols));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }, [inputCols]);

    // Function to handle input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // Validate the input to be a number between 1 and 4
        if (!isNaN(Number(value)) && Number(value) >= 1 && Number(value) <= 4) {
            setInputValue(value);
        }
    };

    // Function to update columns based on input value
    const handleColumnChange = () => {
        const value = Number(inputValue);
        if (value >= 1 && value <= 4) {
            setInputCols(value); // Update inputCols
        }
    };


    return (
        <div style={{ alignItems: 'center', backgroundColor: 'white', minHeight: '100vh', padding: '16px', position: 'relative', display: 'inline-block', }}>
            <TextField
                label="Columns"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                inputProps={{ min: 1, max: 4 }} // Set min/max attributes
                variant="outlined"
                size="small" 
                style={{ marginBottom: '8px', marginLeft: '8px', marginRight: '8px', height: '40px', display: 'block' }}
            />
            <Button 
                variant="contained" 
                onClick={handleColumnChange} 
                disabled={inputValue === ''} // Disable button if input is empty
                style={{ height: '40px', display: 'block', position: 'absolute', top: '14px', left: '120px', }}
            >
                Update Columns
            </Button>
            <DraggableColumns cols={inputCols} />
        </div>
    );
};

export default Home;