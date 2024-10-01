"use client";
import React, { useLayoutEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import DraggableColumns from '../components/DraggableColumns';


const Home = () => {
    const [inputCols, setInputCols] = useState(() => {
        const savedColumnCount = localStorage.getItem('numColumns');
        return savedColumnCount ? Number(savedColumnCount) : 3; // Default to 3
    });
    const [inputValue, setInputValue] = useState(String(inputCols)); // Default input value matches the number of columns

    // Update columns in local storage on input change
    useLayoutEffect(() => {
        localStorage.setItem('numColumns', String(inputCols));
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
        <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '16px' }}>
            <TextField
                label="Number of Columns"
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                inputProps={{ min: 1, max: 4 }} // Set min/max attributes
                variant="outlined"
                style={{ marginRight: '8px' }} // Add some space to the right
            />
            <Button 
                variant="contained" 
                onClick={handleColumnChange} 
                disabled={inputValue === ''} // Disable button if input is empty
            >
                Update Columns
            </Button>
            <DraggableColumns cols={inputCols} />
        </div>
    );
};

export default Home;