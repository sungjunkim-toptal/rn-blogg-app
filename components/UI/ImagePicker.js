import React, { useState, useEffect } from 'react';
import { View, Button, Text, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import Colors from '../../constants/Colors';

const ImgPicker = props => {
  const [pickedImage, setPickedImage] = useState();

  const { imageUrl } = props;
  useEffect(() => {
    if (imageUrl !== '') {
      setPickedImage(imageUrl);
    }
  }, [imageUrl]);

  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );
    if (result.status !== 'granted') {
      Alert.alert(
        'Insufficient permissions!',
        'You need to grant camera permissions to use this app.',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };
  const takeOrPickImageHandler = async isTake => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    let image;
    if (isTake) {
      image = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });
    } else {
      image = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5,
      });
    }
    // console.log(image);
    setPickedImage(image.uri);
    props.onImageTaken(image.uri);
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title='Take an image'
          color={Colors.primary}
          onPress={() => takeOrPickImageHandler(true)}
        />
        <Button
          title='Pick an image'
          color={Colors.primary}
          onPress={() => takeOrPickImageHandler(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginVertical: 15,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});

export default ImgPicker;
