import { isAxiosError } from "axios";

export function getApiErrorMessage(err: unknown, fallback = "Something went wrong"): string {
  if (isAxiosError(err)) {
    return (err.response?.data as { message?: string } | undefined)?.message || fallback;
  }
  return fallback;
}
