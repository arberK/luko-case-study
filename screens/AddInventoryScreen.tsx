import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';


const ADD_ICON_SIZE = 150;
const DEL_ICON_SIZE = 32;

export default function AddInventory() {
  const { goBack } = useNavigation();
  const colorScheme = useColorScheme();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const [photo, setPhoto] = useState<string | undefined>();

  const [name, setName] = useState<string>();
  const nameRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState<string>();
  const categoryRef = useRef(null);

  const [purchasePrice, setPurchasePrice] = useState<string>();
  const purchasePriceRef = useRef(null);
  const [purchasePriceError, setPurchasePriceError] = useState<string | null>(null);

  const [description, setDescription] = useState<string>();
  const descriptionRef = useRef(null);

  const [addDisabled, setAddDisabled] = useState<boolean>(true)

  const [cameraPermissions, requestPermission] = ImagePicker.useCameraPermissions();

  const takePhoto = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        base64: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.2,
      });

      if (!result.cancelled) {
        setPhoto('data:image/png;base64,' + result.base64);
      }
    } catch (error) {
      Alert.alert("Error", JSON.stringify(error))
    }

  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
    });

    if (!result.cancelled) {
      setPhoto('data:image/png;base64,' + result.base64);
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  }

  const handleAddInventory = async () => {
    try {
      const newItem = {
        name,
        purchasePrice,
        type: selectedCategory,
        description,
        photo
      }

      let invetoryList: any = [];
      const value = await AsyncStorage.getItem('inventoryList')
      if (value !== null) {
        invetoryList = JSON.parse(value);
      }
      invetoryList.push(newItem)
      const newInventoryList = JSON.stringify(invetoryList)
      await AsyncStorage.setItem('inventoryList', newInventoryList)
      console.log("inventory Added")
      goBack()
    } catch (e) {
      Alert.alert("Error", "Error adding new Inventory!")
    }
  }

  const handleChoosePhotoSource = () => {
    Alert.alert("Photo source", "Choose the source of the photo?", [{ text: "Camera", onPress: takePhoto }, { text: "Gallery", onPress: pickImage }])
  }

  useEffect(() => {
    if (purchasePrice) {
      if (isNaN(purchasePrice)) {
        setPurchasePriceError("Letters are not allowed")
        setAddDisabled(true)
        return
      } else if (parseFloat(purchasePrice) > 40000) {
        setPurchasePriceError("Purchase Price should be less than 40,000€")
        setAddDisabled(true)
        return
      }
    }

    if (name != null && selectedCategory != null && purchasePrice != null && photo != null) {
      setAddDisabled(false)
      setPurchasePriceError(null)
    } else {
      setAddDisabled(true);
      setPurchasePriceError(null)
    }
  }, [name, selectedCategory, purchasePrice, photo, description]);



  useEffect(() => {
    const getCameraPermissions = async () => {
      const permissions = await requestPermission();
      if (!permissions?.granted) {
        Alert.alert("Error", "Permissions not granted", [{ text: "Open Settings", onPress: handleOpenSettings }])
      }
    }

    getCameraPermissions();

  }, []);


  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled >
      <View style={{ marginTop: photo != null ? 50 : 0, flexDirection: "row", justifyContent: "space-between" }}>
        <Button title='Cancel' onPress={goBack} color={Colors[colorScheme].tint}></Button>
        <Button title='Add' disabled={addDisabled} onPress={handleAddInventory} color={addDisabled ? "gray" : Colors[colorScheme].tint}></Button>
      </View>
      <ScrollView  >
        {cameraPermissions?.granted === false ? (
          <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>
            <Text>Grant camera permission</Text>
            <Button title='Open Settings' onPress={handleOpenSettings} color={Colors[colorScheme].tint}></Button>
          </View>) :
          (
            <TouchableOpacity style={styles.addPhotoContainer} onPress={handleChoosePhotoSource}>
              {photo != null ?
                <View>
                  <Image source={{ uri: photo }} style={{ width: ADD_ICON_SIZE, height: ADD_ICON_SIZE, borderRadius: ADD_ICON_SIZE / 2 }} />
                  <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: '#D95762', width: DEL_ICON_SIZE, height: DEL_ICON_SIZE, borderRadius: DEL_ICON_SIZE / 2, justifyContent: "center", alignItems: "center" }}>
                    <Ionicons name="ios-trash" color={'#ffff'} size={18} />
                  </View>
                </View>
                :
                <>
                  <Ionicons name="camera" color={Colors[colorScheme].tint} size={38} />
                  <Text style={{ fontWeight: "bold", marginTop: 14 }}>Add photo</Text>
                </>
              }
            </TouchableOpacity>
          )
        }
        <Text style={styles.label}>Name</Text>
        <TextInput placeholder='Bracelet' value={name} ref={nameRef} onChangeText={setName} style={styles.txtInputStyle} returnKeyType="next" onSubmitEditing={() => categoryRef.current.focus()}></TextInput>
        <Text style={styles.label}>Category</Text>
        <TextInput placeholder='Select a category...' value={selectedCategory} ref={categoryRef} onChangeText={setSelectedCategory} keyboardType='numbers-and-punctuation' style={styles.txtInputStyle} returnKeyType="next" onSubmitEditing={() => purchasePriceRef.current.focus()}></TextInput>
        <Text style={styles.label}>Value</Text>
        <TextInput placeholder='700' value={purchasePrice} ref={purchasePriceRef} onChangeText={setPurchasePrice} keyboardType='numbers-and-punctuation' style={styles.txtInputStyle} returnKeyType="next" onSubmitEditing={() => descriptionRef.current.focus()}></TextInput>
        {purchasePriceError && <Text style={styles.error}>{purchasePriceError}</Text>}
        <Text style={styles.label}>Description</Text>
        <TextInput placeholder='Optional' multiline={true} ref={descriptionRef} value={description} onChangeText={setDescription} style={{ ...styles.txtInputStyle, height: 128 }}></TextInput>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </ScrollView>
    </KeyboardAvoidingView >
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtInputStyle: {
    backgroundColor: "white",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#EAE9E3'
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2C2302",
    marginBottom: 5,
    marginTop: 20,
  },
  error: {
    color: "#D95762"
  },
  addPhotoContainer: {
    alignSelf: "center",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    borderWidth: 2,
    borderColor: "#EAE9E3",
    borderStyle: "dashed",
    borderRadius: ADD_ICON_SIZE / 2,
    height: ADD_ICON_SIZE,
    width: ADD_ICON_SIZE,
  },
});
