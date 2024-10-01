"use client";
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { DragDropContext, DropResult, DragUpdate, DragStart } from '@hello-pangea/dnd';
import Column from '../components/Column/Column';
import { Button, Badge } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import { CardProps } from '../components/Column/Column.types';

type ColumnsState = Record<string, CardProps[]>;

// Initial structure for columns with their respective cards
const createInitialColumns = (numColumns: number) => {
    const initialColumns: Record<string, any[]> = {};
    for (let i = 1; i <= numColumns; i++) {
      initialColumns[`column${i}`] = []; // Each column starts as an empty array
    }
    return initialColumns;
  };

// Adjust the columns based on the new number of cols
const adjustColumns = (savedColumns: Record<string, CardProps[]>, newCols: number) => {
    const adjustedColumns: Record<string, any[]> = {};
    const columnKeys = Object.keys(savedColumns);
  
    for (let i = 1; i <= newCols; i++) {
      if (columnKeys.includes(`column${i}`)) {
        // Preserve existing columns
        adjustedColumns[`column${i}`] = savedColumns[`column${i}`];
      } else {
        // Add new empty column
        adjustedColumns[`column${i}`] = [];
      }
    }
  
    return adjustedColumns;
  };

const DraggableColumn = ({ cols }: { cols: number }) => {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [destination, setDestination] = useState<any>(null);
    const [source, setSource] = useState<any>(null);

    // State to indicate if we're in the client
    const [isClient, setIsClient] = useState(false);

    // Load columns from local storage or create initial columns if none are found
    const [columns, setColumns] = useState<ColumnsState>(() => createInitialColumns(cols));

    useEffect(() => {
        // Check if we are on the client
        setIsClient(true);

        // Load columns from local storage
        try {
            const savedColumns = localStorage.getItem('columns');
            if (savedColumns) {
                setColumns(JSON.parse(savedColumns));
            }
        } catch (error) {
            console.error('Failed to load columns from localStorage:', error);
        }
    }, []);

    // Save columns to local storage
    useLayoutEffect(() => {
        if (isClient) {
            try {
                localStorage.setItem('columns', JSON.stringify(columns));
            } catch (error) {
                console.error('Failed to save columns to localStorage:', error);
            }
        }
    }, [columns, isClient]);

    // Adjust columns based on new cols prop
    useEffect(() => {
        if (isClient) {
            try {
                const savedColumns = localStorage.getItem('columns');
                if (savedColumns) {
                    const parsedColumns = JSON.parse(savedColumns);
                    const adjustedColumns = adjustColumns(parsedColumns, cols);
                    setColumns(adjustedColumns);
                } else {
                    setColumns(createInitialColumns(cols));
                }
            } catch (error) {
                console.error('Failed to adjust columns:', error);
                setColumns(createInitialColumns(cols));
            }
        }
    }, [cols, isClient]);
    
    const onDragStart = (start: DragStart) => {
        console.log('onDragStart: ', start);
        setDraggingId(start.draggableId);
        setSource(start.source);
    };

    const onDragEnd = (result: DropResult) => {
        console.log('onDragEnd: ', result);
        const { source, destination } = result;

        // Do nothing if dropped outside the list
        if (!destination) return;

        // Handle moving cards between columns or within the same column
        const sourceColumn = columns[source.droppableId as keyof typeof columns];
        const destinationColumn = columns[destination.droppableId as keyof typeof columns];
        const sourceCards = Array.from(sourceColumn);
        const [movedCard] = sourceCards.splice(source.index, 1);

        if (source.droppableId === destination.droppableId) {
            // Reorder within the same column
            console.log('onDragEnd: Reorder within the same column');
            sourceCards.splice(destination.index, 0, movedCard);
            setColumns((prev: ColumnsState) => ({
                ...prev,
                [source.droppableId]: sourceCards,
            }));
        } else {
            // Move to a different column
            console.log('onDragEnd: Move to a different column');
            const destinationCards = Array.from(destinationColumn);
            destinationCards.splice(destination.index, 0, movedCard);
            setColumns((prev: ColumnsState) => ({
                ...prev,
                [source.droppableId]: sourceCards,
                [destination.droppableId]: destinationCards,
            }));
        }
        resetDraggingState();
    };

    const resetDraggingState = () => {
        setDraggingId(null);
        setDestination(null);
        setSource(null);
    };
    
    const onDragUpdate = (update: DragUpdate) => {
        const { draggableId, destination: dest, source: src } = update;
        console.log('onDragUpdate:', update);
        setDraggingId(draggableId);
        setDestination(dest);
        setSource(src);
    };

    const addCard = (columnId: keyof typeof columns) => {
        console.log('addCard: ', columnId);
        const newCardId = uuidv4(); // Generate the new UUID
        const title = newCardId.slice(-5); // Get the last 5 characters of the UUID
        const newCard: CardProps = { 
            id: newCardId , 
            title: `id: ${title}`, 
            content: `New Card in ${columnId}`, 
            index: columns[columnId].length,
            onDelete: (id: string) => deleteCard(columnId, id)}
        setColumns((prev) => ({
            ...prev,
            [columnId]: [...prev[columnId], newCard],
        }));
    };

    // Function to delete a card
    const deleteCard = (columnId: keyof typeof columns, cardId: string) => {
        setColumns((prev) => {
            const columnCards = prev[columnId].filter(card => card.id !== cardId);
            return {
                ...prev,
                [columnId]: columnCards,
            };
        });
    };

    const resetColumns = () => {
        setColumns(createInitialColumns(cols));
    };

    return (
        <>
            <div style={{ position: 'relative', display: 'inline-block' }}> {/* Set relative positioning for the container */}
                    <Button 
                        variant="contained" 
                        color="error" // Change to alert or warning color
                        onClick={resetColumns} 
                        style={{ right: 0, position: 'absolute', top: '-49px', height: '40px', }}
                    >
                        Reset Columns
                    </Button>
                <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} onDragStart={onDragStart}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        {Object.entries(columns).map(([columnId, columnCards]) => (
                            <div key={columnId}>
                                <div style={{ textAlign: 'center' }}>
                                    <Button 
                                        variant="outlined" 
                                        onClick={() => addCard(columnId as keyof typeof columns)}
                                        color="success"
                                        sx={{ width: '95%' }}
                                        startIcon={
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '36px', 
                                                height: '36px',
                                                borderRadius: '50%',
                                                border: '2px solid white', 
                                                backgroundColor: 'green',
                                                color: 'white',
                                                marginRight: '8px'
                                            }}>
                                                <AddIcon />
                                            </div>
                                        }>

                                        Add Card to {columnId}
                                    </Button>
                                </div>
                                <Column 
                                    cards={columnCards} 
                                    columnId={columnId} 
                                    draggingId={draggingId} 
                                    destination={destination} 
                                    source={source} 
                                    onDelete={(cardId: string) => deleteCard(columnId as keyof typeof columns, cardId)} />
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>
        </>
    );
};

export default DraggableColumn;