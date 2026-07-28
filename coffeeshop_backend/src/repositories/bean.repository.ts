import Bean, { IBean } from "../models/bean.model";

export async function createBean(data: Partial<IBean>): Promise<IBean> { return new Bean(data).save(); }
export async function findBeanById(id: string): Promise<IBean | null> { return Bean.findById(id); }
export async function updateBeanById(id: string, data: Partial<IBean>): Promise<IBean | null> {
  return Bean.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}
export async function deleteBeanById(id: string): Promise<IBean | null> { return Bean.findByIdAndDelete(id); }

export interface BeanFilter {
  search?: string;
  category?: string;
  roastLevel?: string[];
  origin?: string[];
  weightGrams?: number[];
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
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
  if (filter.roastLevel?.length) query.roastLevel = { $in: filter.roastLevel };
  if (filter.origin?.length) query.origin = { $in: filter.origin };
  if (filter.weightGrams?.length) query.weightGrams = { $in: filter.weightGrams };
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

export interface BeanFacets {
  roastLevel: Record<string, number>;
  origin: Record<string, number>;
  weightGrams: Record<string, number>;
}

// Facet counts scoped only to the active category tab (if any) — not to the
// other sidebar filters, so checking a box never makes its own sibling
// options disappear.
export async function getBeanFacets(category?: string): Promise<BeanFacets> {
  const match: Record<string, unknown> = {};
  if (category) match.category = category;

  const [result] = await Bean.aggregate([
    { $match: match },
    {
      $facet: {
        roastLevel: [{ $group: { _id: "$roastLevel", count: { $sum: 1 } } }],
        origin: [{ $group: { _id: "$origin", count: { $sum: 1 } } }],
        weightGrams: [{ $group: { _id: "$weightGrams", count: { $sum: 1 } } }],
      },
    },
  ]);

  function toRecord(rows: { _id: string | number; count: number }[]): Record<string, number> {
    const record: Record<string, number> = {};
    for (const row of rows) record[String(row._id)] = row.count;
    return record;
  }

  return {
    roastLevel: toRecord(result.roastLevel),
    origin: toRecord(result.origin),
    weightGrams: toRecord(result.weightGrams),
  };
}