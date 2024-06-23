import React from 'react';
import { View, Text, FlatList } from 'react-native';
import {styles} from "./listView.style";

const ListView = ({ markers }) => {
    console.log("list view is rendered");
    return (
        <FlatList style={styles.item}
            data={markers}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text>{item.description}</Text>
                    <Text>Latitude: {item.coordinate.latitude}</Text>
                    <Text>Longitude: {item.coordinate.longitude}</Text>
                </View>
            )}
        />
    );
};

export default ListView;
