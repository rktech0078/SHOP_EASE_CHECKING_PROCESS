import { groq } from 'next-sanity';
import { client } from './client';
import { Product, Category, Banner, Order, OrderItem } from '../../types';

// Enhanced client with error handling

// Function to create a new order in Sanity
export async function createOrder(orderData: Order): Promise<Order> {
  try {
    console.log('Creating order with data:', orderData);
    
    // Generate a unique order ID if not provided
    if (!orderData.orderId) {
      orderData.orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
    
    // Set creation date if not provided
    if (!orderData.createdAt) {
      orderData.createdAt = new Date().toISOString();
    }
    
    // Ensure proper status values
    if (!orderData.status) {
      orderData.status = 'pending';
    }
    if (!orderData.paymentStatus) {
      orderData.paymentStatus = 'pending';
    }
    
    console.log('Sanity client config:', {
      projectId: client.config().projectId,
      dataset: client.config().dataset,
      apiVersion: client.config().apiVersion,
      hasToken: !!client.config().token
    });
    
    // Create the order document in Sanity
    const result = await client.create({
      _type: 'order',
      orderId: orderData.orderId,
      customer: orderData.customer,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: orderData.status,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      createdAt: orderData.createdAt,
      notes: orderData.notes || ''
    });
    
    console.log('Order created successfully in Sanity:', result);
    return { ...orderData, _id: result._id, _createdAt: result._createdAt };
  } catch (error) {
    console.error('Error creating order in Sanity:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      orderData: orderData
    });
    throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to get all orders
export async function getOrders(): Promise<Order[]> {
  const query = groq`*[_type == "order"] | order(createdAt desc) {
    _id,
    _createdAt,
    orderId,
    customer,
    items,
    totalAmount,
    status,
    paymentMethod,
    paymentStatus,
    createdAt,
    notes
  }`;
  
  try {
    const orders = await client.fetch<Order[]>(query);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

// Function to get a single order by ID
export async function getOrderById(orderId: string): Promise<Order> {
  const query = groq`*[_type == "order" && _id == $orderId][0] {
    _id,
    _createdAt,
    orderId,
    customer,
    items,
    totalAmount,
    status,
    paymentMethod,
    paymentStatus,
    createdAt,
    notes
  }`;
  
  try {
    const order = await client.fetch<Order>(query, { orderId });
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
}
const fetchWithErrorHandling = async <T>(query: string, params = {}): Promise<T> => {
  try {
    const result = await client.fetch<T>(query, params);
    return result;
  } catch (error) {
    console.error(`Error fetching data with query: ${query}`, error);
    throw new Error(`Failed to fetch data from Sanity: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper function to handle empty results
const handleEmptyResults = <T>(results: T[], entityName: string): T[] => {
  if (!results || results.length === 0) {
    console.warn(`No ${entityName} found`);
  }
  return results || [];
};

// Get all products
export async function getProducts(): Promise<Product[]> {
  try {
    const products = await fetchWithErrorHandling<Product[]>(
      groq`*[_type == "product"] | order(_createdAt desc) {
        _id,
        _createdAt,
        name,
        slug,
        images,
        categories,
        price,
        discount,
        description,
        features,
        inStock,
        featured
      }`
    );
    return handleEmptyResults(products, 'products');
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await fetchWithErrorHandling<Product[]>(
      groq`*[_type == "product" && featured == true] | order(_createdAt desc) {
        _id,
        _createdAt,
        name,
        slug,
        images,
        categories,
        price,
        discount,
        description,
        features,
        inStock,
        featured
      }`
    );
    return handleEmptyResults(products, 'featured products');
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

// Get a single product by slug
export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const product = await fetchWithErrorHandling<Product>(
      groq`*[_type == "product" && slug.current == $slug][0] {
        _id,
        _createdAt,
        name,
        slug,
        images,
        categories,
        price,
        discount,
        description,
        features,
        inStock,
        featured
      }`,
      { slug }
    );
    
    if (!product) {
      console.warn(`Product with slug ${slug} not found`);
    }
    
    return product || null;
  } catch (error) {
    console.error(`Error in getProduct for slug ${slug}:`, error);
    return null;
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await fetchWithErrorHandling<Category[]>(
      groq`*[_type == "category"] | order(name asc) {
        _id,
        _createdAt,
        name,
        slug,
        description,
        image
      }`
    );
    
    return handleEmptyResults(categories, 'categories');
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
}

// Get a single category by slug
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const category = await fetchWithErrorHandling<Category>(
      groq`*[_type == "category" && slug.current == $slug][0] {
        _id,
        _createdAt,
        name,
        slug,
        description,
        image
      }`,
      { slug }
    );
    
    if (!category) {
      console.warn(`Category with slug ${slug} not found`);
    }
    
    return category || null;
  } catch (error) {
    console.error(`Error in getCategory for slug ${slug}:`, error);
    return null;
  }
}

// Get products by category
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const products = await fetchWithErrorHandling<Product[]>(
      groq`*[_type == "product" && $categoryId in categories[]._ref] | order(_createdAt desc) {
        _id,
        _createdAt,
        name,
        slug,
        images,
        categories,
        price,
        discount,
        description,
        features,
        inStock,
        featured
      }`,
      { categoryId }
    );
    
    return handleEmptyResults(products, `products in category ${categoryId}`);
  } catch (error) {
    console.error(`Error in getProductsByCategory for categoryId ${categoryId}:`, error);
    return [];
  }
}

// Get active banners
export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const banners = await fetchWithErrorHandling<Banner[]>(
      groq`*[_type == "banner" && isActive == true] | order(_createdAt desc) {
        _id,
        _createdAt,
        title,
        subtitle,
        image,
        buttonText,
        buttonLink,
        isActive
      }`
    );
    
    return handleEmptyResults(banners, 'active banners');
  } catch (error) {
    console.error('Error in getActiveBanners:', error);
    return [];
  }
}