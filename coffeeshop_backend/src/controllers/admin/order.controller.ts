import type { Request, Response } from "express";
import { listAllOrdersService, adminCancelOrderService } from "../../services/order.service";
import { sendSuccess, sendError } from "../../utils/apiResponse";

export async function listOrders(req: Request, res: Response) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const { data, total } = await listAllOrdersService(page, limit);
    return sendSuccess(res, data, "Orders fetched", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return sendError(res, error.message || "Internal server error", 500);
  }
}

// @route  PATCH /api/v1/admin/orders/:id/cancel
export async function cancelOrder(req: Request<{ id: string }>, res: Response) {
  try {
    const order = await adminCancelOrderService(req.params.id);
    return sendSuccess(res, order, "Order cancelled");
  } catch (error: any) {
    return sendError(res, error.message || "Internal server error", 400);
  }
}