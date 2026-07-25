import Cookies from 'js-cookie'
import api from '../api/axios'
import { ENDPOINTS } from '../api/endpoints'
import type { LoginValues, RegisterValues, User } from '../types/auth'

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string }

function toError(err: any): ActionResult<never> {
  const res = err?.response?.data
  return { ok: false, message: res?.message || 'Something went wrong. Please try again.' }
}

const USER_COOKIE_OPTS = { expires: 7, sameSite: 'lax' as const, path: '/' }

// REGISTER
export async function registerAction(values: RegisterValues): Promise<ActionResult<User>> {
  try {
    const { data } = await api.post(ENDPOINTS.auth.register, {
      name: values.name, email: values.email, password: values.password,
    })
    const user = data.data.user as User
    Cookies.set('token', data.data.token, USER_COOKIE_OPTS)
    Cookies.set('user', JSON.stringify(user), USER_COOKIE_OPTS)
    return { ok: true, data: user }
  } catch (err) { return toError(err) }
}

// LOGIN
export async function loginAction(values: LoginValues): Promise<ActionResult<{ token: string; user: User }>> {
  try {
    const { data } = await api.post(ENDPOINTS.auth.login, values)
    const { token, user } = data.data
    Cookies.set('token', token, USER_COOKIE_OPTS)
    Cookies.set('user', JSON.stringify(user), USER_COOKIE_OPTS)
    return { ok: true, data: { token, user } }
  } catch (err) { return toError(err) }
}

// LOGOUT
export function logoutAction() {
  Cookies.remove('token')
  Cookies.remove('user')
  api.post(ENDPOINTS.auth.logout).catch(() => {})
}

// GET CACHED USER
export function getCurrentUser(): User | null {
  const raw = Cookies.get('user')
  if (!raw) return null
  try { return JSON.parse(raw) as User } catch { return null }
}

// WHOAMI — confirms with server, refreshes cache
export async function fetchMe(): Promise<User | null> {
  try {
    const { data } = await api.get(ENDPOINTS.auth.whoami)
    const user = data.data as User
    Cookies.set('user', JSON.stringify(user), USER_COOKIE_OPTS)
    return user
  } catch { return null }
}

// UPDATE PROFILE
export async function updateProfileAction(input: {
  name: string; email: string; avatar?: File | null
}): Promise<ActionResult<User>> {
  try {
    const fd = new FormData()
    fd.append('name', input.name)
    fd.append('email', input.email)
    if (input.avatar) fd.append('avatar', input.avatar)
    const { data } = await api.patch(ENDPOINTS.auth.update, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    const user = data.data as User
    Cookies.set('user', JSON.stringify(user), USER_COOKIE_OPTS)
    return { ok: true, data: user }
  } catch (err) { return toError(err) }
}

// CHANGE PASSWORD
export async function changePasswordAction(input: {
  currentPassword: string; newPassword: string
}): Promise<ActionResult<User>> {
  try {
    const fd = new FormData()
    fd.append('currentPassword', input.currentPassword)
    fd.append('newPassword', input.newPassword)
    const { data } = await api.patch(ENDPOINTS.auth.update, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return { ok: true, data: data.data as User }
  } catch (err) { return toError(err) }
}
