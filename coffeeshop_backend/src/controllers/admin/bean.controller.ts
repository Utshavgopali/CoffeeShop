import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import {
  createBeanService,
  updateBeanService,
  deleteBeanService,
  listBeansService,
  getBeanService,
} from "../../services/bean.service";
import { BeanSchema, BeanUpdateSchema } from "../../types/bean.type";
import { sendSuccess, sendError } from "../../utils/apiResponse";

function firstIssue(parsed: any) {
  return parsed.error?.issues?.[0]?.message || "Validation failed";
}

// @route  POST /api/v1/admin/beans
export async function createBean(req: Request & { files?: any }, res: Response) {
  try {
    const parsed = BeanSchema.safeParse({
      ...req.body,
      tastingNotes:
        typeof req.body.tastingNotes === "string"
          ? req.body.tastingNotes.split(",").map((s: string) => s.trim()).filter(Boolean)
          : req.body.tastingNotes,
    });
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);

    const images = (req.files as Express.Multer.File[] | undefined)?.map(
      (f) => `/beans/${f.filename}`
    ) || [];

    const bean = await createBeanService(
      { ...parsed.data, tastingNotes: parsed.data.tastingNotes || [] } as any,
      (req as any).user.id
    );
    if (images.length) {
      bean.images = images;
      await bean.save();
    }

    return sendSuccess(res, bean, "Coffee bean created", 201);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return sendError(res, message, 400);
  }
}

// @route  PUT /api/v1/admin/beans/:id
export async function updateBean(req: Request & { files?: any }, res: Response) {
  try {
    const parsed = BeanUpdateSchema.safeParse({
      ...req.body,
      tastingNotes:
        typeof req.body.tastingNotes === "string"
          ? req.body.tastingNotes.split(",").map((s: string) => s.trim()).filter(Boolean)
          : req.body.tastingNotes,
    });
    if (!parsed.success) return sendError(res, firstIssue(parsed), 400);

    const bean = await updateBeanService(req.params.id as string, parsed.data);

    const images = (req.files as Express.Multer.File[] | undefined)?.map(
      (f) => `/beans/${f.filename}`
    );
    if (images && images.length) {
      bean.images = images;
      await bean.save();
    }

    return sendSuccess(res, bean, "Coffee bean updated");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return sendError(res, message, 400);
  }
}

// @route  DELETE /api/v1/admin/beans/:id
export async function deleteBean(req: Request, res: Response) {
  try {
    await deleteBeanService(req.params.id as string);
    return sendSuccess(res, null, "Coffee bean deleted");
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return sendError(res, message, 404);
  }
}

// @route  GET /api/v1/admin/beans
export async function adminListBeans(req: Request, res: Response) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const { data, total } = await listBeansService(page, limit, {
      search: req.query.search as string | undefined,
    });
    return sendSuccess(res, data, "Beans fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return sendError(res, message, 500);
  }
}

// @route  GET /api/v1/admin/beans/:id
export async function adminGetBean(req: Request, res: Response) {
  try {
    const bean = await getBeanService(req.params.id as string);
    return sendSuccess(res, bean);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return sendError(res, message, 404);
  }
}