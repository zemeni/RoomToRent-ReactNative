import { useId, useState, useEffect } from "react";
import { View, TextInput, Text, Animated } from "react-native";
import inputStyle from "./Input.style";
export default function Input({ label, onChange }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const labelPosition = useState(new Animated.Value(0))[0];
  useEffect(() => {
    if (value.trim() !== "" && isFocused) {
      Animated.timing(labelPosition, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [value, isFocused]);
  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };
  const handleInputChange = (text) => {
    console.log(text);
    setValue(text);
  };
  const labelStyle = {
    position: "absolute",
    left: 10,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [14.5, 0],
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: ["#aaa", "#000"],
    }),
  };
  return (
    <View style={inputStyle.container}>
      <Animated.Text style={labelStyle} htmlFor={inputId}>
        {label}
      </Animated.Text>
      <TextInput
        id={inputId}
        style={inputStyle.input}
        value={value}
        onChangeText={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        underlineColorAndroid="transparent"
      />
    </View>
  );
}
