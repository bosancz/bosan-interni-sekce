const config = require("../../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = module.exports = new Routes();

const { sendNotifications } = require("../notifications");

var validate = require("../validator");

var deleteEvent = require("./events/delete-event");

var Event = require("../models/event");
var Payment = require("../models/payment");

var getEventSchema = {
  type: 'object',
  properties: {
    "select": { type: "string" },
    "populate": { type: "array", items: { enum: ["leaders"] } },
  },
  additionalProperties: false
};

// read the event document
routes.get("event","/",{permission:"events:read"}).handle(validate({query:getEventSchema}), async (req,res,next) => {
  const query = Event.findOne({_id:req.params.id},{},{autopopulate:false}).permission("events:read",req);

  query.populate("leaders","nickname name group role birthday");
  query.populate("attendees","nickname name group role birthday");

  var event = await query.toObject();

  if(!event) return res.sendStatus(404);

  req.routes.links(event,"event");
  res.json(event);
});

// change part of the events
routes.patch("event","/",{permission:"events:edit"}).handle(async (req,res,next) => {
  // update event in the database with new data
  await Event.findOneAndUpdate({_id:req.params.id},req.body);
  // return OK, no data
  res.sendStatus(204);
});


routes.delete("event","/",{permission:"events:delete", query: {status:"draft"}}).handle(async (req,res,next) => {
  await deleteEvent(req.params.id);
  res.sendStatus(204);
  sendNotifications({all: ["eventDeleted"], except: req.user._id});
});

routes.action("event:submit","/actions/submit", {permission:"events:submit", hideRoot: true, query: {status: "draft"}}).handle(async (req,res,next) => {
  const event = await Event.findOne({_id:req.params.id},"name status statusHistory leader", {autopopulate:false}).filterByPermission("events:submit", req);
  if(!event) return res.sendStatus(401);

  event.status  = "pending";
  event.statusNote = req.body.note || null;
  
  await event.save();

  res.sendStatus(200);

  sendNotifications({all: ["eventSubmitted"], except: req.user._id});
});

routes.action("event:reject","/actions/reject", {permission:"events:reject", hideRoot: true, query: { status: { $in: ["pending","public"] } }}).handle(async (req,res,next) => {
  const event = await Event.findOne({_id:req.params.id},"name status leaders", {autopopulate:false}).filterByPermission("events:reject", req);
  if(!event) return req.sendStatus(401);

  event.status = "draft";
  event.statusNote = req.body.note || null;
  
  await event.save();

  res.sendStatus(200);

  sendNotifications({ all: ["eventRejected"], members: { "myEventRejected": event.leaders }, except: req.user._id }, event);
});

routes.action("event:publish","/actions/publish", { permission:"events:publish", hideRoot: true, query: {status: { $in: ["draft","pending"] }} }).handle(async (req,res,next) => {
  const event = await Event.findOne({_id:req.params.id}, "name status leaders", {autopopulate:false}).filterByPermission("events:publish", req);
  if(!event) return req.sendStatus(401);
  
  event.status = "public";
  event.statusNote = req.body.note || null;
  
  await event.save()
  
  res.sendStatus(200);
  
  sendNotifications({all: ["eventPublished"], members: { "myEventPublished": event.leaders }, except: req.user._id},event);
});

routes.action("event:cancel","/actions/cancel", {permission:"events:cancel", hideRoot: true, query: {status: "public"}}).handle(async (req,res,next) => {
  const event = await Event.findOne({_id:req.params.id},"name status leaders",{autopopulate:false}).filterByPermission("events:cancel", req);
  if(!event) return req.sendStatus(401);
  
  event.status = "cancelled";
  event.statusNote = req.body.note || null;
  
  await event.save();
  
  res.sendStatus(200);
  
  sendNotifications({all: ["eventCancelled"], members: { "myEventCancelled": event.leaders }, except: req.user._id}, event);
});

routes.action("event:uncancel","/actions/uncancel", {permission:"events:cancel", hideRoot: true, query: {status: "cancelled"}}).handle(async (req,res,next) => {
  const event = await Event.findOne({_id:req.params.id},"name status leaders",{autopopulate:false}).filterByPermission("events:cancel", req);
  if(!event) return req.sendStatus(401);
  
  event.status = "public";
  event.statusNote = req.body.note || null;
  
  await event.save();
  
  res.sendStatus(200);
  
  sendNotifications({all: ["eventUncancelled"], members: { "myEventUncancelled": event.leaders }, except: req.user._id}, event);
});

routes.action("event:lead","/actions/lead", {permission:"events:lead", hideRoot: true, query: {leaders: { $size: 0 }}}).handle(async (req,res,next) => {

  if(!req.user || !req.user.member) return res.status(400).send("No member ID linked to this account.");

  await Event.findOneAndUpdate({_id:req.params.id},{leaders:[req.user.member]});

  res.sendStatus(200);
});

/*routes.action("event:finalize","/actions/finalize", {permission:"events:finalize", hideRoot: true, query: {status: "public"}}).handle(async (req,res,next) => {
  const event = await Event.findOne({_id:req.params.id},"name status leaders",{autopopulate:false});
  if(!event) return req.sendStatus(401);
  
  event.status = "finalized";
  await event.save()
  
  res.sendStatus(200);
  
  sendNotifications({all: ["eventFinalized"], except: req.user._id}, event);
});*/

routes.get("event:leaders","/leaders",{permission:"events:read"}).handle(async (req,res,next) => {

  // get event with populated leaders' members
  var event = await Event.findOne({_id:req.params.id}).select("leaders").populate("leaders","_id nickname name group");

  var leaders = event.leaders;

  req.routes.links(leaders,"member");
  res.json(leaders);
});

routes.child("/registration", require("./events-event-registration"));

routes.child("/accounting", require("./events-event-accounting"));

routes.child("/announcement", require("./events-event-announcement"));

routes.get("event:payments","/payments", {permission:"events:payments:list"}).handle(async (req,res,next) => {
  const payments = await Payment.find({event:req.params.id}).toObject();
  req.routes.links(payments,"payment");
  res.json(payments);
});
