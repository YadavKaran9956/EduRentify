import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  Checkbox,
  IconButton,
  Surface,
  Appbar,
} from 'react-native-paper';
import { COLORS } from '../../constants/Theme';

const { width } = Dimensions.get('window');

interface PricingOption {
  id: string;
  type: 'hourly' | 'daily' | 'weekly' | 'monthly';
  label: string;
  price: string;
  selected: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.muted,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
    borderRadius: 8,
  },
  label: {
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.text,
    fontSize: 16,
  },
  input: {
    backgroundColor: COLORS.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  pricingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pricingLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    width: 80,
    height: 40,
    marginRight: 8,
  },
  rupeeSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  deleteButton: {
    margin: 0,
    marginLeft: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  imagePlaceholder: {
    width: (width - 32 - 24) / 3,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    elevation: 1,
  },
  addImageButton: {
    width: (width - 32 - 24) / 3,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
  },
  submitButtonContent: {
    paddingVertical: 12,
  },
});

export default function AddItems({ navigation }: any) {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productLocation, setProductLocation] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([
    { id: '1', type: 'hourly', label: 'Hourly', price: '', selected: false },
    { id: '2', type: 'daily', label: 'Daily', price: '', selected: false },
    { id: '3', type: 'weekly', label: 'Weekly', price: '', selected: false },
    { id: '4', type: 'monthly', label: 'Monthly', price: '', selected: false },
  ]);

  const handlePricingToggle = (id: string) => {
    setPricingOptions(prev =>
      prev.map(option =>
        option.id === id ? { ...option, selected: !option.selected } : option,
      ),
    );
  };

  const handlePriceChange = (id: string, price: string) => {
    setPricingOptions(prev =>
      prev.map(option => (option.id === id ? { ...option, price } : option)),
    );
  };

  const removePricingOption = (id: string) => {
    setPricingOptions(prev => prev.filter(option => option.id !== id));
  };

  const handleImageUpload = () => {
    if (productImages.length >= 3) {
      Alert.alert('Maximum 3 images allowed');
      return;
    }
    // Placeholder for image upload logic
    Alert.alert(
      'Image Upload',
      'Image upload functionality would be implemented here',
    );
  };

  const removeImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!productName.trim()) {
      Alert.alert('Error', 'Please enter product name');
      return;
    }
    if (!productDescription.trim()) {
      Alert.alert('Error', 'Please enter product description');
      return;
    }
    if (!productLocation.trim()) {
      Alert.alert('Error', 'Please enter product location');
      return;
    }

    const selectedPricing = pricingOptions.filter(
      opt => opt.selected && opt.price,
    );
    if (selectedPricing.length === 0) {
      Alert.alert('Error', 'Please add at least one pricing option');
      return;
    }

    // Form submission logic would go here
    Alert.alert('Success', 'Item listed successfully!');
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Item" />
      </Appbar.Header>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Product Name */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.label}>
                Product Name *
              </Text>
              <TextInput
                mode="outlined"
                value={productName}
                onChangeText={setProductName}
                placeholder="Enter product name"
                style={styles.input}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
              />
            </Card.Content>
          </Card>

          {/* Product Description */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.label}>
                Product Description *
              </Text>
              <TextInput
                mode="outlined"
                value={productDescription}
                onChangeText={setProductDescription}
                placeholder="Describe your product in detail..."
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textArea]}
                outlineColor={COLORS.primary}
                activeOutlineColor={COLORS.primary}
                selectionColor={COLORS.primary}
              />
            </Card.Content>
          </Card>

          {/* Product Pricing */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.label}>
                  Product Pricing *
                </Text>
              </View>

              {pricingOptions.map(option => (
                <View key={option.id} style={styles.pricingRow}>
                  <View style={styles.pricingLeft}>
                    <Checkbox
                      status={option.selected ? 'checked' : 'unchecked'}
                      onPress={() => handlePricingToggle(option.id)}
                    />
                    <Text style={styles.pricingLabel}>{option.label}</Text>
                  </View>
                  {option.selected && (
                    <View style={styles.priceInputContainer}>
                      <TextInput
                        mode="outlined"
                        value={option.price}
                        onChangeText={text =>
                          handlePriceChange(option.id, text)
                        }
                        placeholder="0"
                        keyboardType="numeric"
                        style={styles.priceInput}
                      />
                      <Text style={styles.rupeeSymbol}>₹</Text>
                      {pricingOptions.length > 4 && (
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => removePricingOption(option.id)}
                          style={styles.deleteButton}
                        />
                      )}
                    </View>
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>

          {/* Product Images */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.label}>
                Product Images (Max 3)
              </Text>
              <View style={styles.imageContainer}>
                {productImages.map((_, index) => (
                  <Surface key={index} style={styles.imagePlaceholder}>
                    <Text>Image {index + 1}</Text>
                    <IconButton
                      icon="close"
                      size={16}
                      onPress={() => removeImage(index)}
                      style={styles.removeImageButton}
                    />
                  </Surface>
                ))}
                {productImages.length < 3 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={handleImageUpload}
                  >
                    <IconButton icon="camera" size={32} />
                    <Text variant="bodySmall">Add Image</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card.Content>
          </Card>

          {/* Product Location */}
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.label}>
                Product Location *
              </Text>
              <TextInput
                mode="outlined"
                value={productLocation}
                onChangeText={setProductLocation}
                placeholder="Enter product location"
                style={styles.input}
              />
            </Card.Content>
          </Card>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
          >
            List Item
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
