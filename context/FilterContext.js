import React, { createContext, useState, useContext } from 'react';

// Estado inicial dos filtros
const initialState = {
  sexo: null,
  porte: null,
  castrado: null,
}; 

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(initialState);

  const clearFilters = () => setFilters(initialState);

  return (
 <FilterContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  return useContext(FilterContext);
};