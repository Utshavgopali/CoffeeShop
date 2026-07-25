import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import { getBeanService, listBeansService } from "../services/bean.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import type { BeanFilter } from "../repositories/bean.repository";

export async function listBeans(req: Request, res: Response) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
    const filter: BeanFilter = {
      search: req.query.search as string | undefined,
      category: req.query.category as string | undefined,
      roastLevel: req.query.roastLevel as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      featured: req.query.featured ? req.query.featured === "true" : undefined,
    };
    const sort = (req.query.sort as string) || "-createdAt";
    const { data, total } = await listBeansService(page, limit, filter, sort);
    return sendSuccess(res, data, "Beans fetched", 200, { page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 500);
  }
}

export async function getBean(req: Request, res: Response) {
  try {
    const bean = await getBeanService(req.params.id as string);
    return sendSuccess(res, bean);
  } catch (error: unknown) {
    return sendError(res, error instanceof Error ? error.message : "Something went wrong", 404);
  }
}