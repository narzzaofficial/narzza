export type Product = {
  _id?: string;
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  categoryId?: string;
  stock: number;
  featured?: boolean;
  productType: "physical" | "digital";
  platforms?: {
    shopee?: string;
    tokopedia?: string;
    tiktokshop?: string;
    lynk?: string;
  };
  createdAt?: number;
  updatedAt?: number;
};

export type Category = {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  createdAt?: number;
  updatedAt?: number;
};
