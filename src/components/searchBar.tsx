import React from 'react';
import { Searchbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search Pokemon..."
        onChangeText={onChangeText}
        value={value}
        icon="magnify"
        clearIcon="close"
        style={styles.searchBar}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 2,
    backgroundColor: '#f0f0f0',
  },
});
