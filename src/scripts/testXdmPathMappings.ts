import { createXdmPathMappings, getSimplifiedMappings } from '../utils/extractXdmPaths';

console.log('=== Testing XDM Path Mappings ===');

// Get all mappings
const allMappings = createXdmPathMappings();
console.log(`Total XDM paths extracted: ${allMappings.length}`);

// Print a few sample mappings
console.log('\n=== Sample Full Mappings ===');
allMappings.slice(0, 5).forEach((mapping, index) => {
  console.log(`\nMapping ${index + 1}:`);
  console.log(`XDM Path: ${mapping.xdmPath}`);
  console.log(`Level 1: ${mapping.level1}`);
  console.log(`Level 2: ${mapping.level2}`);
  console.log(`Level 3: ${mapping.level3}`);
  console.log(`Level 4: ${mapping.level4}`);
  console.log(`Level 5: ${mapping.level5}`);
});

// Get simplified mappings
const simplifiedMappings = getSimplifiedMappings();
console.log(`\n=== Simplified Mappings ===`);
console.log(`Total simplified XDM paths: ${simplifiedMappings.length}`);

// Print a few sample simplified mappings
console.log('\n=== Sample Simplified Mappings ===');
simplifiedMappings.slice(0, 5).forEach((mapping, index) => {
  console.log(`\nMapping ${index + 1}:`);
  console.log(`XDM Path: ${mapping.xdmPath}`);
  console.log(`Transformed Path: ${mapping.level1}/${mapping.level2}/${mapping.level3}/${mapping.level4}/${mapping.level5}`.replace(/\/+/g, '/').replace(/\/$/, ''));
});

// Count by top level categories
const topLevelCategories = new Map<string, number>();
for (const mapping of simplifiedMappings) {
  const count = topLevelCategories.get(mapping.level1) || 0;
  topLevelCategories.set(mapping.level1, count + 1);
}

console.log('\n=== Counts by Top Level Category ===');
for (const [category, count] of topLevelCategories.entries()) {
  console.log(`${category}: ${count} mappings`);
}

console.log('\n=== Test Complete ==='); 