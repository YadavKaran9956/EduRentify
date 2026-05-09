import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar, List, Divider } from 'react-native-paper';
import { COLORS } from '../../constants/Theme';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../reduxStore/slices/authSlice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
    borderRadius: 8,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.text,
  },
  email: {
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.7,
  },
  sectionCard: {
    marginBottom: 16,
    backgroundColor: COLORS.white,
    elevation: 2,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.text,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: '#E53935',
  },
});

export default function MyProfile({ navigation }: any) {
  const user = useSelector(selectCurrentUser);
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('User from Redux:', user);
  }, [user]);

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    navigation.navigate('EditProfile');
  };

  const handleMyListings = () => {
    // Navigate to my listings screen
    navigation.navigate('MyListings');
  };

  const handleMyRentals = () => {
    // Navigate to my rentals screen
    navigation.navigate('MyRentals');
  };

  // Check if user is a customer (not a seller/landlord)
  const isCustomer = user?.role === 'customer' || user?.userType === 'customer';

  // Get user avatar URL or use placeholder
  const getAvatarSource = () => {
    if (user?.avatar) {
      return { uri: user.avatar };
    }
    return {
      uri: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Avatar.Image
                size={80}
                source={getAvatarSource()}
                style={styles.avatar}
              />
              <Text style={styles.name}>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.name || 'User Name'}
              </Text>
              <Text style={styles.email}>
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </Card>

          {/* Account Actions */}
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Account</Text>
              <List.Item
                title="Edit Profile"
                description="Update your personal information"
                left={props => <List.Icon {...props} icon="account-edit" />}
                onPress={handleEditProfile}
              />
              {!isCustomer && <Divider />}
              {!isCustomer && (
                <List.Item
                  title="My Listings"
                  description="View and manage your item listings"
                  left={props => (
                    <List.Icon {...props} icon="package-variant" />
                  )}
                  onPress={handleMyListings}
                />
              )}
              {!isCustomer && <Divider />}
              <List.Item
                title="My Rentals"
                description="View your rental history"
                left={props => <List.Icon {...props} icon="history" />}
                onPress={handleMyRentals}
              />
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
