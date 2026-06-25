import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
})

export async function sendOTP(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: 'Your OTP Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Use the OTP below to verify your email address:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  })
}

export async function sendPasswordReset(to: string, otp: string): Promise<void> {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Use the OTP below to reset your password:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; padding: 16px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
          ${otp}
        </div>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
  })
}

export async function sendOrderConfirmation(to: string, orderNumber: string): Promise<void> {
  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: `Order Confirmation - #${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase.</p>
        <p>Your order number is:</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 12px; background: #f5f5f5; border-radius: 8px; margin: 16px 0;">
          #${orderNumber}
        </div>
        <p>We will notify you once your order is shipped.</p>
        <p>If you have any questions, contact our support team.</p>
      </div>
    `,
  })
}
