import { userData } from '../data/userData';
import { transformUserData, storeTransformedData } from '../utils/userDataTransformer';

// Transform the data
const transformedData = transformUserData(userData);

// Store the transformed data
storeTransformedData(transformedData);

// Log the transformed data structure
console.log('Transformed Data Structure:');
console.log(JSON.stringify(transformedData, null, 2)); 