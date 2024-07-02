import React, { useRef, useState } from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import { styles } from "./listView.style";
import BottomSheet from "react-native-simple-bottom-sheet";
import ItemCard from "../../../cards/itemcard";

const ListView = ({ markers }) => {
  console.log("list view is rendered");
  const bottomSheetRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { height: screenHeight } = Dimensions.get("window");
  const bottomSheetHeight = screenHeight * 0.65;
  const handlePress = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      bottomSheetRef.current.togglePanel();
    }, 100);
  };
  return (
    <View>
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
            onPress={() => handlePress(item)}
          />
        )}
      />
      <BottomSheet
        ref={bottomSheetRef}
        isOpen={false}
        sliderMinHeight={0}
        sliderMaxHeight={bottomSheetHeight}
      >
        <View style={styles.bottomSheetContainer}>
          {selectedItem && (
            <Text style={[styles.sheetText, { height: bottomSheetHeight }]}>
              {selectedItem.title}
            </Text>
          )}
        </View>
      </BottomSheet>
    </View>
  );
};

export default ListView;
