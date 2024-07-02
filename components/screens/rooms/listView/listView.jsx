import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "./listView.style";
import BottomSheet from "react-native-simple-bottom-sheet";
import ItemCard from "../../../cards/itemcard";
import { useFocusEffect } from "@react-navigation/native";

const ListView = ({ markers }) => {
  console.log("list view is rendered");
  const bottomSheetRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { height: screenHeight } = Dimensions.get("window");
  const bottomSheetHeight = screenHeight * 0.65;
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        bottomSheetRef?.current && bottomSheetRef?.current?.togglePanel();
      };
    }, [])
  );
  const handlePress = (item) => {
    setSelectedItem(item);
    bottomSheetRef?.current?.togglePanel();
  };
  const handleOutsidePress = () => {
    bottomSheetRef?.current && bottomSheetRef?.current?.togglePanel();
  };
  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
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
          animationDuration={200}
        >
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheetContainer}>
              {selectedItem && (
                <Text style={[styles.sheetText, { height: bottomSheetHeight }]}>
                  {selectedItem.title}
                </Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        </BottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListView;
