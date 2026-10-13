import * as authService from "../services/auth.service.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/auth.validator.js";

export async function register(req, res, next) {
  try {
    validateRegister(req.body);
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    validateLogin(req.body);
    const result = await authService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const user = await authService.updateCurrentUser(req.userId, req.body);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
