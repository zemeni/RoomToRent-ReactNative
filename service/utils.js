import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAddresses = async (addresses) => {
    try {
        // Convert addresses array to JSON string before storing
        const addressesJSON = JSON.stringify(addresses);
        await AsyncStorage.setItem('ADDRESSES_KEY', addressesJSON);
        console.log('Addresses stored successfully.');
    } catch (error) {
        console.error('Failed to store addresses:', error);
    }
};

// Function to remove an item from AsyncStorage
export const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`Successfully removed item with key: ${key}`);
    } catch (error) {
        console.error(`Error removing item with key: ${key}`, error);
    }
};

// Example usage to remove your stored addresses
export const removeAddresses = async () => {
    try {
        await AsyncStorage.removeItem('ADDRESSES_KEY');
        console.log('Addresses removed successfully.');
    } catch (error) {
        console.error('Failed to remove addresses:', error);
    }
};

export const logAsyncStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);

    console.log("Logging AsyncStorage contents: ",keys.length);
    stores.forEach((result, i, store) => {
        const key = store[i][0];
        const value = store[i][1];

        // Check if the value is a JSON string and parse it
        let parsedValue;
        try {
            parsedValue = JSON.parse(value);
        } catch (error) {
            parsedValue = value; // If not JSON, store the raw value
        }

        console.log(`Key: ${key}, Value: `, parsedValue);
    });
};
