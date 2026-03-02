import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import './Dropdown.css';

const Dropdown = ({ options, value, onChange, placeholder = "Search items..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm(''); // Reset search term when closing
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // If an option is selected, we don't need to filter by search term in the dropdown,
    // or maybe we do if they are clicking to change it.
    // If it's closed, selectedOption is shown. If open, we show input.
    
    // Derived term: if open and typing, use searchTerm. If closed and selected, use selected name conceptually.
    // Actually, let's keep it simple: input value is searchTerm if open, or selected option name if closed.
    const displayValue = isOpen 
        ? searchTerm 
        : (selectedOption ? selectedOption.name : '');

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 100); // Limit to 100 rendered items to prevent DOM freezing

    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setSearchTerm('');
        setIsOpen(true);
    };

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <div
                className={`dropdown-trigger ${isOpen ? 'open' : ''} ${!value && !isOpen ? 'placeholder' : ''}`}
                onClick={() => {
                    if (!isOpen) {
                        setIsOpen(true);
                        setSearchTerm('');
                    }
                }}
            >
                <div className="dropdown-input-wrapper">
                    {selectedOption && !isOpen && selectedOption.image && (
                        <img
                            src={selectedOption.image}
                            alt={selectedOption.name}
                            className="dropdown-image"
                            onError={(e) => {
                                if (e.target.src.includes('/items/')) {
                                    e.target.src = `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.20.2/blocks/${selectedOption.id}.png`;
                                } else {
                                    e.target.style.display = 'none';
                                }
                            }}
                        />
                    )}
                    <input
                        type="text"
                        className="dropdown-inline-input"
                        placeholder={selectedOption && !isOpen ? '' : placeholder}
                        value={displayValue}
                        onChange={(e) => {
                            if (!isOpen) setIsOpen(true);
                            setSearchTerm(e.target.value);
                            // If user types, we should probably clear the selection so it doesn't stay selected
                            if (value) {
                                onChange('');
                            }
                        }}
                        readOnly={!isOpen && !!selectedOption} // Prevent mobile keyboard if just viewing
                    />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {selectedOption && (
                        <button 
                            className="dropdown-clear-btn" 
                            onClick={handleClear}
                            type="button"
                            aria-label="Clear selection"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <ChevronDown size={20} className="dropdown-chevron" />
                </div>
            </div>

            {isOpen && (
                <div className="dropdown-menu animate-dropdown-open">
                    <div className="dropdown-options">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`dropdown-option ${value === option.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(option.id);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                    {option.image && <img
                                        src={option.image}
                                        alt={option.name}
                                        className="dropdown-image"
                                        onError={(e) => {
                                            if (e.target.src.includes('/items/')) {
                                                e.target.src = `https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.20.2/blocks/${option.id}.png`;
                                            } else {
                                                e.target.style.display = 'none';
                                            }
                                        }}
                                    />}
                                    <span>{option.name}</span>
                                </div>
                            ))
                        ) : (
                            <div className="dropdown-no-results">No items found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
