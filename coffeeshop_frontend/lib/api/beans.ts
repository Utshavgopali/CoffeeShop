import axiosInstance from "./axios-instance";
import { ENDPOINTS } from "@/lib/endpoints";

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
  createdAt: string;
}

export interface BeanListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  roastLevel?: string[];
  origin?: string[];
  weightGrams?: number[];
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

export interface BeanFacets {
  roastLevel: Record<string, number>;
  origin: Record<string, number>;
  weightGrams: Record<string, number>;
}

export async function listBeans(params: BeanListParams = {}): Promise<Paginated<Bean>> {
  const res = await axiosInstance.get(ENDPOINTS.BEANS.LIST, {
    params: {
      ...params,
      roastLevel: params.roastLevel?.join(",") || undefined,
      origin: params.origin?.join(",") || undefined,
      weightGrams: params.weightGrams?.join(",") || undefined,
    },
  });
  return res.data;
}

export async function getBeanFacets(category?: string): Promise<BeanFacets> {
  const res = await axiosInstance.get(ENDPOINTS.BEANS.FACETS, { params: { category } });
  return res.data.data;
}

export async function getBean(id: string): Promise<Bean> {
  const res = await axiosInstance.get(ENDPOINTS.BEANS.DETAIL(id));
  return res.data.data;
}