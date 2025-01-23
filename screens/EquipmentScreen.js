import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useGetEquipmentQuery } from '../api/authApi';
import { useNavigation } from '@react-navigation/native';

const EquipmentScreen = () => {
  const { data, error, isLoading, refetch } = useGetEquipmentQuery();
  const navigation = useNavigation();

  useEffect(() => {
    refetch();
  }, []);

  const calculateNextInspectionDate = (lastDate, interval) => {
    const date = new Date(lastDate);
    switch (interval) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        return 'Unknown';
    }
    return date.toISOString().split('T')[0];
  };

  const renderStatus = (status) => {
    const isOutOfService = status === 'out_of_service';
    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: isOutOfService ? '#d9534f' : '#28a745' },
        ]}
      >
        <Text style={styles.statusText}>
          {isOutOfService ? 'OUT OF SERVICE' : 'IN SERVICE'}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('EquipmentDetail', { id: item.id })
      }
    >
      <Image source={{ uri: item.photos }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.manufacturer}>{item.manufacturer.name}</Text>

        <Text style={styles.info}>
          Serial: <Text style={styles.infoValue}>{item.serial_number}</Text>
        </Text>
        <Text style={styles.info}>
          Assigned to:{' '}
          <Text style={styles.infoValue}>
            {item.assigned_worker.first_name} {item.assigned_worker.last_name}
          </Text>
        </Text>
        <Text style={styles.info}>
          Last Inspected:{' '}
          <Text style={styles.infoValue}>{item.last_inspection_date}</Text>
        </Text>

        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.info}>
              Next Inspection Date:{' '}
              <Text style={styles.nextInspectionDate}>
                {calculateNextInspectionDate(
                  item.last_inspection_date,
                  item.inspection_interval
                )}
              </Text>
            </Text>
          </View>
          <View style={{ marginLeft: 10 }}>{renderStatus(item.status)}</View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load equipment</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.results || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyMessage}>No equipment available</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f2bb13',
    marginBottom: 5,
  },
  manufacturer: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  infoValue: {
    fontWeight: '600',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  nextInspectionDate: {
    color: '#f2bb13',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#d9534f',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EquipmentScreen;