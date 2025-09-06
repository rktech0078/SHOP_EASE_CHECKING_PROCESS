const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

async function checkProducts() {
  try {
    console.log('🔍 Checking Sanity products...');
    
    const products = await client.fetch(`
      *[_type == "product"] {
        _id,
        name,
        slug,
        inStock
      }
    `);
    
    console.log(`📦 Found ${products.length} products:`);
    products.forEach(p => {
      console.log(`- ${p._id}: ${p.name} (${p.slug?.current}) - Stock: ${p.inStock ? '✅' : '❌'}`);
    });
    
    // Check for the specific missing product
    const missingId = '04eb8267-bc02-4540-b875-87f7f5da72eb';
    const foundProduct = products.find(p => p._id === missingId);
    
    if (foundProduct) {
      console.log(`\n✅ Product ${missingId} found: ${foundProduct.name}`);
    } else {
      console.log(`\n❌ Product ${missingId} NOT FOUND in Sanity`);
      console.log('This product needs to be created or the cart needs to be cleared');
    }
    
  } catch (error) {
    console.error('Error checking products:', error);
  }
}

checkProducts();
