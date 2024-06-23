import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 35,
  },
  filterTextInput: {
    // flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    fontSize: 16,
    width: '100%',
    backgroundColor: "#fff",
    color: "red",
  },
});