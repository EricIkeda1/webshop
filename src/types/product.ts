export interface Review {
  rating: number;
  comment: string;
  reviewerName: string;
}
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  reviews: Review[];
}
export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
