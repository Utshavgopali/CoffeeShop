import { z } from 'zod'

export const LoginSchema = z.object({
  email:    z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const RegisterSchema = z
  .object({
    name:            z.string().trim().min(2, 'Name must be at least 2 characters'),
    email:           z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    password:        z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const UpdateProfileSchema = z.object({
  name:  z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
})

export const ChangePasswordSchema = z
  .object({
    currentPassword:  z.string().min(1, 'Current password is required'),
    newPassword:      z.string().min(6, 'New password must be at least 6 characters'),
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })

export type LoginValues          = z.infer<typeof LoginSchema>
export type RegisterValues       = z.infer<typeof RegisterSchema>
export type UpdateProfileValues  = z.infer<typeof UpdateProfileSchema>
export type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>

export interface User {
  id:        string
  name:      string
  email:     string
  avatar:    string | null
  createdAt: string
  updatedAt: string
}
