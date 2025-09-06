// Clear localStorage cart to remove invalid product references
console.log('🧹 Clearing cart from localStorage...');

if (typeof window !== 'undefined') {
  localStorage.removeItem('cart');
  console.log('✅ Cart cleared successfully');
} else {
  console.log('❌ This script needs to run in browser console');
  console.log('Please run this in your browser console:');
  console.log('localStorage.removeItem("cart"); location.reload();');
}
