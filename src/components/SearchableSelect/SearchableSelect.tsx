import React from 'react';
import WindowedSelect from 'react-windowed-select';

interface OptionType {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: OptionType[];
    onSelect: (selectedOption: OptionType | null) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, onSelect }) => {
    return (
        <WindowedSelect
            options={options}
            onChange={(selectedOption) => onSelect(selectedOption as OptionType | null)}
            className="text-black" // Ensures the text input is black
            windowThreshold={100} // Set a threshold to enable virtualization
        />
    );
};

export default SearchableSelect;
