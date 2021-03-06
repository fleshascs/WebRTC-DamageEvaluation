const participantService = require('../rooms/roomParticipant.service');

module.exports = authorizeRoom;

function authorizeRoom(req, res, next) {
  const participant = participantService.getByUserId(req.params.roomId, req.user.id);
  if (participant) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
}
