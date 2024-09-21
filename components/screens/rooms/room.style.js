import {Platform, StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 10,
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

  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginLeft: 10
  }
});