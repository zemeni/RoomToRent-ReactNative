import { StyleSheet } from "react-native";
const itemCardStyle = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  date: {
    fontSize: 20,
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  phone: {
    fontSize: 20,
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  Items: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
export default itemCardStyle;
