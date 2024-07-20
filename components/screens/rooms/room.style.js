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
  pickerContainer: {
    marginTop: 35,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 12,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});