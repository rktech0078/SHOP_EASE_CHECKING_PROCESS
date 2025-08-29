const { createClient } = require('@sanity/client');

// Check if token is set
if (!process.env.SANITY_TOKEN) {
  console.error('❌ SANITY_TOKEN environment variable not set!');
  console.log('💡 Set it with: set SANITY_TOKEN=your_token_here');
  process.exit(1);
}

// Validate token format
const token = process.env.SANITY_TOKEN;
if (!token.startsWith('sk')) {
  console.error('❌ Invalid token format! Token should start with "sk"');
  console.log('💡 Make sure you copied the full token from Sanity manage');
  process.exit(1);
}

console.log('🔑 Token found:', token.substring(0, 10) + '...');

// Sanity client configuration
const client = createClient({
  projectId: 'xlf3zy4d',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: token
});

async function checkPermissions() {
  try {
    console.log('🔐 Checking permissions...');
    
    // Try to fetch a single document to check read permissions
    const testDoc = await client.fetch('*[_type == "order"][0]{_id}');
    console.log('✅ Read permission: OK');
    
    // Try to create a test document to check write permissions
    console.log('🔍 Testing write permissions...');
    const testResult = await client.create({
      _type: 'test',
      title: 'Permission Test',
      _id: 'test-permission-check'
    });
    console.log('✅ Write permission: OK');
    
    // Clean up test document
    console.log('🧹 Cleaning up test document...');
    await client.delete('test-permission-check');
    console.log('✅ Delete permission: OK');
    
    return true;
  } catch (error) {
    console.error('❌ Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      details: error.details
    });
    
    if (error.statusCode === 403) {
      console.error('❌ Permission denied. Your token needs "Editor" or "Write" permissions.');
      console.error('🔑 Go to https://www.sanity.io/manage and create a new token with write access.');
      console.log('💡 Make sure to select "Editor" role, not "Viewer"');
    } else if (error.statusCode === 401) {
      console.error('❌ Unauthorized. Check if your token is valid and not expired.');
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
    return false;
  }
}

async function deleteAllOrders() {
  try {
    // Check permissions first
    const hasPermissions = await checkPermissions();
    if (!hasPermissions) {
      console.log('\n💡 Alternative: Use Sanity Studio to delete orders manually');
      console.log('   npm run dev -> http://localhost:3000/studio -> Orders -> Select All -> Delete');
      return;
    }
    
    console.log('🔍 Fetching all orders...');
    
    // First, get all order IDs
    const orders = await client.fetch('*[_type == "order"]{_id, orderId}');
    
    if (orders.length === 0) {
      console.log('✅ No orders found to delete');
      return;
    }
    
    console.log(`📋 Found ${orders.length} orders to delete:`);
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.orderId || order._id}`);
    });
    
    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will permanently delete all orders!');
    console.log('💡 To cancel, press Ctrl+C');
    console.log('⏳ Continuing in 5 seconds...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🗑️ Deleting orders...');
    
    // Delete orders in batches to avoid timeout
    const batchSize = 10;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, i + batchSize);
      console.log(`📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(orders.length/batchSize)}`);
      
      const mutations = batch.map(order => ({
        delete: {
          id: order._id
        }
      }));
      
      await client.transaction(mutations).commit();
      console.log(`✅ Deleted ${batch.length} orders`);
    }
    
    console.log('🎉 Successfully deleted all orders!');
    
  } catch (error) {
    console.error('❌ Error deleting orders:', error.message);
    
    if (error.statusCode === 403) {
      console.log('\n💡 Solutions:');
      console.log('   1. Get a token with "Editor" permissions');
      console.log('   2. Use Sanity Studio: npm run dev -> /studio -> Orders -> Delete');
    }
  }
}

// Run the function
deleteAllOrders();
