import {Platform, StyleSheet} from "react-native";

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
    marginTop: Platform.OS === 'ios' ? 0 : 35 ,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginLeft:5,
    marginRight: 5
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginLeft: 10
  }
});