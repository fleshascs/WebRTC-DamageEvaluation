const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const authorizeRoom = require('../_middleware/authorizeRoom');
const Role = require('../_helpers/role');
const roomService = require('./room.service');
const participantService = require('./roomParticipant.service');
const uploadController = require('./uploads.controller');

// routes
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.post('/', authorize(), createSchema, create);
router.post('/:roomId/participants', authorize(), addParticipants);
router.post('/:roomId/uploads', authorize(), authorizeRoom, uploadController.upload);
router.get('/:roomId/participants', authorize(), authorizeRoom, getParticipants);
router.get('/:roomId/uploads/*', authorize(), authorizeRoom, uploadController.download);
router.get('/:roomId/uploads', authorize(), authorizeRoom, uploadController.getRoomUploads);

module.exports = router;

function getById(req, res, next) {
  roomService
    .getById(req.params.id)
    .then((room) => (room ? res.json(room) : res.sendStatus(404)))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    roomName: Joi.string().required(),
    scheduledFor: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  req.body.createdBy = req.user.id;
  roomService
    .create(req.body)
    .then((room) => res.json(room))
    .catch(next);
}

function getAll(req, res, next) {
  roomService
    .getAll(req.user.id)
    .then((rooms) => res.json(rooms))
    .catch(next);
}

function addParticipants(req, res, next) {
  participantService
    .addParticipant(req.params.roomId, req.body.participantIds)
    .then((x) => res.json(x))
    .catch(next);
}

function getParticipants(req, res, next) {
  participantService
    .getAll(req.params.roomId)
    .then((x) => res.json(x))
    .catch(next);
}
