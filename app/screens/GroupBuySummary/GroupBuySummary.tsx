import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import GroupBuyServices from '../../services/GroupBuyServices';
import { GroupBuySummaryNavigationProp, GroupBuySummaryRouteProp } from '../../types/Navigations';
import { Contribution } from '../../types/GroupBuyTypes';
import { useFocusEffect } from '@react-navigation/native';

type Props = {
    navigation: GroupBuySummaryNavigationProp;
    route: GroupBuySummaryRouteProp;
};

const GroupBuySummary = ({ navigation, route }: Props) => {
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadGroupBuyDetails = async () => {
                setIsLoading(true);
                try {
                    const data = await GroupBuyServices.fetchGroupBuy(route.params.groupBuyID);
                    if (data) {
                        setContributions(data.contributions);
                    }
                } catch (err) {
                    console.error('Failed to load GroupBuy details.', err);
                } finally {
                    setIsLoading(false);
                }
            };

            loadGroupBuyDetails();
        }, [])
    );

    if (isLoading) {
        return (
            <View className="flex-1 justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View>
            {contributions.map(c => <Text key={c.userUID}>{c.userUID}: {c.amount}</Text>)}
        </View>
    );
};

const styles = StyleSheet.create({});

export default GroupBuySummary;