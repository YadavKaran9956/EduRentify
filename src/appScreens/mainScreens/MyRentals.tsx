import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import { COLORS } from '../../constants/Theme';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useGetMyBookingsQuery } from '../../reduxStore/slices/apiSlice';

interface BookingData {
  id: string;
  product_name: string;
  product_images?: string[];
  start_date: string;
  end_date: string;
  price: number;
  status: string;
  owner?: {
    name: string;
  };
}

export default function MyRentals({ navigation }: any) {
  const { data: myBookingsData, isLoading, error } = useGetMyBookingsQuery({});
  const isFocused = useIsFocused();
  const [bookings, setBookings] = useState([]);

  React.useEffect(() => {
    if (isFocused && myBookingsData) {
      console.log('My Bookings from API:', myBookingsData);
      const transformedBookings = (myBookingsData as any)?.data?.map(
        (booking: any) => {
          return {
            id: booking.id,
            name: booking.product_name,
            startDate: booking.start_date,
            endDate: booking.end_date,
            price: booking.price,
            status: booking.status,
            imageUrl: booking.product_images?.[0]
              ? { uri: booking.product_images[0] }
              : require('../../assets/icon.png'),
          };
        },
      );

      setBookings(transformedBookings);
    }
    if (error) {
      console.log('Get my bookings error:', error);
    }
  }, [myBookingsData, error, isFocused]);

  const renderItem = ({ item }: { item: any }) => {
    // Format date from YYYY-MM-DD to readable format
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    return (
      <Card
        style={styles.card}
        onPress={() =>
          navigation.navigate('ItemDetails', { productId: item.id })
        }
      >
        <Card.Cover
          source={
            typeof item.imageUrl === 'number'
              ? item.imageUrl
              : { uri: item.imageUrl }
          }
          style={styles.cardImage}
        />
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium" style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text variant="titleMedium" style={styles.price}>
            Rs.{item.price}
          </Text>
          <Text variant="bodyMedium" style={styles.dateText}>
            {formatDate(item.startDate)} - {formatDate(item.endDate)}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              My Rentals
            </Text>
            {isLoading && (
              <Text style={styles.loadingText}>Loading your rentals...</Text>
            )}
            {!isLoading && bookings.length === 0 && (
              <Text style={styles.emptyText}>No rentals found</Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 80,
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
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 8,
  },
  dateText: {
    color: '#666',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
