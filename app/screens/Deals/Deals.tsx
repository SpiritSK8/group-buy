import React, { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Button
} from 'react-native';
import { Deal } from '../../types/Deal';
import { calculateSavings } from '../../utils/calculateSavings';
import { DealCard } from './components/DealCard';
import { DealsHomeNavigationProp } from '../../types/Navigations';
import DealsServices from '../../services/DealsServices';

type Props = {
  navigation: DealsHomeNavigationProp;
};

const Deals: React.FC<Props> = ({ navigation }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
        let isActive = true;
        setLoading(true);

    const loadDeals = async () => {
      try {
        const fetched = await DealsServices.fetchDeals();
        setDeals(fetched);
      } catch (err) {
        console.error('Failed to load deals', err);
      } finally {
        setLoading(false);
      }
    };
    loadDeals();

    return () => {
        isActive = false;
      };
      
  }, []));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // now you have your deals array
  const topSavingsDeals = [...deals].sort(
    (a, b) => calculateSavings(b) - calculateSavings(a)
  );

  return (
    <ScrollView style={styles.container}>
    <View style={styles.buttonContainer}>
      <Button
        title="＋ Create New Deal"
        onPress={() => navigation.navigate('NewDealForm')}
      />
    </View>
      <Text style={styles.header}>💰 Top Savings</Text>
      {topSavingsDeals.map(deal => (
        <DealCard
          key={deal.dealID}
          deal={deal}
          onPress={() =>
            navigation.navigate('DealContributionForm', { deal })
          }
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
    buttonContainer: {
        marginBottom: 16,
        alignSelf: 'stretch',
    },
});

export default Deals;
