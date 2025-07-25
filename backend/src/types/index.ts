export interface UserCredentials {
  username: string;
  password: string;
}

export interface ProductInput {
  name: string;
  type?: string;
  sku: string;
  image_url?: string;
  description?: string;
  quantity: number;
  price: number;
}