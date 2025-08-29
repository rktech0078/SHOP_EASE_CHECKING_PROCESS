import { Button } from '../../../components/ui/Button';
import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        Sorry, the product you are looking for does not exist or has been removed.
      </p>
      <Link href="/products">
        <Button size="lg">Browse All Products</Button>
      </Link>
    </div>
  );
}