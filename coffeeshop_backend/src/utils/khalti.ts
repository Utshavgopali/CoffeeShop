import axios from "axios";

const KHALTI_BASE_URL = process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2";
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "";

interface InitiatePaymentParams {
  amountInPaisa: number; // Khalti expects the smallest currency unit (paisa)
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  returnUrl: string;
}

interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
}

/**
 * Starts a Khalti ePayment session. The customer is redirected to
 * `payment_url` to complete payment; Khalti then redirects back to
 * `returnUrl` with a `pidx` query param that we verify server-side.
 */
export async function initiateKhaltiPayment(
  params: InitiatePaymentParams
): Promise<KhaltiInitiateResponse> {
  const response = await axios.post(
    `${KHALTI_BASE_URL}/epayment/initiate/`,
    {
      return_url: params.returnUrl,
      website_url: process.env.FRONTEND_URL || "http://localhost:3000",
      amount: params.amountInPaisa,
      purchase_order_id: params.orderId,
      purchase_order_name: params.orderName,
      customer_info: {
        name: params.customerName,
        email: params.customerEmail,
        phone: params.customerPhone || "9800000000",
      },
    },
    {
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: "Completed" | "Pending" | "Expired" | "User canceled" | "Refunded" | string;
  transaction_id: string | null;
}

/**
 * Verifies a payment's final status directly with Khalti. Always trust
 * this server-side check rather than the client-side redirect params.
 */
export async function verifyKhaltiPayment(pidx: string): Promise<KhaltiLookupResponse> {
  const response = await axios.post(
    `${KHALTI_BASE_URL}/epayment/lookup/`,
    { pidx },
    {
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}