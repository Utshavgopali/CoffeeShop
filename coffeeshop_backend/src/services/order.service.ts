import { getOrCreateCart, clearCart } from "../repositories/cart.repository";
import { findBeanById, updateBeanById } from "../repositories/bean.repository";
import {
  createOrder,
  findOrderById,
  updateOrderById,
  findOrdersByUser,
  getAllOrdersPaginated,
} from "../repositories/order.repository";
import { initiateKhaltiPayment, verifyKhaltiPayment } from "../utils/khalti";
import { sendOrderConfirmation } from "../utils/mailer";
import { notifyOrderPlaced, notifyOrderPaid } from "./notification.service";
import User from "../models/user.model";
import Order, { type IOrder } from "../models/order.model";

interface ShippingAddress {
  fullName: string;
  phone: string;
  city: string;
  street: string;
}

// Step 1: build the order from the user's cart (status "pending"),
// then ask Khalti for a payment_url to redirect the customer to.
export async function checkoutService(userId: string, shippingAddress: ShippingAddress) {
  const cart = await getOrCreateCart(userId);
  const populated = await cart.populate("items.bean");
  if (populated.items.length === 0) throw new Error("Your cart is empty");

  const items = [];
  let totalAmount = 0;

  for (const item of populated.items as any[]) {
    const bean = item.bean;
    if (!bean) continue;
    if (bean.stock < item.quantity) {
      throw new Error(`Not enough stock for ${bean.name}`);
    }
    items.push({
      bean: bean._id,
      name: bean.name,
      weightGrams: bean.weightGrams,
      price: bean.price,
      quantity: item.quantity,
    });
    totalAmount += bean.price * item.quantity;
  }

  const order = await createOrder({
    user: userId as any,
    items,
    totalAmount,
    status: "pending",
    paymentMethod: "khalti",
    shippingAddress,
  });

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const khalti = await initiateKhaltiPayment({
    amountInPaisa: Math.round(totalAmount * 100),
    orderId: String(order._id),
    orderName: `CoffeeShop order #${String(order._id).slice(-6)}`,
    customerName: user.name,
    customerEmail: user.email,
    returnUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/checkout/verify`,
  });

  order.khaltiPidx = khalti.pidx;
  await order.save();

  await notifyOrderPlaced(userId, String(order._id));

  return { order, paymentUrl: khalti.payment_url, pidx: khalti.pidx };
}

// Step 2: called when Khalti redirects the customer back. We re-verify
// the payment status directly with Khalti (never trust query params alone).
export async function verifyPaymentService(pidx: string): Promise<IOrder> {
  const lookup = await verifyKhaltiPayment(pidx);

  const orderDoc = await Order.findOne({ khaltiPidx: pidx });
  if (!orderDoc) throw new Error("Order not found for this payment");

  if (lookup.status === "Completed") {
    orderDoc.status = "paid";
    orderDoc.khaltiTransactionId = lookup.transaction_id || undefined;
    await orderDoc.save();

    // decrement stock now that payment is confirmed
    for (const item of orderDoc.items) {
      const bean = await findBeanById(String(item.bean));
      if (bean) {
        await updateBeanById(String(bean._id), { stock: Math.max(0, bean.stock - item.quantity) });
      }
    }

    await clearCart(String(orderDoc.user));

    const user = await User.findById(orderDoc.user);
    if (user) {
      await sendOrderConfirmation(user.email, String(orderDoc._id), orderDoc.totalAmount).catch(() => {});
    }
    await notifyOrderPaid(String(orderDoc.user), String(orderDoc._id));
  } else if (lookup.status === "Expired" || lookup.status === "User canceled") {
    orderDoc.status = "failed";
    await orderDoc.save();
  }

  return orderDoc;
}

export async function getOrdersByUserService(userId: string): Promise<IOrder[]> {
  return findOrdersByUser(userId);
}

export async function getOrderService(id: string): Promise<IOrder> {
  const order = await findOrderById(id);
  if (!order) throw new Error("Order not found");
  return order;
}

export async function listAllOrdersService(page: number, limit: number) {
  return getAllOrdersPaginated(page, limit);
}