import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Text, IconButton, Button } from 'react-native-paper';
import { COLORS } from '../../constants/Theme';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
  useGetMyProductsQuery,
  useDeleteProductMutation,
} from '../../reduxStore/slices/apiSlice';
import { Toaster } from '../../components/toast';

export default function MyListings({ navigation }: any) {
  const {
    data: myProductsData,
    isLoading,
    error,
    refetch,
  } = useGetMyProductsQuery({});
  const [deleteProduct] = useDeleteProductMutation();
  const isFocused = useIsFocused();
  const [products, setProducts] = useState([]);

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      Toaster.toastSuccess('Product deleted successfully');
    } catch (error: any) {
      console.log('Delete product error:', error);
      Toaster.toastError(error?.data?.message || 'Failed to delete product');
    }
  };

  React.useEffect(() => {
    if (myProductsData) {
      console.log('My Products from API:', myProductsData);
      const transformedProducts = (myProductsData as any)?.data?.map(
        (product: any) => {
          let price = 0;
          let priceType = 'hr';

          if (product.pricing?.hourly) {
            price = product.pricing.hourly;
            priceType = 'hr';
          } else if (product.pricing?.daily) {
            price = product.pricing.daily;
            priceType = 'day';
          } else if (product.pricing?.weekly) {
            price = product.pricing.weekly;
            priceType = 'week';
          } else if (product.pricing?.monthly) {
            price = product.pricing.monthly;
            priceType = 'month';
          }

          return {
            id: product.id,
            name: product.product_name,
            pricePerTime: price,
            priceType: priceType,
            location: product.product_location,
            imageUrl: product.product_images?.[0]
              ? { uri: product.product_images[0] }
              : require('../../assets/icon.png'),
          };
        },
      );

      setProducts(transformedProducts);
    }
    if (error) {
      console.log('Get my products error:', error);
    }
  }, [myProductsData, error]);

  const renderItem = ({ item }: { item: any }) => {
    const handleDeleteProduct = async (productId: string) => {
      Alert.alert(
        'Delete Product',
        'Are you sure you want to delete this product?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteProduct(productId).unwrap();
                Toaster.toastSuccess('Product deleted successfully');
                navigation.navigate('Home'); // Navigate to home screen
              } catch (error: any) {
                console.log('Delete product error:', error);
                Toaster.toastError(
                  error?.data?.message || 'Failed to delete product',
                );
              }
            },
          },
        ],
      );
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
          <View style={styles.headerRow}>
            <View style={styles.nameContainer}>
              <Text
                variant="titleMedium"
                style={styles.itemName}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text variant="titleMedium" style={styles.price}>
                ${item.pricePerTime}/{item.priceType}
              </Text>
            </View>
            <IconButton
              icon="delete"
              size={20}
              iconColor="#E53935"
              onPress={() => handleDeleteProduct(item.id)}
              style={styles.deleteIcon}
            />
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
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              My Listings
            </Text>
            {isLoading && (
              <Text style={styles.loadingText}>Loading your items...</Text>
            )}
            {!isLoading && products.length === 0 && (
              <Text style={styles.emptyText}>No items found</Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => {}}
      />
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('AddItems')}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameContainer: {
    flex: 1,
  },
  itemName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontWeight: 'bold',
    color: '#E53935',
  },
  deleteIcon: {
    marginLeft: 8,
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
  bottomBar: {
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
    width: '100%',
  },
  addButtonContent: {
    paddingVertical: 8,
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
