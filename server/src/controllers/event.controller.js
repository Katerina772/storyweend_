import * as eventService from "../services/event.service.js";
import * as linkService from "../services/eventCharacter.service.js";
import {
  validateCreateEvent,
  validateUpdateEvent,
} from "../validators/event.validator.js";
import { ApiError } from "../utils/ApiError.js";

// --- Події ---

export async function create(req, res, next) {
  try {
    validateCreateEvent(req.body);
    const event = await eventService.createEvent(
      req.params.projectId,
      req.userId,
      req.body,
    );
    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const filters = {
      locationId: req.query.locationId,
      search: req.query.search,
    };
    const events = await eventService.listEvents(req.params.projectId, filters);
    res.json({ events });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const event = await eventService.getEventById(
      req.params.projectId,
      req.params.eventId,
    );
    res.json({ event });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    validateUpdateEvent(req.body);
    const event = await eventService.updateEvent(
      req.params.projectId,
      req.params.eventId,
      req.body,
    );
    res.json({ event });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await eventService.deleteEvent(
      req.params.projectId,
      req.params.eventId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// --- Зв’язки подія-персонаж ---

export async function addCharacter(req, res, next) {
  try {
    const { eventId, characterId, role } = req.body || {};
    if (!eventId || !characterId) {
      throw new ApiError(400, "eventId and characterId are required");
    }

    const link = await linkService.addCharacterToEvent(req.params.projectId, {
      eventId,
      characterId,
      role,
    });
    res.status(201).json({ link });
  } catch (err) {
    next(err);
  }
}

export async function listCharactersForEvent(req, res, next) {
  try {
    const links = await linkService.listCharactersForEvent(
      req.params.projectId,
      req.params.eventId,
    );
    res.json({ links });
  } catch (err) {
    next(err);
  }
}

export async function listEventsForCharacter(req, res, next) {
  try {
    const links = await linkService.listEventsForCharacter(
      req.params.projectId,
      req.params.characterId,
    );
    res.json({ links });
  } catch (err) {
    next(err);
  }
}

export async function updateLink(req, res, next) {
  try {
    const { role } = req.body || {};
    const link = await linkService.updateLinkRole(
      req.params.projectId,
      req.params.linkId,
      role ?? null,
    );
    res.json({ link });
  } catch (err) {
    next(err);
  }
}

export async function deleteLink(req, res, next) {
  try {
    const result = await linkService.deleteLink(
      req.params.projectId,
      req.params.linkId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
