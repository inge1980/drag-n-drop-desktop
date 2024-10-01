import React from 'react';
import { Drawer, Button, List, ListItem, Typography } from '@mui/material';

// Define the prop types using an interface
interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => (
    <Drawer anchor="right" open={open} onClose={onClose}>
        <div style={{ width: '250px', padding: '16px' }}>
            <Typography variant="h6">Drag and Drop Items</Typography>
            <List></List>
        </div>
    </Drawer>
);

export default Sidebar;