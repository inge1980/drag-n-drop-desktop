"use client";
import React, { useLayoutEffect, useState } from 'react';
import { DragDropContext, DropResult, DragUpdate, DragStart } from '@hello-pangea/dnd';
import Column from '../components/Column/Column';
import { Button } from '@mui/material';
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

    // Load columns from local storage or create initial columns if none are found
    const [columns, setColumns] = useState<ColumnsState>(() => {
        const savedColumns = localStorage.getItem('columns');
        return savedColumns ? JSON.parse(savedColumns) : createInitialColumns(cols);
    });

    // Initialize number of columns from local storage or use the provided prop
    //const [inputCols, setInputCols] = useState(() => {
    //    const savedColumnCount = localStorage.getItem('numColumns');
    //    return savedColumnCount ? Number(savedColumnCount) : cols;
    //});

    // Save columns to local storage
    useLayoutEffect(() => {
        localStorage.setItem('columns', JSON.stringify(columns));
    }, [columns]);

    // Adjust columns based on new cols prop
    useLayoutEffect(() => {
        const savedColumns = localStorage.getItem('columns');
        if (savedColumns) {
            const parsedColumns = JSON.parse(savedColumns);
            const adjustedColumns = adjustColumns(parsedColumns, cols);
            setColumns(adjustedColumns);
        } else {
            setColumns(createInitialColumns(cols));
        }
    }, [cols]);
    
    const onDragStart = (start: DragStart) => {
        console.log('onDragStart: ', start);
        setDraggingId(start.draggableId);
        setSource(start.source);
    };

    const onDragEnd = (result: DropResult) => {
        console.log('onDragEnd: ', result);
        const { source, destination } = result;

        setDraggingId(null);  // Reset dragging state

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
        console.log('Source:', source);
        console.log('Destination:', destination);
        resetDraggingState(); // Reset dragging state after dropping
    };

    const resetDraggingState = () => {
        setDraggingId(null);
        setDestination(null);
        setSource(null);
    };
    
    const onDragUpdate = (update: DragUpdate) => {
        const { draggableId, destination: dest, source: src } = update; // Capture destination
        console.log('onDragUpdate:', update);
        setDraggingId(draggableId);
        setDestination(dest); // Store destination
        setSource(src); // Store source
    };

    const addCard = (columnId: keyof typeof columns) => {
        console.log('addCard: ', columnId);
        const newCardId = uuidv4(); // Generate the new UUID
        const title = newCardId.slice(-5); // Get the last 5 characters of the UUID
        const newCard: CardProps = { id: newCardId , title: `id: ${title}`, content: `New Card in ${columnId}`, index: columns[columnId].length };
        setColumns((prev) => ({
            ...prev,
            [columnId]: [...prev[columnId], newCard],
        }));
    };

    const resetColumns = () => {
        setColumns(createInitialColumns(cols));
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate} onDragStart={onDragStart}>
                <div style={{ display: 'flex' }}>
                    {Object.entries(columns).map(([columnId, columnCards]) => (
                        <div key={columnId}>
                            <Column cards={columnCards} columnId={columnId} draggingId={draggingId} destination={destination} source={source} />
                            <Button variant="contained" onClick={() => addCard(columnId as keyof typeof columns)}>
                                Add Card to {columnId}
                            </Button>
                        </div>
                    ))}
                </div>
                </DragDropContext>
            <Button variant="contained" color="secondary" onClick={resetColumns} style={{ marginLeft: '16px' }}>
                Reset Columns
            </Button>
        </>
    );
};

export default DraggableColumn;