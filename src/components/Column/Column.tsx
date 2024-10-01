import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './../Card';
import { Paper, Typography } from '@mui/material';
import { ColumnProps } from './Column.types';
import { columnStyles, placeholderStyles } from './Column.styles';
import { COLUMN_TOP_SPACE, PAPER_GAP} from './Column.constants';

const Column = ({ cards, columnId, draggingId, destination, source, onDelete }: ColumnProps) => {
    const isEmptyColumn = cards.length === 0;
      
    return (
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => {
            const isDraggingOver = snapshot.isDraggingOver;
            return (
          <Paper
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={columnStyles.paper}
          >
            <Typography variant="h6" style={columnStyles.title}>
              {columnId}
            </Typography>
  
            {/* Render cards */}
            {cards.map((card, index) => {
                
                // Keep track of where we are dragging. Based on destination, or if same column, based on source
                const { isCurrentColumn, isCurrentCard, isDestinationTop } = (() => {
                    if (destination) { // Has swapped column atleast once
                        return {
                            isCurrentColumn: destination.droppableId === columnId,
                            isCurrentCard: destination.index === index + 1,
                            isDestinationTop: destination.index === 0,
                        };
                    } else { // Has only stayed within same column
                        return {
                            isCurrentColumn: source?.droppableId === columnId,
                            isCurrentCard: source?.index === index + 1,
                            isDestinationTop: source?.index === 0,
                        };
                    }
                })();

                return (
                <React.Fragment key={card.id}>

                    {/* Placeholder when dragging to the top of the column */}
                    {index === 0 && isDraggingOver && draggingId && isDestinationTop && (
                        <div style={{top: `${COLUMN_TOP_SPACE + PAPER_GAP}px`, ...placeholderStyles.placeholderTop, }} >Placeholder top</div>
                    )}

                    <div style={{position: 'relative',}}>
                        <Card onDelete={onDelete} id={card.id} title={card.title} content={card.content} index={index} />
                    </div>

                    {/* Placeholder for the currently dragged card */}
                    {isDraggingOver && draggingId && isCurrentColumn && isCurrentCard && (
                        <div style={{top: `${(index + 1) * 98 + COLUMN_TOP_SPACE + PAPER_GAP}px`, ...placeholderStyles.placeholderBetween, }} >Placeholder between</div>
                    )}
                </React.Fragment>
                )}
            )}
  
            {/* Placeholder when dragging into empty columns */}
            {isDraggingOver && isEmptyColumn && (
                <div style={placeholderStyles.placeholderEmpty} >Placeholder empty</div>
            )}
  
            {/* Placeholder displacement spacer */}
            {provided.placeholder}
          </Paper>
        )}}
      </Droppable>
    );
  };
  
  export default Column;