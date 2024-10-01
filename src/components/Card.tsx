import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Paper, Typography, IconButton } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle'; // Importing a drag handle icon

interface CardProps {
    id: string;
    title: string;
    content: string;
    index: number;
}

const Card = ({ id, title, content, index }: CardProps) => {
    return (
        <Draggable draggableId={id} index={index}>
            {(provided, snapshot) => (
                <Paper
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    elevation={snapshot.isDragging ? 4 : 1} // Change elevation based on dragging state
                    style={{
                        margin: '8px',
                        marginBottom: '0px',
                        transition: 'box-shadow 0.2s ease',
                        display: 'flex', // Flex for layout
                        flexDirection: 'column', // Ensure items stack vertically
                        ...provided.draggableProps.style,                        
                        //opacity: snapshot.isDragging ? 0.5 : 1, // Set opacity based on dragging state
                    }}
                >
                    {/* Drag Handle Icon */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton {...provided.dragHandleProps} style={{ cursor: 'grab' }}>
                            <DragHandleIcon />
                        </IconButton>
                        
                        {/* Card Title */}
                        <Typography gutterBottom variant="h6" style={{ padding: '8px', flexGrow: 1 }}>
                            {title}
                        </Typography>
                    </div>
                    
                    {/* Card Content */}
                    <Typography variant="body2" style={{ padding: '8px', flexGrow: 1 }}>
                        {content}
                    </Typography>
                </Paper>
            )}
        </Draggable>
    );
};

export default Card;