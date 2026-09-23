import { ApiError } from "../utils/ApiError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(body) {
  const { username, email, password } = body || {};

  if (!username || typeof username !== "string" || username.trim().length < 3) {
    throw new ApiError(400, "Username must be at least 3 characters");
  }
  if (username.length > 50) {
    throw new ApiError(400, "Username must be at most 50 characters");
  }
  if (!email || !EMAIL_RE.test(email)) {
    throw new ApiError(400, "Invalid email");
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }
}

export function validateLogin(body) {
  const { email, password } = body || {};
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
}
