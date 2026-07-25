import Order, { IOrder } from "../models/order.model";

export async function createOrder(data: Partial<IOrder>): Promise<IOrder> {
  return new Order(data).save();
}

export async function findOrderById(id: string): Promise<IOrder | null> {
  return Order.findById(id);
}

export async function findOrdersByUser(userId: string): Promise<IOrder[]> {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

export async function updateOrderById(id: string, data: Partial<IOrder>): Promise<IOrder | null> {
  return Order.findByIdAndUpdate(id, data, { new: true });
}

export async function getAllOrdersPaginated(
  page: number,
  limit: number
): Promise<{ data: IOrder[]; total: number }> {
  const total = await Order.countDocuments();
  const data = await Order.find()
    .populate("user", "name email")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  return { data, total };
}