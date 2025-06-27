import { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, Text } from "react-native";

import { GroupBuyDetails } from "../../../types/GroupBuyTypes";

type Props = {
    groupBuyId: string,
    onPress?: () => void
}

const GroupBuyCard = ({ groupBuyId, onPress }: Props) => {
    const [groupBuyDetails, setGroupBuyDetails] = useState({});

    useEffect(() => {

    });

    return (
        <TouchableOpacity onPress={onPress}>
            <View className="self-center bg-white flex-row mt-10 h-60 w-10/12 p-4 rounded-xl shadow">
                <Image source={require('../../../assets/favicon.png')} className="mr-5"></Image>
                <View>
                    <Text className="text-xl">{groupBuyId}</Text>
                    <Text className="font-light">Buy 1 get 1 free!</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default GroupBuyCard;