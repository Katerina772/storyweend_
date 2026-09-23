import * as memberService from "../services/projectMember.service.js";
import { ApiError } from "../utils/ApiError.js";

const VALID_ROLES = ["OWNER", "EDITOR", "AUTHOR", "VIEWER"];

function validateRole(role) {
  if (!VALID_ROLES.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }
}

export async function list(req, res, next) {
  try {
    const members = await memberService.listMembers(req.params.projectId);
    res.json({ members });
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    const { email, role } = req.body || {};
    if (!email) throw new ApiError(400, "Email is required");
    validateRole(role || "VIEWER");

    const member = await memberService.addMemberByEmail(
      req.params.projectId,
      email,
      role || "VIEWER",
    );
    res.status(201).json({ member });
  } catch (err) {
    next(err);
  }
}

export async function updateRole(req, res, next) {
  try {
    const { role } = req.body || {};
    validateRole(role);

    const member = await memberService.updateMemberRole(
      req.params.projectId,
      req.params.memberId,
      role,
    );
    res.json({ member });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await memberService.removeMember(
      req.params.projectId,
      req.params.memberId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
