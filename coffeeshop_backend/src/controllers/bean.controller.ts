import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import { getBeanService, listBeansService, getBeanFacetsService } from "../services/bean.service";
import { sendSuccess, sendError } from "../utils/apiResponse";
import type { BeanFilter } from "../repositories/bean.repository";

function parseCsv(value: unknown): string[] | undefined {
  if (typeof value !== "string" || !value) return undefined;
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

export async function listBeans(req: Request, res: Response) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
    const filter: BeanFilter = {
      search: req.query.search as string | undefined,
      category: req.query.category as string | undefined,
      roastLevel: parseCsv(req.query.roastLevel),
      origin: parseCsv(req.query.origin),
      weightGrams: parseCsv(req.query.weightGrams)?.map(Number),
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

// @route  GET /api/v1/beans/facets?category=espresso
export async function getBeanFacetsHandler(req: Request, res: Response) {
  try {
    const facets = await getBeanFacetsService(req.query.category as string | undefined);
    return sendSuccess(res, facets, "Facets fetched");
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