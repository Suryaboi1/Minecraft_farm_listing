import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import './Dropdown.css';

const Dropdown = ({ options, value, onChange, placeholder = "Select an item..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <div
                className={`dropdown-trigger ${isOpen ? 'open' : ''} ${!value ? 'placeholder' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <div className="dropdown-selected">
                        {selectedOption.image && <img src={selectedOption.image} alt={selectedOption.name} className="dropdown-image" />}
                        <span>{selectedOption.name}</span>
                    </div>
                ) : (
                    <span>{placeholder}</span>
                )}
                <ChevronDown size={20} className="dropdown-chevron" />
            </div>

            {isOpen && (
                <div className="dropdown-menu animate-dropdown-open">
                    <div className="dropdown-search">
                        <Search size={16} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
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
                                    {option.image && <img src={option.image} alt={option.name} className="dropdown-image" />}
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
