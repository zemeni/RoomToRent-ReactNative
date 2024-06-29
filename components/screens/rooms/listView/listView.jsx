import React from "react";
import { View, Text, FlatList } from "react-native";
import { styles } from "./listView.style";
import ItemCard from "../../../cards/itemcard";

const ListView = ({ markers }) => {
  console.log("list view is rendered");
  return (
    <FlatList
      data={markers}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ItemCard
          title={item.title}
          description={item.description}
          phone={item.phone}
          price={item.price}
          date={item.date}
        />
      )}
    />
  );
};

export default ListView;
