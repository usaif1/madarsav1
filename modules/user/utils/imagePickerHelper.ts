import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';
import { Alert, PermissionsAndroid, Platform, Linking } from 'react-native';

export interface ImagePickerResult {
  uri: string;
  type: string;
  name: string;
}

export class ImagePickerHelper {
  static async requestCameraPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS permissions are handled automatically
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  static async requestStoragePermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        // For Android 13+ (API level 33+), we need to request READ_MEDIA_IMAGES
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Photo Permission',
              message: 'This app needs access to your photos to select profile pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          // For Android 12 and below, we need READ_EXTERNAL_STORAGE
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'This app needs access to your storage to select photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }
      return true; // iOS permissions are handled automatically
    } catch (error) {
      console.error('Error requesting storage permissions:', error);
      return false;
    }
  }

  static async captureImage(): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestCameraPermissions();
      if (!hasPermission) {
        return null;
      }

      return new Promise((resolve) => {
        const options = {
          mediaType: 'photo' as MediaType,
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
          quality: 0.8 as PhotoQuality,
        };

        launchCamera(options, (response: ImagePickerResponse) => {
          if (response.didCancel) {
            resolve(null);
            return;
          }

          if (response.errorMessage) {
            console.error('Camera error:', response.errorMessage);
            resolve(null);
            return;
          }

          if (response.assets && response.assets[0]) {
            resolve(this.formatImageResult(response.assets[0]));
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Error capturing image:', error);
      return null;
    }
  }

  static async pickImageFromGallery(): Promise<ImagePickerResult | null> {
    try {
      const hasPermission = await this.requestStoragePermissions();
      if (!hasPermission) {
        return null;
      }

      return new Promise((resolve) => {
        const options = {
          mediaType: 'photo' as MediaType,
          includeBase64: false,
          maxHeight: 2000,
          maxWidth: 2000,
          quality: 0.8 as PhotoQuality,
        };

        launchImageLibrary(options, (response: ImagePickerResponse) => {
          if (response.didCancel) {
            resolve(null);
            return;
          }

          if (response.errorMessage) {
            console.error('Gallery error:', response.errorMessage);
            resolve(null);
            return;
          }

          if (response.assets && response.assets[0]) {
            resolve(this.formatImageResult(response.assets[0]));
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  }

  static async showImagePickerOptions(): Promise<ImagePickerResult | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Image',
        'Choose how you want to select an image',
        [
          {
            text: 'Camera',
            onPress: async () => {
              const image = await this.captureImage();
              resolve(image);
            },
          },
          {
            text: 'Gallery',
            onPress: async () => {
              const image = await this.pickImageFromGallery();
              resolve(image);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ],
        { cancelable: true, onDismiss: () => resolve(null) }
      );
    });
  }

  private static formatImageResult(asset: any): ImagePickerResult {
    const fileName = asset.fileName || asset.uri.split('/').pop() || `image_${Date.now()}.jpg`;
    const uriParts = fileName.split('.');
    const fileExtension = uriParts[uriParts.length - 1].toLowerCase();
    
    let mimeType = asset.type || 'image/jpeg';
    if (!mimeType.startsWith('image/')) {
      switch (fileExtension) {
        case 'png':
          mimeType = 'image/png';
          break;
        case 'gif':
          mimeType = 'image/gif';
          break;
        case 'webp':
          mimeType = 'image/webp';
          break;
        default:
          mimeType = 'image/jpeg';
      }
    }

    return {
      uri: asset.uri,
      type: mimeType,
      name: fileName,
    };
  }
}