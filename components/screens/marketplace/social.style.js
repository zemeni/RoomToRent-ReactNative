import { Platform, StyleSheet } from "react-native";

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
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    fontSize: 16,
    width: '100%',
    backgroundColor: "#fff",
    color: "red",
  },
  pickerContainer: {
    marginTop: Platform.OS === 'ios' ? 0 : 35,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
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
    marginLeft: 10,
  },

  // New styles for the card component
  cardsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'gray',  // Border to simulate the card-like look
  },
  cardImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',  // Ensures the image fits well in the card
  },
  cardBody: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: '#1877f2',  // Facebook blue
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
