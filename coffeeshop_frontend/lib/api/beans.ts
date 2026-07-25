import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "./endpoints";

export interface Bean {
  _id: string;
  name: string;
  description: string;
  origin: string;
  roastLevel: "light" | "medium" | "medium-dark" | "dark";
  process: "washed" | "natural" | "honey" | "anaerobic";
  category: "single-origin" | "blend" | "decaf" | "espresso";
  tastingNotes: string[];
  weightGrams: number;
  price: number;
  stock: number;
  images: string[];
  featured: boolean;
}

export interface BeanListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  roastLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sort?: string;
}

export interface Paginated<T> {
  success: boolean;
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export async function listBeans(params: BeanListParams = {}): Promise<Paginated<Bean>> {
  const res = await axiosInstance.get(ENDPOINTS.BEANS.LIST, { params });
  return res.data;
}

export async function getBean(id: string): Promise<Bean> {
  const res = await axiosInstance.get(ENDPOINTS.BEANS.DETAIL(id));
  return res.data.data;
}