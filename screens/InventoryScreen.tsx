import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, RefreshControl, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import EditScreenInfo from '../components/EditScreenInfo';
import InventoryItem from '../components/InventoryItem';
import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const inputs = [
  {
    "id": 1,
    "name": "Cartier ring",
    "purchasePrice": 5780,
    "type": "JEWELRY",
    "description": "Gift from my grandfather",
    "photo": "https://i.ibb.co/znXC7LQ/marcus-lewis-U63z-XX2f7ho-unsplash.jpg",
  },
  {
    "id": 2,
    "name": "Guitar",
    "purchasePrice": 850,
    "type": "MUSIC_INSTRUMENT",
    "photo": "https://i.ibb.co/4dfndL2/louis-hansel-M-d-J-Scwa-LE-unsplash.jpg",
  },
  {
    "id": 3,
    "name": "Lou.Yetu necklace",
    "purchasePrice": 850,
    "type": "MUSIC_INSTRUMENT",
    "photo": "https://i.ibb.co/4dfndL2/louis-hansel-M-d-J-Scwa-LE-unsplash.jpg",
  }
];

export default function InventoryScreen() {
  const colorScheme = useColorScheme();
  const { navigate } = useNavigation();
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [inventoryList, setInvetoryList] = useState(inputs);

  const [loading, setLoading] = useState(true);


  const populateInventory = async () => {
    try {
      //await AsyncStorage.clear()
      const inventories = await AsyncStorage.getItem('inventoryList')
      if (inventories !== null) {
        console.log("using stored values", inventories)
        setInvetoryList(JSON.parse(inventories));
      } else {
        console.log("using dummy values")
        setInvetoryList(inputs)
      }
    } catch (e) {
      Alert.alert("Error", "Inventory List could not be loaded");
    } finally {
      setLoading(false)
    }
  }

  const handleAddInventoryClicked = () => {
    navigate("AddInventorySceen");
  }

  useFocusEffect(
    useCallback(() => {
      populateInventory();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", width, paddingTop: top * 2, justifyContent: "space-between", paddingHorizontal: 20 }}>
        <Text style={styles.title}>Inventory</Text>
        <Ionicons name="add-circle" color={Colors[colorScheme].tint} size={38} onPress={handleAddInventoryClicked} />
      </View>
      {loading ? (<View style={{ justifyContent: "center", alignItems: "center", marginTop: 30 }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 20 }}>Loading Inventories</Text>
      </View>) :
        <FlatList
          data={inventoryList}
          horizontal={false}
          numColumns={2}
          keyExtractor={(item, index) => item?.id}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={populateInventory}
              title="Pull to refresh"
            />
          }
          renderItem={({ item, index }) => (
            <InventoryItem key={index} name={item?.name} purchasePrice={item?.purchasePrice} photo={item?.photo} />
          )} />}
    </View >
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  flatListWrapperStyle: { justifyContent: 'flex-start' },
});
