import { View, Text, Button } from 'react-native';
import React from 'react';

import { GroupBuyListNavigationProp } from '../../types/Navigations';

type Props = {
    navigation: GroupBuyListNavigationProp;
}

const GroupBuyList = ({ navigation }: Props) => {
    return (
        <View className='flex-1 items-center'>
            <Text>GroupBuy List</Text>
            <Button title="Go to GroupBuy" onPress={() => { navigation.navigate('GroupBuy', { groupBuyId: "1" }) }} />
        </View>
    );
};

export default GroupBuyList;