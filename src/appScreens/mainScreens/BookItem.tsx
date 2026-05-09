import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import {
  Text,
  Card,
  Divider,
  Surface,
  Button,
  TextInput,
  RadioButton,
  Avatar,
} from 'react-native-paper';
import { COLORS } from '../../constants/Theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Toaster } from '../../components/toast';
import {
  useGetProductQuery,
  useBookProductMutation,
} from '../../reduxStore/slices/apiSlice';

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
}

export default function BookItem({ navigation }: any) {
  const route = useRoute();
  const { productId } = route.params as { productId: string };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('hourly');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isDatesValid, setIsDatesValid] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerType, setPickerType] = useState<'start' | 'end'>('start');
  const [selectedDay, setSelectedDay] = useState('1');
  const [selectedMonth, setSelectedMonth] = useState('1');
  const [selectedYear, setSelectedYear] = useState('2024');

  const [bookProduct, { isLoading: isBooking }] = useBookProductMutation();

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

  // Set default time period based on available pricing
  React.useEffect(() => {
    if (productData?.pricing) {
      if (productData.pricing.hourly) {
        setSelectedTimePeriod('hourly');
      } else if (productData.pricing.daily) {
        setSelectedTimePeriod('daily');
      } else if (productData.pricing.weekly) {
        setSelectedTimePeriod('weekly');
      } else if (productData.pricing.monthly) {
        setSelectedTimePeriod('monthly');
      }
    }
  }, [productData]);

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setIsDatesValid(false);
    setTotalPrice(0);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setIsDatesValid(false);
    setTotalPrice(0);
  };

  const openStartDatePicker = () => {
    setPickerType('start');
    if (startDate) {
      const date = new Date(startDate);
      setSelectedDay(String(date.getDate()));
      setSelectedMonth(String(date.getMonth() + 1));
      setSelectedYear(String(date.getFullYear()));
    } else {
      const today = new Date();
      setSelectedDay(String(today.getDate()));
      setSelectedMonth(String(today.getMonth() + 1));
      setSelectedYear(String(today.getFullYear()));
    }
    setShowDatePicker(true);
  };

  const openEndDatePicker = () => {
    setPickerType('end');
    if (endDate) {
      const date = new Date(endDate);
      setSelectedDay(String(date.getDate()));
      setSelectedMonth(String(date.getMonth() + 1));
      setSelectedYear(String(date.getFullYear()));
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDay(String(tomorrow.getDate()));
      setSelectedMonth(String(tomorrow.getMonth() + 1));
      setSelectedYear(String(tomorrow.getFullYear()));
    }
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    const dateString = `${selectedYear}-${selectedMonth.padStart(
      2,
      '0',
    )}-${selectedDay.padStart(2, '0')}`;
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Toaster.toastError(
        'Cannot select past dates. Please select a future date.',
      );
      return;
    }

    if (pickerType === 'start') {
      setStartDate(dateString);
    } else {
      setEndDate(dateString);
    }
    setIsDatesValid(false);
    setTotalPrice(0);
    setShowDatePicker(false);
  };

  const handleCalculatePrice = () => {
    if (!startDate || !endDate) {
      Toaster.toastError('Please enter both start and end dates');
      setIsDatesValid(false);
      setTotalPrice(0);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      Toaster.toastError('Please enter valid dates in YYYY-MM-DD format');
      setIsDatesValid(false);
      setTotalPrice(0);
      return;
    }

    if (start < today) {
      Toaster.toastError('Start date cannot be in the past');
      setIsDatesValid(false);
      setTotalPrice(0);
      return;
    }

    if (end < today) {
      Toaster.toastError('End date cannot be in the past');
      setIsDatesValid(false);
      setTotalPrice(0);
      return;
    }

    if (end <= start) {
      Toaster.toastError('End date must be after start date');
      setIsDatesValid(false);
      setTotalPrice(0);
      return;
    }

    calculatePrice(start, end);
    setIsDatesValid(true);
  };

  const calculatePrice = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffWeeks = Math.ceil(diffDays / 7);
    const diffMonths = Math.ceil(diffDays / 30);

    let price = 0;
    const pricing = productData?.pricing;

    if (!pricing) {
      setTotalPrice(0);
      return;
    }

    switch (selectedTimePeriod) {
      case 'hourly':
        price = (pricing.hourly || 0) * diffHours;
        break;
      case 'daily':
        price = (pricing.daily || 0) * diffDays;
        break;
      case 'weekly':
        price = (pricing.weekly || 0) * diffWeeks;
        break;
      case 'monthly':
        price = (pricing.monthly || 0) * diffMonths;
        break;
    }

    setTotalPrice(price);
  };

  const handleCheckout = async () => {
    if (!isDatesValid) {
      Toaster.toastError('Please calculate the price before checkout');
      return;
    }

    try {
      const bookingData = {
        product_id: productId,
        price: totalPrice,
        start_date: startDate,
        end_date: endDate,
      };

      console.log('Booking data being sent to API:', bookingData);

      const result = await bookProduct(bookingData).unwrap();

      if (result) {
        Toaster.toastSuccess('Booking successful!');
        navigation.goBack();
      }
    } catch (error: any) {
      console.log('Booking error:', error);
      Toaster.toastError(
        error?.data?.message || 'Booking failed. Please try again.',
      );
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error || !productData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error loading product. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        {/* Product Image */}
        <Image
          source={{
            uri:
              productData?.product_images?.[0] ||
              'https://miro.medium.com/v2/resize:fit:1000/format:webp/1*TYMKEhU1JSCRBClgjXbplw.jpeg',
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.contentContainer}>
          {/* Product Name */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="headlineSmall" style={styles.productName}>
              {productData?.product_name || 'Product Name'}
            </Text>
          </Surface>

          {/* Description */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Description
            </Text>
            <Text variant="bodyMedium" style={styles.descriptionText}>
              {productData?.product_description || 'Description Not Available'}
            </Text>
          </Surface>

          {/* Pricing Rates */}
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
                    Rs.{productData.pricing?.hourly}
                  </Text>
                </View>
              )}
              {productData.pricing?.daily && (
                <View style={styles.rateColBorder}>
                  <Text variant="bodyMedium" style={styles.rateLabel}>
                    Daily
                  </Text>
                  <Text variant="titleMedium" style={styles.rateValue}>
                    Rs.{productData.pricing?.daily}
                  </Text>
                </View>
              )}
              {productData.pricing?.weekly && (
                <View style={styles.rateColBorder}>
                  <Text variant="bodyMedium" style={styles.rateLabel}>
                    Weekly
                  </Text>
                  <Text variant="titleMedium" style={styles.rateValue}>
                    Rs.{productData.pricing?.weekly}
                  </Text>
                </View>
              )}
              {productData.pricing?.monthly && (
                <View style={styles.rateColBorder}>
                  <Text variant="bodyMedium" style={styles.rateLabel}>
                    Monthly
                  </Text>
                  <Text variant="titleMedium" style={styles.rateValue}>
                    Rs.{productData.pricing?.monthly}
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
                  productData?.owner?.avatar
                    ? { uri: productData.owner.avatar }
                    : {
                        uri: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
                      }
                }
              />
              <View style={styles.ownerInfo}>
                <Text variant="titleMedium" style={styles.ownerName}>
                  {productData?.owner?.name || 'Unknown Owner'}
                </Text>
                <Text variant="bodyMedium" style={styles.ownerStatus}>
                  Verified Renter &#10003;
                </Text>
              </View>
            </View>
          </Surface>

          {/* Time Period Selection */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select Time Period
            </Text>
            <Divider style={styles.divider} />
            <RadioButton.Group
              onValueChange={value => {
                setSelectedTimePeriod(value);
                setIsDatesValid(false);
                setTotalPrice(0);
              }}
              value={selectedTimePeriod}
            >
              {productData?.pricing?.hourly && (
                <RadioButton.Item label="Hourly" value="hourly" />
              )}
              {productData?.pricing?.daily && (
                <RadioButton.Item label="Daily" value="daily" />
              )}
              {productData?.pricing?.weekly && (
                <RadioButton.Item label="Weekly" value="weekly" />
              )}
              {productData?.pricing?.monthly && (
                <RadioButton.Item label="Monthly" value="monthly" />
              )}
            </RadioButton.Group>
          </Surface>

          {/* Date Selection */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select Dates
            </Text>
            <Divider style={styles.divider} />

            <View style={styles.dateSection}>
              <Text variant="bodyMedium" style={styles.dateLabel}>
                Start Date:
              </Text>
              <Button
                mode="outlined"
                onPress={openStartDatePicker}
                style={styles.dateButton}
              >
                {startDate || 'Select Start Date'}
              </Button>
            </View>

            <View style={styles.dateSection}>
              <Text variant="bodyMedium" style={styles.dateLabel}>
                End Date:
              </Text>
              <Button
                mode="outlined"
                onPress={openEndDatePicker}
                style={styles.dateButton}
              >
                {endDate || 'Select End Date'}
              </Button>
            </View>

            <Button
              mode="contained"
              onPress={handleCalculatePrice}
              style={styles.calculateButton}
              contentStyle={styles.calculateButtonContent}
            >
              Calculate Price
            </Button>
          </Surface>

          {/* Price Summary */}
          <Surface style={styles.cardSection} elevation={1}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Price Summary
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.priceSummaryContainer}>
              <Text variant="bodyMedium" style={styles.priceLabel}>
                Total Price:
              </Text>
              <Text variant="headlineMedium" style={styles.totalPrice}>
                Rs.{totalPrice}
              </Text>
            </View>
          </Surface>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutButtonContainer}>
        <Button
          mode="contained"
          onPress={handleCheckout}
          style={styles.checkoutButton}
          contentStyle={styles.checkoutButtonContent}
          disabled={!isDatesValid || isBooking}
          loading={isBooking}
        >
          Checkout
        </Button>
      </View>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent} elevation={5}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              Select {pickerType === 'start' ? 'Start' : 'End'} Date
            </Text>

            <View style={styles.dateRow}>
              <View style={styles.dateColumn}>
                <Text variant="bodySmall" style={styles.dateLabel}>
                  Day
                </Text>
                <Button mode="outlined" onPress={() => {}}>
                  {selectedDay}
                </Button>
                <ScrollView style={styles.dropdownContainer}>
                  {[...Array(31)].map((_, i) => (
                    <Button
                      key={i}
                      mode={
                        selectedDay === String(i + 1) ? 'contained' : 'text'
                      }
                      onPress={() => setSelectedDay(String(i + 1))}
                      style={styles.dropdownItem}
                      labelStyle={styles.dropdownItemLabel}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateColumn}>
                <Text variant="bodySmall" style={styles.dateLabel}>
                  Month
                </Text>
                <Button mode="outlined" onPress={() => {}}>
                  {selectedMonth}
                </Button>
                <ScrollView style={styles.dropdownContainer}>
                  {[...Array(12)].map((_, i) => (
                    <Button
                      key={i}
                      mode={
                        selectedMonth === String(i + 1) ? 'contained' : 'text'
                      }
                      onPress={() => setSelectedMonth(String(i + 1))}
                      style={styles.dropdownItem}
                      labelStyle={styles.dropdownItemLabel}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.dateColumn}>
                <Text variant="bodySmall" style={styles.dateLabel}>
                  Year
                </Text>
                <Button mode="outlined" onPress={() => {}}>
                  {selectedYear}
                </Button>
                <ScrollView style={styles.dropdownContainer}>
                  {[...Array(5)].map((_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <Button
                        key={year}
                        mode={
                          selectedYear === String(year) ? 'contained' : 'text'
                        }
                        onPress={() => setSelectedYear(String(year))}
                        style={styles.dropdownItem}
                        labelStyle={styles.dropdownItemLabel}
                      >
                        {year}
                      </Button>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={confirmDate}
                style={styles.modalButton}
              >
                Confirm
              </Button>
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
  },
  productImage: {
    width: width,
    height: 250,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  cardSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  productName: {
    fontWeight: 'bold',
    color: '#333',
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
  dateSection: {
    marginBottom: 16,
  },
  dateLabel: {
    marginBottom: 8,
    color: '#555',
  },
  dateButton: {
    width: '100%',
  },
  calculateButton: {
    marginTop: 8,
  },
  calculateButtonContent: {
    paddingVertical: 10,
  },
  dateInput: {
    width: '100%',
  },
  priceSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    color: '#555',
  },
  totalPrice: {
    fontWeight: 'bold',
    color: '#E53935',
  },
  checkoutButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
  },
  checkoutButtonContent: {
    paddingVertical: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  dropdownContainer: {
    marginTop: 8,
    maxHeight: 150,
  },
  dropdownItem: {
    paddingVertical: 4,
  },
  dropdownItemLabel: {
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
    color: '#E53935',
  },
});
