import { View, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

import { GroupBuyListNavigationProp } from '../../types/Navigations';

import { GROUP_BUY_TEST_DATA } from './test/GroupBuyTest';
import GroupBuyCard from './components/GroupBuyCard';
import GroupBuyListHeader from './components/GroupBuyListHeader';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { database } from '../../firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

const LIMIT = 10;

type Props = {
    navigation: GroupBuyListNavigationProp;
}

const GroupBuyList = ({ navigation }: Props) => {
    const { user } = useAuth();

    const [items, setItems] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastVisible, setLastVisible] = useState<any>(null);

    const isFocused = useIsFocused();

    const fetchInitial = async () => {
        setRefreshing(true);
        const q = query(
            collection(database, 'groupBuys'),
            orderBy('createdAt', 'desc'),
            limit(LIMIT)
        );
        const snapshot = await getDocs(q);
        const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setItems(newData);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === LIMIT);
        setRefreshing(false);
    };

    const fetchMore = async () => {
        if (loadingMore || refreshing || !hasMore || !lastVisible) return;
        setLoadingMore(true);

        const q = query(
            collection(database, 'groupBuys'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(LIMIT)
        );
        const snapshot = await getDocs(q);
        const newData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setItems(prev => [...prev, ...newData]);
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === LIMIT);
        setLoadingMore(false);
    };

    useEffect(() => {
        fetchInitial();
    }, []);

    useEffect(() => {
        if (isFocused) {
            setItems([]);
            fetchInitial();
        }
    }, [isFocused]);

    return (
        <View className="flex-1">
            <FlatList
                contentContainerClassName="justify-center px-6"
                ListHeaderComponent={GroupBuyListHeader}
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <GroupBuyCard
                        groupBuyID={item.id}
                        onPress={() => navigation.navigate('GroupBuy', { groupBuyID: item.id })}
                    />
                }
                refreshing={refreshing}
                onRefresh={fetchInitial}
                onEndReached={fetchMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
            />
        </View>
    );
};

export default GroupBuyList;