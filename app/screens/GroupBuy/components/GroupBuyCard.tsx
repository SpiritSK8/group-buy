import { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, Text, ActivityIndicator, Alert } from 'react-native';

import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';

import { GroupBuyDetails } from '../../../types/GroupBuyTypes';
import { Deal } from '../../../types/Deal';
import { Colors } from '../../../constants/Colors';
import DealsServices from '../../../services/DealsServices';
import GroupBuyServices from '../../../services/GroupBuyServices';
import { useAuth } from '../../../context/AuthContext';

type Props = {
    groupBuyID: string,
    onPress?: () => void
}

const GroupBuyCard = ({ groupBuyID, onPress }: Props) => {
    const { user } = useAuth();

    const [groupBuy, setGroupBuy] = useState<GroupBuyDetails | null>(null);
    const [deal, setDeal] = useState<Deal | null>(null);
    const [hasJoined, setHasJoined] = useState(false);

    const [title, setTitle] = useState<string>('Title');
    const [location, setLocation] = useState<string>('Location');
    const [endTime, setEndTime] = useState<string>('End Time');
    const [numParticipants, setNumParticipants] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [target, setTarget] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const fetchedGroupBuy = await GroupBuyServices.fetchGroupBuy(groupBuyID);
                if (!fetchedGroupBuy) {
                    setIsLoading(false);
                    return;
                }

                let isUserIn = false;
                if (user?.uid) {
                    isUserIn = await GroupBuyServices.isUserInGroupBuy(user.uid, fetchedGroupBuy.id);
                }

                const fetchedDeal = await DealsServices.fetchDeal(fetchedGroupBuy.dealID);

                setGroupBuy(fetchedGroupBuy);
                setDeal(fetchedDeal);
                setHasJoined(isUserIn);

                setIsLoading(false);
            } catch (error: any) {
                console.error(error.message);
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    if (isLoading) {
        return <LoadingGroupBuyCard />;
    }

    if (!groupBuy || !deal) {
        return (
            <View className="self-center bg-white mt-10 w-full h-60 px-4 py-5 rounded-2xl shadow">
                <Text>Failed to fetch data.</Text>
            </View>
        );
    }

    return (
        <View className="self-center bg-white mt-10 w-full px-4 py-5 rounded-2xl shadow">
            <View className="flex-row mb-5 w-full">
                <Image source={require('../../../assets/favicon.png')} className="mr-5"></Image>

                <View className="flex-1">
                    <Text className="text-xl font-bold mb-1" numberOfLines={1} ellipsizeMode="tail">{deal.dealName}</Text>

                    <View className="flex-1 flex-row">
                        <View className="flex-row items-center mr-4">
                            <Ionicons name="location-outline" size={16} color="#888888" />
                            <Text className="text-gray-500 ml-1">{deal.dealStore}</Text>
                        </View>

                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#888888" />
                            <Text className="text-gray-500 ml-1">{deal.dealExpiry}</Text>
                        </View>

                    </View>

                </View>

            </View>

            <View className="mb-4">
                <Text className="text-gray-600 mb-1">Participants: {groupBuy.participants.length}</Text>
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
                    <Text className="text-gray-600">Total: ${total}</Text>
                    <Text className="text-gray-600">Target: ${target}</Text>
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

            {hasJoined ?
                <View className="w-full p-3 rounded-2xl items-center bg-gray-400">
                    <Text className="text-l text-white">You have joined this GroupBuy</Text>
                </View>
                :
                <TouchableOpacity
                    onPress={onPress}
                    className="w-full p-3 rounded-2xl items-center"
                    style={{ backgroundColor: Colors.primary }}>
                    <Text className="font-semibold text-l text-white">Join GroupBuy</Text>
                </TouchableOpacity>
            }
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