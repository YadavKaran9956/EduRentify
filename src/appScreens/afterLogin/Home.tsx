import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Searchbar, Card, Text, Menu, Button, FAB } from 'react-native-paper';
import { COLORS } from '../../constants/Theme';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Dummy data for rentable DIY tools
const RENTABLE_ITEMS = [
  {
    id: '1',
    name: 'Power Drill Set',
    pricePerHour: 5,
    location: '123 Maker St, Downtown',
    imageUrl:
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Circular Saw',
    pricePerHour: 8,
    location: '456 Build Ave, Uptown',
    imageUrl:
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Complete Wrench Kit',
    pricePerHour: 3,
    location: '789 Fixit Blvd, Greenfield',
    imageUrl:
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Heavy Duty Ladder',
    pricePerHour: 4,
    location: '321 Heights Rd, Westside',
    imageUrl:
      'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function Home({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('Hourly');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleFilterSelect = (selectedFilter: string) => {
    setFilter(selectedFilter);
    closeMenu();
  };

  const handleAddItem = () => {
    navigation.navigate('AddItems');
  };

  const renderItem = ({ item }: { item: (typeof RENTABLE_ITEMS)[0] }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <Card.Cover source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text variant="titleMedium" style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="titleMedium" style={styles.price}>
            ${item.pricePerHour}/hr
          </Text>
        </View>
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text
            variant="bodyMedium"
            style={styles.locationText}
            numberOfLines={1}
          >
            {item.location}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeader}>
        <Image
          source={require('../../assets/icon.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.stickySearchContainer}>
          <Searchbar
            placeholder="Search items.."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button
                mode="contained"
                onPress={openMenu}
                style={styles.filterButton}
                labelStyle={styles.filterButtonText}
              >
                {filter}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => handleFilterSelect('Hourly')}
              title="Hourly"
            />
            <Menu.Item
              onPress={() => handleFilterSelect('Daily')}
              title="Daily"
            />
            <Menu.Item
              onPress={() => handleFilterSelect('Weekly')}
              title="Weekly"
            />
            <Menu.Item
              onPress={() => handleFilterSelect('Monthly')}
              title="Monthly"
            />
          </Menu>
        </View>
      </View>
      <FlatList
        data={RENTABLE_ITEMS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Featured Items
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.addButtonContainer}>
        <Button
          mode="contained"
          onPress={handleAddItem}
          style={styles.addButton}
          contentStyle={styles.addButtonContent}
          icon="plus"
        >
          Add Item
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingTop: 220, // heroImage (120) + stickySearchContainer (approx 80) + padding
    paddingBottom: 20,
  },
  heroImage: {
    width: width,
    height: 120,
    resizeMode: 'center',
    alignSelf: 'center',
    backgroundColor: '#f5f5f5',
    marginTop: 10,
  },
  stickySearchContainer: {
    width: width,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  searchBar: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    height: 56,
    marginRight: 8,
  },
  filterButton: {
    height: 56,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
  },
  filterButtonText: {
    fontSize: 14,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    height: 160,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  cardContent: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    flex: 1,
    fontWeight: '600',
    marginRight: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#E53935',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  locationText: {
    color: '#666',
    flex: 1,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: COLORS.primary,
  },
  addButtonContent: {
    paddingVertical: 12,
  },
});
