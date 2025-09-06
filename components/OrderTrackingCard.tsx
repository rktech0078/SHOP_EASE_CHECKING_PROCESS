'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Eye,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface OrderItem {
  _id: string;
  productId: string;
  productName?: string;
  selectedSize?: string;
  selectedColor?: string;
  product: {
    _id: string;
    name: string;
    price: number;
    discount?: number;
    images: Array<{
      asset: {
        _ref: string;
      };
    }>;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    totalAmount: number;
    currency: string;
  };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shipping: {
    method: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
    actualDelivery: string;
  };
  timeline: Array<{
    status: string;
    timestamp: string;
    description: string;
    location: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface OrderTrackingCardProps {
  order: Order;
}

export default function OrderTrackingCard({ order }: OrderTrackingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'shipped': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'processing': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'pending': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle size={20} />;
      case 'shipped': return <Truck size={20} />;
      case 'processing': return <Package size={20} />;
      case 'pending': return <Clock size={20} />;
      case 'cancelled': return <Package size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  const getTimelineSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: <Package size={16} /> },
      { key: 'processing', label: 'Processing', icon: <Package size={16} /> },
      { key: 'shipped', label: 'Shipped', icon: <Truck size={16} /> },
      { key: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} /> }
    ];

    const currentStatusIndex = steps.findIndex(step => 
      step.key === order.status.toLowerCase()
    );

    return steps.map((step, index) => {
      const isCompleted = index <= currentStatusIndex;
      const isCurrent = index === currentStatusIndex;
      
      return {
        ...step,
        isCompleted,
        isCurrent
      };
    });
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header - Mobile Responsive */}
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Order #{order.orderId}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-2"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span className="hidden sm:inline">{isExpanded ? 'Less' : 'More'}</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowDetailsModal(true)}
                  className="flex items-center gap-2"
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">Details</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Progress - Mobile Responsive */}
        <div className="px-4 lg:px-6 py-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between overflow-x-auto">
            {getTimelineSteps().map((step, index) => (
              <div key={step.key} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step.isCompleted 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : step.isCurrent
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-400'
                }`}>
                  {step.isCompleted ? <CheckCircle size={16} /> : step.icon}
                </div>
                {index < getTimelineSteps().length - 1 && (
                  <div className={`w-12 lg:w-16 h-0.5 mx-2 ${
                    step.isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 overflow-x-auto">
            {getTimelineSteps().map((step) => (
              <span key={step.key} className={`text-xs font-medium flex-shrink-0 ${
                step.isCompleted || step.isCurrent 
                  ? 'text-gray-900 dark:text-gray-100' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.label}
              </span>
            ))}
          </div>
        </div>

        {/* Order Summary - Mobile Responsive */}
        <div className="px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            {order.items[0]?.product?.images?.[0]?.asset?._ref && (
              <div className="flex-shrink-0">
                <Image
                  src={urlFor(order.items[0].product.images[0]).url()}
                  alt={order.items[0].product.name || 'Product Image'}
                  width={64}
                  height={64}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {order.items[0]?.product?.name} {order.items.length > 1 && `+${order.items.length - 1} more`}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatCurrency(order.pricing.totalAmount)}
              </p>
            </div>
          </div>

          {/* Quick Actions - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                <span className="truncate">{order.customer.city}, {order.customer.state}</span>
              </span>
              <span className="flex items-center gap-1">
                <Package size={14} />
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {order.shipping.trackingNumber && (
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Truck size={14} />
                  <span className="hidden sm:inline">Track</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details - Mobile Responsive */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 lg:px-6 py-4 space-y-4">
              {/* Items List */}
              <div>
                <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Order Items</h5>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {item.product?.images?.[0]?.asset?._ref && (
                        <div className="flex-shrink-0">
                          <Image
                            src={urlFor(item.product.images[0]).url()}
                            alt={item.product.name || 'Product Image'}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.productName || item.product?.name || 'Product Name'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex gap-2 mt-1">
                            {item.selectedSize && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                📏 {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                🎨 {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Details */}
              {order.timeline && order.timeline.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Order Timeline</h5>
                  <div className="space-y-3">
                    {order.timeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {event.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(event.timestamp)}
                            {event.location && ` • ${event.location}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping & Payment Details - Mobile Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Shipping Details</h5>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><strong>Method:</strong> {order.shipping.method}</p>
                    {order.shipping.carrier && <p><strong>Carrier:</strong> {order.shipping.carrier}</p>}
                    {order.shipping.trackingNumber && (
                      <p><strong>Tracking:</strong> {order.shipping.trackingNumber}</p>
                    )}
                    {order.shipping.estimatedDelivery && (
                      <p><strong>Estimated Delivery:</strong> {formatDate(order.shipping.estimatedDelivery)}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Payment Details</h5>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><strong>Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                    <p><strong>Status:</strong> {order.paymentStatus}</p>
                    <p><strong>Subtotal:</strong> {formatCurrency(order.pricing.subtotal)}</p>
                    <p><strong>Tax:</strong> {formatCurrency(order.pricing.tax)}</p>
                    <p><strong>Shipping:</strong> {formatCurrency(order.pricing.shipping)}</p>
                    {order.pricing.discount > 0 && (
                      <p><strong>Discount:</strong> -{formatCurrency(order.pricing.discount)}</p>
                    )}
                    <p className="font-semibold"><strong>Total:</strong> {formatCurrency(order.pricing.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Order Details - #{order.orderId}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailsModal(false)}
                className="flex items-center gap-2"
              >
                <X size={20} />
                <span className="hidden sm:inline">Close</span>
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Order Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Order Date</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(order.pricing.totalAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Customer Information</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{order.customer.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{order.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{order.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zipCode}, {order.customer.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {item.product?.images?.[0]?.asset?._ref && (
                        <div className="flex-shrink-0">
                          <Image
                            src={urlFor(item.product.images[0]).url()}
                            alt={item.product.name || 'Product Image'}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.productName || item.product?.name || 'Product Name'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Price: {formatCurrency(item.price)}
                        </p>
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex gap-2 mt-2">
                            {item.selectedSize && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                📏 Size: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                🎨 Color: {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Shipping Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Payment Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{order.paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{order.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(order.pricing.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tax:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(order.pricing.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Shipping:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(order.pricing.shipping)}</span>
                    </div>
                    {order.pricing.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Discount:</span>
                        <span className="font-medium text-red-600">-{formatCurrency(order.pricing.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Total:</span>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(order.pricing.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Shipping Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Method:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{order.shipping.method}</span>
                    </div>
                    {order.shipping.carrier && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Carrier:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{order.shipping.carrier}</span>
                      </div>
                    )}
                    {order.shipping.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Tracking:</span>
                        <span className="font-medium text-blue-600">{order.shipping.trackingNumber}</span>
                      </div>
                    )}
                    {order.shipping.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Est. Delivery:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(order.shipping.estimatedDelivery)}</span>
                      </div>
                    )}
                    {order.shipping.actualDelivery && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Actual Delivery:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(order.shipping.actualDelivery)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {order.timeline && order.timeline.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Order Timeline</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="space-y-4">
                      {order.timeline.map((event, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {event.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(event.timestamp)}
                              {event.location && ` • ${event.location}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
