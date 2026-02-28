import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './BottomSheet.css'; // Add dedicated styles

const BottomSheet = ({ isOpen, onClose, title, children, headerAction }) => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsRendered(false), 300); // Wait for transition
            document.body.style.overflow = '';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    return (
        <div className={`bottom-sheet-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div
                className={`bottom-sheet-content ${isOpen ? 'open' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bottom-sheet-drag-handle" />
                <div className="bottom-sheet-header">
                    <h3>{title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {headerAction && headerAction}
                        <button className="icon-btn" onClick={onClose} aria-label="Close">
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="bottom-sheet-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BottomSheet;
