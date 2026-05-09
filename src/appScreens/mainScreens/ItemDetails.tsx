import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from 'react-native';
import { Text, Avatar, Divider, Surface, Button } from 'react-native-paper';
import { COLORS } from '../../constants/Theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../reduxStore/slices/authSlice';
import { useGetProductQuery } from '../../reduxStore/slices/apiSlice';

const { width } = Dimensions.get('window');

interface ProductRates {
  hourly?: number;
  daily?: number;
  weekly?: number;
  monthly?: number;
}

interface ProductOwner {
  id?: string;
  name?: string;
  avatar?: string;
}

interface ProductData {
  id?: string;
  product_name?: string;
  product_description?: string;
  product_images?: string[];
  pricing?: ProductRates;
  owner?: ProductOwner;
  booking_status?: string;
}

export default function ItemDetails({ navigation }: any) {
  const [activeSlide, setActiveSlide] = useState(0);
  const route = useRoute();
  const { productId } = route.params as { productId: string };
  const currentUser = useSelector(selectCurrentUser);

  const {
    data: response,
    isLoading,
    error,
  } = useGetProductQuery(productId) as {
    data: { data: ProductData } | undefined;
    isLoading: boolean;
    error: any;
  };

  const productData = response?.data;

  // Check if current user is the owner of the product
  const isOwner = currentUser?.id === productData?.owner?.id;

  // Debug logging
  console.log('Product ID:', productId);
  console.log('Current User:', currentUser);
  console.log('Product Owner:', productData?.owner);
  console.log('Is Owner:', isOwner);
  console.log('API Response:', response);
  console.log('Product Data:', productData);
  console.log('Product Images:', productData?.product_images);
  console.log('Product Name:', productData?.product_name);
  console.log('Product Description:', productData?.product_description);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeSlide) {
      setActiveSlide(roundIndex);
    }
  };

  const handleBookItem = () => {
    navigation.navigate('BookItem', { productId });
  };

  const renderPagination = () => {
    if (!productData?.product_images) return null;

    return (
      <View style={styles.paginationContainer}>
        {productData.product_images.map((_: any, index: number) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeSlide ? styles.paginationDotActive : null,
            ]}
          />
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error || !productData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load product details</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {productData?.product_images &&
            productData.product_images.length > 0 ? (
              productData.product_images.map(
                (imageUri: string, index: number) => (
                  <Image
                    key={index}
                    source={{ uri: imageUri }}
                    style={styles.carouselImage}
                    resizeMode="cover"
                    onError={error => console.log('Image load error:', error)}
                  />
                ),
              )
            ) : (
              <Image
                source={{
                  uri: 'https://miro.medium.com/v2/resize:fit:1000/format:webp/1*TYMKEhU1JSCRBClgjXbplw.jpeg',
                }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            )}
          </ScrollView>
          {renderPagination()}
        </View>

        <View style={styles.contentContainer}>
          <Surface style={styles.cardSection} elevation={1}>
            <View style={styles.nameAndStatusContainer}>
              <Text variant="headlineSmall" style={styles.productName}>
                {productData?.product_name || 'Product Name Not Available'}
              </Text>
              {productData?.booking_status && (
                <View style={styles.statusBadge}>
                  <Text variant="labelSmall" style={styles.statusText}>
                    {productData.booking_status}
                  </Text>
                </View>
              )}
            </View>
          </Surface>

          {/* Description Section */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>
            <Text variant="bodyMedium" style={styles.descriptionText}>
              {productData?.product_description || 'Description Not Available'}
            </Text>
          </Surface>

          {/* Pricing Details */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Rental Rates
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.ratesContainer}>
              {productData.pricing?.hourly && (
                <View style={styles.rateCol}>
                  <Text variant="bodyMedium" style={styles.rateLabel}>
                    Hourly
                  </Text>
                  <Text variant="titleMedium" style={styles.rateValue}>
                    Rs.{productData.pricing.hourly}
                  </Text>
                </View>
              )}
              {productData.pricing?.daily && (
                <View style={styles.rateColBorder}>
                  <Text variant="bodyMedium" style={styles.rateLabel}>
                    Daily
                  </Text>
                  <Text variant="titleMedium" style={styles.rateValue}>
                    Rs.{productData.pricing.daily}
                  </Text>
                </View>
              )}
              {productData.pricing?.weekly && (
                <View style={styles.rateColBorder}>
                  <Text variant="bodyMedium" style={styles.rateLabel}>
                    Weekly
                  </Text>
                  <Text variant="titleMedium" style={styles.rateValue}>
                    Rs.{productData.pricing.weekly}
                  </Text>
                </View>
              )}
              {productData.pricing?.monthly && (
                <View style={styles.rateColBorder}>
                  <Text variant="bodyMedium" style={styles.rateLabel}>
                    Monthly
                  </Text>
                  <Text variant="titleMedium" style={styles.rateValue}>
                    Rs.{productData.pricing.monthly}
                  </Text>
                </View>
              )}
            </View>
          </Surface>

          {/* Owner Information */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Owner Details
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.ownerContainer}>
              <Avatar.Image
                size={60}
                source={
                  productData.owner?.avatar
                    ? { uri: productData.owner.avatar }
                    : {
                        uri: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
                      }
                }
              />
              <View style={styles.ownerInfo}>
                <Text variant="titleMedium" style={styles.ownerName}>
                  {productData.owner?.name || 'Unknown Owner'}
                </Text>
                <Text variant="bodyMedium" style={styles.ownerStatus}>
                  Verified Renter &#10003;
                </Text>
              </View>
            </View>
          </Surface>
        </View>
      </ScrollView>

      {/* Fixed Book Item Button - Only show if user is not the owner */}
      {!isOwner && (
        <View style={styles.bookButtonContainer}>
          <Button
            mode="contained"
            onPress={handleBookItem}
            style={styles.bookButton}
            contentStyle={styles.bookButtonContent}
          >
            Book Item
          </Button>
        </View>
      )}
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
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContent: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  productName: {
    fontWeight: '900', // Very prominently visible
    color: '#1a1a1a',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  carouselContainer: {
    width: width,
    height: 300,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
  },
  carouselImage: {
    width: width,
    height: 300,
  },
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Add padding to prevent overlap with fixed button
  },
  cardSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  nameAndStatusContainer: {
    flexDirection: 'column',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  descriptionText: {
    color: '#555',
    lineHeight: 22,
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#eee',
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rateCol: {
    flex: 1,
    alignItems: 'center',
  },
  rateColBorder: {
    flex: 1,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  rateLabel: {
    color: '#888',
    marginBottom: 4,
  },
  rateValue: {
    fontWeight: 'bold',
    color: '#E53935',
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ownerInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  ownerName: {
    fontWeight: 'bold',
    color: '#222',
  },
  ownerStatus: {
    color: '#4CAF50',
    marginTop: 2,
  },
  bookButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bookButton: {
    backgroundColor: COLORS.primary,
  },
  bookButtonContent: {
    paddingVertical: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center',
  },
});
