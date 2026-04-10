import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Text, Avatar, Divider, Surface, Appbar } from 'react-native-paper';

const { width } = Dimensions.get('window');

// Dummy data for the item details
const ITEM_DETAILS = {
  id: '1',
  name: 'Premium Power Drill Set',
  images: [
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=1000&auto=format&fit=crop',
  ],
  rates: {
    hourly: 5,
    daily: 25,
    weekly: 100,
    monthly: 300,
  },
  owner: {
    name: 'Karan Yadav',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  },
  description:
    'A complete power drill set suitable for all your DIY and professional needs. Includes multiple bits, dual batteries, and a quick charger.',
};

export default function ItemDetails({ navigation }: any) {
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeSlide) {
      setActiveSlide(roundIndex);
    }
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {ITEM_DETAILS.images.map((_, index) => (
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

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={ITEM_DETAILS.name} />
      </Appbar.Header>

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
            {ITEM_DETAILS.images.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {renderPagination()}
        </View>

        <View style={styles.contentContainer}>
          {/* Description Section */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>
            <Text variant="bodyMedium" style={styles.descriptionText}>
              {ITEM_DETAILS.description}
            </Text>
          </Surface>

          {/* Pricing Details */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Rental Rates
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.ratesContainer}>
              <View style={styles.rateCol}>
                <Text variant="bodyMedium" style={styles.rateLabel}>
                  Hourly
                </Text>
                <Text variant="titleMedium" style={styles.rateValue}>
                  Rs.{ITEM_DETAILS.rates.hourly}
                </Text>
              </View>
              <View style={styles.rateColBorder}>
                <Text variant="bodyMedium" style={styles.rateLabel}>
                  Daily
                </Text>
                <Text variant="titleMedium" style={styles.rateValue}>
                  Rs.{ITEM_DETAILS.rates.daily}
                </Text>
              </View>
              <View style={styles.rateColBorder}>
                <Text variant="bodyMedium" style={styles.rateLabel}>
                  Weekly
                </Text>
                <Text variant="titleMedium" style={styles.rateValue}>
                  Rs.{ITEM_DETAILS.rates.weekly}
                </Text>
              </View>
              <View style={styles.rateColBorder}>
                <Text variant="bodyMedium" style={styles.rateLabel}>
                  Monthly
                </Text>
                <Text variant="titleMedium" style={styles.rateValue}>
                  Rs.{ITEM_DETAILS.rates.monthly}
                </Text>
              </View>
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
                source={{ uri: ITEM_DETAILS.owner.avatar }}
              />
              <View style={styles.ownerInfo}>
                <Text variant="titleMedium" style={styles.ownerName}>
                  {ITEM_DETAILS.owner.name}
                </Text>
                <Text variant="bodyMedium" style={styles.ownerStatus}>
                  Verified Renter &#10003;
                </Text>
              </View>
            </View>
          </Surface>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#e5e6e8',
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
});
