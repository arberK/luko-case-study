import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { shadow } from "../styles/shadow";
import { Text, View } from "./Themed";

interface InventoryItemType {
    name: string;
    purchasePrice: number;
    photo: string;
}
export default function InventoryItem(props: InventoryItemType) {
    return (
        <TouchableOpacity activeOpacity={0.7} >
            <View style={styles.inventoryContainer}>
                <Image
                    style={{
                        flex: 3,
                        borderTopLeftRadius: 14,
                        borderTopRightRadius: 14,
                        width: undefined,
                        height: undefined,
                    }}
                    source={{
                        uri: props.photo,
                    }}
                />
                <View style={{
                    flex: 2, justifyContent: "space-around", paddingHorizontal: 15, backgroundColor: "#FFFFFF", borderBottomLeftRadius: 14,
                    borderBottomRightRadius: 14,
                }}>
                    <Text style={styles.inventoryTitle}>{props.name}</Text>
                    <Text style={styles.inventoryPrice}>{formatPrice(props.purchasePrice)}</Text>
                </View>
            </View>
        </TouchableOpacity>);
}

const formatPrice = (price: number) => {
    return '€' + price?.toLocaleString('co-FR');;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inventoryContainer: {
        width: 157,
        height: 265,
        margin: 15,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        ...shadow(5)
    },
    inventoryTitle: {
        fontWeight: "bold",
        color: "#2C2302",
        fontSize: 19,
    },
    inventoryPrice: {
        color: "#6B6651",
        fontSize: 15,
    },
});
