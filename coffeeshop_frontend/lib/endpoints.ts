const BASE = "/api/v1";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE}/auth/login`,
    REGISTER: `${BASE}/auth/register`,
    GOOGLE: `${BASE}/auth/google`,
    LOGOUT: `${BASE}/auth/logout`,
    WHOAMI: `${BASE}/auth/whoami`,
    UPDATE: `${BASE}/auth/update`,
    REQUEST_PASSWORD_CHANGE: `${BASE}/auth/change-password/request-code`,
    CONFIRM_PASSWORD_CHANGE: `${BASE}/auth/change-password/confirm`,
    FORGOT_PASSWORD_REQUEST: `${BASE}/auth/forgot-password/request`,
    FORGOT_PASSWORD_VERIFY: `${BASE}/auth/forgot-password/verify`,
    FORGOT_PASSWORD_RESET: `${BASE}/auth/forgot-password/reset`,
  },
  BEANS: {
    LIST: `${BASE}/beans`,
    DETAIL: (id: string) => `${BASE}/beans/${id}`,
  },
  CART: {
    GET: `${BASE}/cart`,
    ADD: `${BASE}/cart`,
    UPDATE: (beanId: string) => `${BASE}/cart/${beanId}`,
    REMOVE: (beanId: string) => `${BASE}/cart/${beanId}`,
    CLEAR: `${BASE}/cart`,
  },
  ORDERS: {
    CHECKOUT: `${BASE}/orders/checkout`,
    VERIFY: `${BASE}/orders/verify`,
    LIST: `${BASE}/orders`,
    DETAIL: (id: string) => `${BASE}/orders/${id}`,
  },
  WISHLIST: {
    LIST: `${BASE}/wishlist`,
    ADD: (beanId: string) => `${BASE}/wishlist/${beanId}`,
    DELETE: (beanId: string) => `${BASE}/wishlist/${beanId}`,
  },
  NOTIFICATIONS: {
    LIST: `${BASE}/notifications`,
    MARK_READ: (id: string) => `${BASE}/notifications/${id}/read`,
    MARK_ALL_READ: `${BASE}/notifications/read-all`,
  },
  ADMIN: {
    USERS: {
      LIST: `${BASE}/admin/users`,
      GET: (id: string) => `${BASE}/admin/users/${id}`,
      CREATE: `${BASE}/admin/users`,
      UPDATE: (id: string) => `${BASE}/admin/users/${id}`,
      DELETE: (id: string) => `${BASE}/admin/users/${id}`,
    },
    BEANS: {
      LIST: `${BASE}/admin/beans`,
      GET: (id: string) => `${BASE}/admin/beans/${id}`,
      CREATE: `${BASE}/admin/beans`,
      UPDATE: (id: string) => `${BASE}/admin/beans/${id}`,
      DELETE: (id: string) => `${BASE}/admin/beans/${id}`,
    },
    ORDERS: {
      LIST: `${BASE}/admin/orders`,
    },
  },
};