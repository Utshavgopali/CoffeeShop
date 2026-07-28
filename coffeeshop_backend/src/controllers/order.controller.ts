import type { Response } from "express";
import type { Request } from "express-serve-static-core";
import {
  checkoutService,
  verifyPaymentService,
  getOrdersByUserService,
  getOrderService,
} from "../services/order.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

// @desc   Build an order from the cart and start a Khalti payment session
// @route  POST /api/v1/orders/checkout
export async function checkout(req: Request, res: Response) {
  try {
    const { fullName, phone, city, street } = req.body;
    if (!fullName || !phone || !city || !street) {
      return sendError(res, "Full shipping address is required", 400);
    }
    const result = await checkoutService((req as any).user.id, { fullName, phone, city, street });
    return sendSuccess(res, result, "Order created, redirecting to Khalti", 201);
  } catch (error: any) {
    return sendError(res, error.message || "Internal server error", 400);
  }
}

// @desc   Verify payment status with Khalti after redirect back
// @route  GET /api/v1/orders/verify?pidx=...
export async function verifyPayment(req: Request, res: Response) {
  try {
    const pidx = req.query.pidx as string;
    if (!pidx) return sendError(res, "pidx is required", 400);
    const order = await verifyPaymentService(pidx);
    return sendSuccess(res, order, "Payment verified");
  } catch (error: any) {
    return sendError(res, error.message || "Internal server error", 400);
  }
}

// @desc   Get the logged-in user's order history
// @route  GET /api/v1/orders
export async function myOrders(req: Request, res: Response) {
  try {
    const orders = await getOrdersByUserService((req as any).user.id);
    return sendSuccess(res, orders);
  } catch (error: any) {
    return sendError(res, error.message || "Internal server error", 500);
  }
}

// @desc   Get a single order by id
// @route  GET /api/v1/orders/:id
export async function getOrder(req: Request<{ id: string }>, res: Response) {
  try {
    const order = await getOrderService(req.params.id);
    return sendSuccess(res, order);
  } catch (error: any) {
    return sendError(res, error.message || "Internal server error", 404);
  }
}