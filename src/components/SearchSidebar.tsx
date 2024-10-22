import React from 'react';
import { CgClose } from 'react-icons/cg';

interface SearchSidebarProps {
  searchResults: google.maps.places.AutocompletePrediction[];
  onSelectPlace: (placeId: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function SearchSidebar({ searchResults, onSelectPlace, onClose, isOpen }: SearchSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto z-30 transition-transform duration-300 ease-in-out transform translate-x-0">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">검색 결과</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out">
            <CgClose size={24} />
          </button>
        </div>
        {searchResults.map((result) => (
          <div 
            key={result.place_id} 
            className="bg-gray-100 p-4 rounded-lg mb-3 cursor-pointer hover:bg-gray-200 transition duration-150 ease-in-out"
            onClick={() => onSelectPlace(result.place_id)}
          >
            <h3 className="font-semibold text-gray-800">{result.structured_formatting.main_text}</h3>
            <p className="text-sm text-gray-600">{result.structured_formatting.secondary_text}</p>
            {result.types && result.types.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {result.types.map(type => type.replace('_', ' ')).join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};