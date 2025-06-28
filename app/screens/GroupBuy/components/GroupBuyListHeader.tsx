import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { Colors } from "../../../constants/Colors";

export const GroupBuyListHeader = () => {
    return (
        <View className="items-center">
            <View className="p-5 rounded-2xl mt-12 mb-8 justify-center items-center" style={{ backgroundColor: Colors.primary }}>
                <Ionicons name="people" size={32} color="#FFFFFF"></Ionicons>
            </View>
            <Text className="font-bold text-4xl mb-3">Join GroupBuys</Text>
            <Text className="text-gray-600">Connect with others to save on bulk purchases</Text>
        </View>
    );
};