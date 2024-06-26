import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import {styles} from "./listView.style";

const ListView = ({ markers, userLocation }) => {

    console.log("rendering list view")
    return (
        <View style={styles.container}>
            <FlatList
                data={markers}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default ListView;
