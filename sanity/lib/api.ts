import { groq } from 'next-sanity';
import { client } from './client';
import { adminClient } from './adminClient';
import { Product, Category, Banner, Order, OrderItem, Review, ReviewStats } from '../../types';

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
        featured,
        sizes,
        colors
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
        featured,
        sizes,
        colors
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
        featured,
        sizes,
        colors
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
        mobileImage,
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

// Review Functions
export async function createReview(reviewData: any): Promise<any> {
  try {
    const result = await adminClient.create({
      _type: 'review',
      product: {
        _type: 'reference',
        _ref: reviewData.productId,
      },
      user: {
        _type: 'reference',
        _ref: reviewData.userId,
      },
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      verifiedPurchase: reviewData.verifiedPurchase || false,
      helpfulVotes: 0,
      notHelpfulVotes: 0,
      status: 'approved', // Changed from 'pending' to 'approved' for immediate display
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return result;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const reviews = await fetchWithErrorHandling<Review[]>(
      groq`*[_type == "review" && product._ref == $productId && status == "approved"] | order(_createdAt desc) {
        _id,
        _createdAt,
        _updatedAt,
        product->{
          _id,
          name,
          slug
        },
        user->{
          _id,
          fullName,
          email
        },
        rating,
        title,
        comment,
        images,
        verifiedPurchase,
        helpfulVotes,
        notHelpfulVotes,
        status,
        adminResponse
      }`,
      { productId }
    );
    
    return handleEmptyResults(reviews, `reviews for product ${productId}`);
  } catch (error) {
    console.error(`Error in getProductReviews for productId ${productId}:`, error);
    return [];
  }
}

export async function getReviewStats(productId: string): Promise<ReviewStats> {
  try {
    // First get all reviews to calculate stats
    const reviews = await fetchWithErrorHandling<any[]>(
      groq`*[_type == "review" && product._ref == $productId && status == "approved"] {
        rating,
        verifiedPurchase
      }`,
      { productId }
    );
    
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        verifiedReviews: 0,
      };
    }
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      if (ratingDistribution[review.rating as keyof typeof ratingDistribution] !== undefined) {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      }
    });
    
    // Count verified reviews
    const verifiedReviews = reviews.filter(review => review.verifiedPurchase).length;
    
    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalReviews: reviews.length,
      ratingDistribution,
      verifiedReviews,
    };
  } catch (error) {
    console.error(`Error in getReviewStats for productId ${productId}:`, error);
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      verifiedReviews: 0,
    };
  }
}

export async function updateReviewVotes(reviewId: string, helpful: boolean): Promise<void> {
  try {
    const review = await adminClient.getDocument(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    
    const updateData: any = {};
    
    if (helpful) {
      updateData.helpfulVotes = (review.helpfulVotes || 0) + 1;
    } else {
      updateData.notHelpfulVotes = (review.notHelpfulVotes || 0) + 1;
    }
    
    updateData.updatedAt = new Date().toISOString();
    
    await adminClient.patch(reviewId).set(updateData).commit();
  } catch (error) {
    console.error('Error updating review votes:', error);
    throw new Error('Failed to update review votes');
  }
}

export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const reviews = await fetchWithErrorHandling<Review[]>(
      groq`*[_type == "review" && user._ref == $userId] | order(_createdAt desc) {
        _id,
        _createdAt,
        _updatedAt,
        product->{
          _id,
          name,
          slug
        },
        user->{
          _id,
          fullName,
          email
        },
        rating,
        title,
        comment,
        images,
        verifiedPurchase,
        helpfulVotes,
        notHelpfulVotes,
        status,
        adminResponse
      }`,
      { userId }
    );
    
    return handleEmptyResults(reviews, `reviews by user ${userId}`);
  } catch (error) {
    console.error(`Error in getUserReviews for userId ${userId}:`, error);
    return [];
  }
}