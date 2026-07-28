import { createBean, findBeanById, updateBeanById, deleteBeanById, getAllBeansPaginated, getBeanFacets, BeanFilter } from "../repositories/bean.repository";
import type { CreateBeanDTO } from "../dtos/bean.dto";
import type { IBean } from "../models/bean.model";

export async function createBeanService(data: CreateBeanDTO, createdBy: string): Promise<IBean> {
  return createBean({ ...data, createdBy: createdBy as any });
}
export async function getBeanService(id: string): Promise<IBean> {
  const bean = await findBeanById(id);
  if (!bean) throw new Error("Coffee bean not found");
  return bean;
}
export async function updateBeanService(id: string, data: Partial<CreateBeanDTO>): Promise<IBean> {
  const bean = await updateBeanById(id, data);
  if (!bean) throw new Error("Coffee bean not found");
  return bean;
}
export async function deleteBeanService(id: string): Promise<void> {
  const bean = await deleteBeanById(id);
  if (!bean) throw new Error("Coffee bean not found");
}
export async function listBeansService(page: number, limit: number, filter: BeanFilter, sort?: string) {
  return getAllBeansPaginated(page, limit, filter, sort);
}

export async function getBeanFacetsService(category?: string) {
  return getBeanFacets(category);
}