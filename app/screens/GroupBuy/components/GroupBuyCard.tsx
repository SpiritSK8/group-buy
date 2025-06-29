import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, Text, ActivityIndicator } from 'react-native';

import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';

import { GroupBuyDetails } from '../../../types/GroupBuyTypes';
import { Colors } from '../../../constants/Colors';

type Props = {
    groupBuyID: string,
    onPress?: () => void
}

const GroupBuyCard = ({ groupBuyID, onPress }: Props) => {
    const [title, setTitle] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [numParticipants, setNumParticipants] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [target, setTarget] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

    });

    // if (isLoading) {
    //     return <LoadingGroupBuyCard />;
    // }

    return (
        <View className="self-center bg-white mt-10 w-full px-4 py-5 rounded-2xl shadow">
            <View className="flex-row mb-5">
                <Image source={require('../../../assets/favicon.png')} className="mr-5"></Image>

                <View>
                    <Text className="text-xl font-bold mb-1">Ice Cream buy 1 get 1 #{groupBuyID}</Text>

                    <View className="flex-1 flex-row">
                        <View className="flex-row items-center mr-4">
                            <Ionicons name="location-outline" size={16} color="#888888" />
                            <Text className="text-gray-500 ml-1">Tampines Mall</Text>
                        </View>

                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#888888" />
                            <Text className="text-gray-500 ml-1">2d 5h</Text>
                        </View>

                    </View>

                </View>

            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-1">Participants: 6/8</Text>
                <View className="flex-row">
                    <Progress.Bar
                        progress={0.75}
                        height={8}
                        width={null}
                        color={Colors.secondary}
                        unfilledColor="#DDDDDD"
                        borderWidth={0}
                        className="flex-1" />
                </View>
            </View>

            <View className="mb-10">
                <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-600">Total: $234.50</Text>
                    <Text className="text-gray-600">Target: $300</Text>
                </View>
                <View className="flex-row">
                    <Progress.Bar
                        progress={0.75}
                        height={8}
                        width={null}
                        color={Colors.primary}
                        unfilledColor="#DDDDDD"
                        borderWidth={0}
                        className="flex-1" />
                </View>
            </View>

            <TouchableOpacity
                onPress={onPress}
                className="w-full p-3 rounded-2xl items-center"
                style={{ backgroundColor: Colors.primary }}>
                <Text className="font-semibold text-l text-white">Join GroupBuy</Text>
            </TouchableOpacity>
        </View>
    );
};

const LoadingGroupBuyCard = () => {
    return (
        <View className="self-center bg-white mt-10 w-full h-60 px-4 py-5 rounded-2xl shadow justify-center">
            <View className="flex-row mb-12 mr-16">
                <Progress.Bar
                    indeterminate={true}
                    height={12}
                    width={null}
                    color="#AAAAAA"
                    unfilledColor="#DDDDDD"
                    borderWidth={0}
                    className="flex-1"
                />

            </View>

            <View className="mb-8">
                <View className="flex-row">
                    <Progress.Bar
                        indeterminate={true}
                        indeterminateAnimationDuration={700}
                        height={8}
                        width={null}
                        color="#AAAAAA"
                        unfilledColor="#DDDDDD"
                        borderWidth={0}
                        className="flex-1" />
                </View>
            </View>

            <View className="mb-8">
                <View className="flex-row">
                    <Progress.Bar
                        indeterminate={true}
                        indeterminateAnimationDuration={900}
                        height={8}
                        width={null}
                        color="#AAAAAA"
                        unfilledColor="#DDDDDD"
                        borderWidth={0}
                        className="flex-1" />
                </View>
            </View>
        </View>
    );
}

export default GroupBuyCard;