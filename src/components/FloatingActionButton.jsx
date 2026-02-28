import React from 'react';
import { Plus } from 'lucide-react';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onClick }) => {
    return (
        <button
            className="fab-button"
            onClick={onClick}
            aria-label="Add Farm"
        >
            <Plus size={32} />
        </button>
    );
};

export default FloatingActionButton;
