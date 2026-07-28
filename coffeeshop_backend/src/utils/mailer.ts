import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

function getTransporter() {
  return nodemailer.createTransport({ service: "gmail", auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
}

function otpEmailHtml(heading: string, message: string, code: string) {
  return `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
    <h2 style="color:#5C3A21;">${heading}</h2>
    <p>${message} This code expires in 10 minutes.</p>
    <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background:#FAF3E9; padding: 16px; text-align:center; border-radius: 8px; margin: 20px 0; color:#3B2318;">${code}</div>
    <p style="color:#8a8a8a; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
  </div>`;
}

export async function sendPasswordChangeCode(to: string, code: string) {
  await getTransporter().sendMail({
    from: `"CoffeeShop" <${process.env.EMAIL_USER}>`, to,
    subject: "Your CoffeeShop password change code",
    html: otpEmailHtml("Confirm your password change", "Use the code below to confirm changing your CoffeeShop password.", code),
  });
}

export async function sendForgotPasswordCode(to: string, code: string) {
  await getTransporter().sendMail({
    from: `"CoffeeShop" <${process.env.EMAIL_USER}>`, to,
    subject: "Reset your CoffeeShop password",
    html: otpEmailHtml("Reset your password", "Use the code below to verify it's you and set a new password.", code),
  });
}

export async function sendOrderConfirmation(to: string, orderId: string, total: number) {
  await getTransporter().sendMail({
    from: `"CoffeeShop" <${process.env.EMAIL_USER}>`, to,
    subject: "Your CoffeeShop order is confirmed",
    html: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#5C3A21;">Thanks for your order!</h2>
      <p>Order <strong>${orderId}</strong> has been confirmed.</p>
      <p>Total paid: <strong>NPR ${total}</strong></p>
    </div>`,
  });
}