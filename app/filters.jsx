import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useFilters } from '../context/FilterContext';


const FilterGroup = ({ title, options, selected, onSelect }) => (
  <View style={styles.groupContainer}>
    <Text style={styles.label}>{title}</Text>
    <View style={styles.optionsContainer}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[styles.option, selected === option.value && styles.optionSelected]}
          onPress={() => onSelect(option.value)}
        >
          <Text style={selected === option.value ? styles.optionTextSelected : styles.optionText}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  </View>
);


export default function FiltersModal() {
  const { filters: globalFilters, setFilters, clearFilters } = useFilters();
  const [localFilters, setLocalFilters] = useState(globalFilters);

  const handleSelect = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  
  const handleApply = () => {
    setFilters(localFilters);
   
    router.navigate('/tabs/match'); 
  };
  
 
  const handleClear = () => {
    clearFilters();
   
    router.navigate('/tabs/match');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Filtrar Animais</Text>

      <FilterGroup
        title="Sexo"
        options={[{ label: 'Macho', value: 'M' }, { label: 'Fêmea', value: 'F' }]}
        selected={localFilters.sexo}
        onSelect={(value) => handleSelect('sexo', value)}
      />

      <FilterGroup
        title="Porte"
        options={[{ label: 'Pequeno', value: 'Pequeno' }, { label: 'Médio', value: 'Médio' }, { label: 'Grande', value: 'Grande' }]}
        selected={localFilters.porte}
        onSelect={(value) => handleSelect('porte', value)}
      />

      <FilterGroup
        title="Castrado"
        options={[{ label: 'Sim', value: true }, { label: 'Não', value: false }]}
        selected={localFilters.castrado}
        onSelect={(value) => handleSelect('castrado', value)}
      />
      
      <View style={styles.footerButtons}>
        <Pressable style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
        </Pressable>
        <Pressable style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Limpar Filtros</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

// Seus estilos continuam os mesmos
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', },
    scrollContent: { padding: 20, },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, marginTop: 40, color: '#014946ff' },
    groupContainer: { marginBottom: 25 },
    label: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#333', },
    optionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    option: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#f0f0f0', borderRadius: 20, borderWidth: 1, borderColor: '#ddd' },
    optionSelected: { backgroundColor: '#00C7BE', borderColor: '#00A69E' },
    optionText: { fontSize: 16, color: '#555' },
    optionTextSelected: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
    footerButtons: { marginTop: 30, paddingBottom: 40, },
    applyButton: { backgroundColor: '#00C7BE', padding: 15, borderRadius: 10, elevation: 2, },
    applyButtonText: { color: '#fff', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
    clearButton: { marginTop: 15, padding: 15 },
    clearButtonText: { color: '#888', textAlign: 'center', fontSize: 16, textDecorationLine: 'underline', }
});