import { View, Text } from 'react-native';
import React, { useLayoutEffect } from 'react';

import { GroupBuyNavigationProp, GroupBuyRouteProp } from '../../types/Navigations';

type Props = {
    navigation: GroupBuyNavigationProp;
    route: GroupBuyRouteProp;
}

const GroupBuy = ({ navigation, route }: Props) => {
    useLayoutEffect(() => {
        navigation.setOptions({title: 'GroupBuy #' + route.params.groupBuyID});
    });

    return (
        <View>
            <Text>GroupBuy</Text>
        </View>
    );
};

export default GroupBuy;