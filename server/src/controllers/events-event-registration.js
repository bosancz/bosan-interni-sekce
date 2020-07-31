const config = require("../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

var fs = require("fs-extra");
var path = require("path");

var multer = require("multer");
var upload = multer({ dest: config.uploads.dir })

var validate = require("../validator");

var Event = require("../models/event");

routes.get("event:registration", "/", { permission: "events:registration:read", query: { registration: { $exists: true, $ne: null } } }).handle(async (req, res, next) => {

  var eventDir = config.events.eventDir(event._id);
  var registrationFile = path.join(eventDir, event.registration);

  if (await fs.pathExists(registrationFile)) res.sendFile(registrationFile);
  else res.sendStatus(404);
});

routes.put("event:registration", "/", { permission: "events:registration:edit" }).handle(upload.single("file"), async (req, res, next) => {

  var event = await Event.findOne({ _id: req.params.id });

  try {

    var file = req.file;
    if (!file) throw new Error("Missing file");

    var eventDir = config.events.eventDir(event._id);
    var originalPath = req.file.path;
    var storagePath = path.join(eventDir, "registration.pdf");

    await fs.ensureDir(eventDir);

    await fs.remove(storagePath);

    await fs.move(originalPath, storagePath);
  }
  catch (err) {
    err.name = "UploadError";
    throw err;
  }

  event.registration = "registration.pdf";
  await event.save()

  res.sendStatus(204);
});

routes.delete("event:registration", "/", { permission: "events:registration:delete" }).handle(async (req, res, next) => {
  var event = await Event.findOne({ _id: req.params.id });

  if (!event.registration) return res.sendStatus(404);

  var eventDir = config.events.eventDir(event._id);
  var registrationFile = path.join(eventDir, event.registration);

  await fs.remove(registrationFile);

  event.registration = null;
  await event.save();

  res.sendStatus(204);
});