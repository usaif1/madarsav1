import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Share,
  Platform,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';

// App icon-contacts
import AppIcon from '@/assets/app_icon.svg';

interface Contact {
  id: string;
  name: string;
  imageUrl?: string;
  phoneNumber?: string;
  email?: string;
}

// Mock contacts for UI demonstration
const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Phillip Philips', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '2', name: 'Tatiana Bergson', imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '3', name: 'Gustavo Torff', imageUrl: 'https://randomuser.me/api/portraits/men/62.jpg' },
  { id: '4', name: 'Hanna Botosh', imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg' },
];

interface ShareModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isVisible, onClose }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  // Set mock contacts when modal becomes visible
  useEffect(() => {
    if (isVisible) {
      // In a real implementation, we would check permissions and fetch contacts
      // For now, we'll use mock data
      setContacts(MOCK_CONTACTS);
      setPermissionStatus(RESULTS.GRANTED);
    }
  }, [isVisible]);

  // Share app with a specific contact
  const shareWithContact = async (contact: Contact) => {
    try {
      const message = `Hey ${contact.name.split(' ')[0]}, check out this amazing Islamic app called Madrasa!`;
      const url = 'https://madrasa-app.com/download'; // Replace with actual app URL
      
      await Share.share({
        message: `${message}\n${url}`,
        title: 'Madrasa App',
      });
      
      // Close modal after sharing
      onClose();
    } catch (error) {
      console.error('Error sharing with contact:', error);
    }
  };

  // Share app using system share dialog
  const shareApp = async () => {
    try {
      const message = 'Check out this amazing Islamic app called Madrasa!';
      const url = 'https://madrasa-app.com/download'; // Replace with actual app URL
      
      await Share.share({
        message: `${message}\n${url}`,
        title: 'Madrasa App',
      });
      
      // Close modal after sharing
      onClose();
    } catch (error) {
      console.error('Error sharing app:', error);
    }
  };

  // Render contact item
  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={styles.contactItem} 
      onPress={() => shareWithContact(item)}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.contactImage} />
      ) : (
        <View style={styles.contactImagePlaceholder}>
          <Text style={styles.contactInitial}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.contactName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.appInfo}>
            <View style={styles.appIconContainer}>
              <AppIcon width={40} height={40} />
            </View>
            <View>
              <Text style={styles.appName}>Madrasa App</Text>
              <Text style={styles.appSubtitle}>2025-2026 Madrasa. All Right Registered</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contactsContainer}>
          {contacts.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Share with</Text>
              <FlatList
                data={contacts}
                renderItem={renderContactItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.contactsList}
              />
            </>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No contacts to display</Text>
            </View>
          )}
        </View>
        
        <View style={styles.shareOptions}>
          <View style={styles.shareRow}>
            <TouchableOpacity style={styles.shareOption} onPress={shareApp}>
              <View style={styles.shareIconContainer}>
                <Icon name="wifi-tethering" size={28} color="#007AFF" />
              </View>
              <Text style={styles.shareOptionText}>AirDrop</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareOption} onPress={shareApp}>
              <View style={styles.shareIconContainer}>
                <Icon name="chat-bubble" size={28} color="#65C466" />
              </View>
              <Text style={styles.shareOptionText}>Messages</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareOption} onPress={shareApp}>
              <View style={styles.shareIconContainer}>
                <Icon name="email" size={28} color="#3478F6" />
              </View>
              <Text style={styles.shareOptionText}>Mail</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareOption} onPress={shareApp}>
              <View style={styles.shareIconContainer}>
                <Icon name="note" size={28} color="#FFCC00" />
              </View>
              <Text style={styles.shareOptionText}>Notes</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.indicator} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8A57DC',
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactsContainer: {
    paddingVertical: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  contactsList: {
    paddingHorizontal: 12,
  },
  contactItem: {
    alignItems: 'center',
    marginHorizontal: 4,
    width: 70,
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  contactImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactInitial: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8A57DC',
  },
  contactName: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000000',
  },
  shareOptions: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  shareOption: {
    alignItems: 'center',
    width: 80,
  },
  shareIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  shareOptionText: {
    fontSize: 12,
    color: '#000000',
    marginTop: 4,
  },
  permissionButton: {
    backgroundColor: '#8A57DC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default ShareModal;
