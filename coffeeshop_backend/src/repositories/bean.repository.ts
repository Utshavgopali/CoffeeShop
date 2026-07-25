import Bean, { IBean } from "../models/bean.model";

export async function createBean(data: Partial<IBean>): Promise<IBean> { return new Bean(data).save(); }
export async function findBeanById(id: string): Promise<IBean | null> { return Bean.findById(id); }
export async function updateBeanById(id: string, data: Partial<IBean>): Promise<IBean | null> {
  return Bean.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}
export async function deleteBeanById(id: string): Promise<IBean | null> { return Bean.findByIdAndDelete(id); }

export interface BeanFilter {
  search?: string; category?: string; roastLevel?: string; minPrice?: number; maxPrice?: number; featured?: boolean;
}

export async function getAllBeansPaginated(page: number, limit: number, filter: BeanFilter = {}, sort = "-createdAt") {
  const query: Record<string, unknown> = {};
  if (filter.search) {
    query.$or = [
      { name: { $regex: filter.search, $options: "i" } },
      { origin: { $regex: filter.search, $options: "i" } },
      { tastingNotes: { $regex: filter.search, $options: "i" } },
    ];
  }
  if (filter.category) query.category = filter.category;
  if (filter.roastLevel) query.roastLevel = filter.roastLevel;
  if (filter.featured !== undefined) query.featured = filter.featured;
  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    query.price = {};
    if (filter.minPrice !== undefined) (query.price as any).$gte = filter.minPrice;
    if (filter.maxPrice !== undefined) (query.price as any).$lte = filter.maxPrice;
  }
  const total = await Bean.countDocuments(query);
  const data = await Bean.find(query).skip((page - 1) * limit).limit(limit).sort(sort);
  return { data, total };
}