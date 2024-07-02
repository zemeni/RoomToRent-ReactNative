import { View, Text, TouchableOpacity } from "react-native";
import itemCardStyle from "./itemCard.style";
import { Ionicons } from "@expo/vector-icons";
const ItemCard = ({
  title,
  description,
  phone,
  price,
  date,
  onPress,
  ...otherProps
}) => {
  return (
    <TouchableOpacity
      style={itemCardStyle.card}
      {...otherProps}
      onPress={onPress}
    >
      <View>
        <View style={itemCardStyle.Headings}>
          <Text style={itemCardStyle.title}>{title}</Text>
          <Text style={itemCardStyle.description}>{description}</Text>
        </View>

        <View style={itemCardStyle.Items}>
          <View style={itemCardStyle.price}>
            <Ionicons name="card" size={15} color="#1a73e8" />
            <Text>{price}</Text>
          </View>
          <View style={itemCardStyle.phone}>
            <Ionicons name="call" size={15} color="#34c759" />
            <Text>{phone}</Text>
          </View>
          <View style={itemCardStyle.date}>
            <Ionicons name="calendar" size={15} color="#333" />
            <Text>{date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ItemCard;
