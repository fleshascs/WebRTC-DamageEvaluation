const uploadService = require('./uploads.service');

module.exports = {
  download,
  getRoomUploads,
  upload
};

function download(req, res) {
  const path = req.params[0];
  res.sendFile(path, { root: `./public/uploads/rooms/${req.params.roomId}` });
}

function getRoomUploads(req, res, next) {
  uploadService
    .getByRoomId(req.params.roomId)
    .then((images) => res.json(images))
    .catch(next);
}

function upload(req, res, next) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  if (!req.files.sampleFile.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return next(new Error('Only image files are allowed!'), false);
  }

  const roomId = req.params.roomId;
  uploadService
    .upload(req.files, req.params.roomId)
    .then(({ publicPath }) => uploadService.saveUploadToDB(publicPath, req.user.id, roomId))
    .then((file) => res.json(file))
    .catch(next);
}
