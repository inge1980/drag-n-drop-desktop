export interface CardProps {
    id: string;
    title: string;
    content: string;
    index: number;
    onDelete: (id: string) => void;
}
  
export interface ColumnProps {
    cards: CardProps[];
    columnId: string;
    draggingId: string | null;
    destination: { droppableId: string | null; index: number | null } | null;
    source: { droppableId: string | null; index: number | null } | null;
    onDelete: (id: string) => void;
}