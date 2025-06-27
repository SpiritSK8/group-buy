import { View, FlatList } from 'react-native';
import React from 'react';

import { GroupBuyListNavigationProp } from '../../types/Navigations';

import { GROUP_BUY_TEST_DATA } from './test/GroupBuyTest';
import GroupBuyCard from './components/GroupBuyCard';

type Props = {
    navigation: GroupBuyListNavigationProp;
}

const GroupBuyList = ({ navigation }: Props) => {
    return (
        <View className="flex-1 w-full">
            <FlatList
                data={GROUP_BUY_TEST_DATA}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <GroupBuyCard
                        groupBuyId={item.id}
                        onPress={() => navigation.navigate('GroupBuy', { groupBuyId: item.id })}
                    />
                }
            />
        </View>
    );
};

export default GroupBuyList;