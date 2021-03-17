const express = require("express");
const app = express();
const { ensureAuthenticated } = require("../config/auth");
const Room = require("../models/room");
const User = require("../models/user");
const PrivateChat = require("../models/private_chat");
const router = express.Router();

router.get("/", ensureAuthenticated, async (req, res) => {
  let userlist = [];
  let id = req.user._id;

  await User.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        if (item.loggedin === true) {
          userlist.push({ name: item.name, id: item._id });
        }
      }
      //console.log('userlist: ' + userlist)
    }
  });
  let channels = [];
  await Room.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        channels.push(item.name);
      }
    }
  });
  let dm = [];
  await PrivateChat.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        dm.push(item.name);
      }
      res.render("dashboard.ejs", {
        user: req.user,
        channels: channels,
        userlist: userlist,
        dm: dm,
      });
    }
  });
});

router.post("/", ensureAuthenticated, (req, res) => {
  console.log('req.body ' + req.body.id)
  console.log('req.user.id ' + req.user.id)
  let dm_name = req.user.name + '-' + req.body.name;

  if (req.body.channelname) {
    const room = new Room({
      name: req.body.channelname,
    });

    room
      .save()
      .then((value) => {})
      .catch((error) => console.log(error));
    res.redirect("/");
  } else {
    const chat = PrivateChat.find().exec()

    if (!chat.length > 0) {
      const privateChat = new PrivateChat({
        name: dm_name,
        members: [req.body.id, req.user.id],
      });
      privateChat
        .save()
        .then((value) => {})
        .catch((error) => console.log(error));
      res.redirect('/dashboard');
    } else {
      PrivateChat.find((error, result) => {
        if (error) {
          console.log(error);
        } else {
          for (item of result) {
            if (item.members.includes(req.body && req.user.id)) {
              res.redirect("dashboard/d");
            } else {
              privateChat
                .save()
                .then((value) => {})
                .catch((error) => console.log(error));
              res.redirect("/dashboard/dm/:", req.body);
            }
          }
        }
      });
    }
  }
});

router.get("/dm/:name", ensureAuthenticated, async (req, res) => { 
  let userlist = [];
  let db_messages = [];
  let channels = [];
  let dm = [];
  let id = req.user._id;
  let dm_name = req.params.name;

  PrivateChat.findOne({ name: dm_name })
    .populate({
      path: "messages",
      populate: { path: "message_sender", model: "User" },
    })
    .exec(function (error, result) {
      if (error) {
        return HandleError(error);
      }
      //console.log(result)
      for (item of result.messages) {
        let message = {
          _id: item._id,
          message_sender: item.message_sender.name,
          message: item.message,
        };
        db_messages.push(message);
      }
    });

  await User.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        if (item.loggedin === true) {
          userlist.push({ name: item.name, id: item._id });
        }
      }
    }
  });

  await Room.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        channels.push(item.name);
      }
    }
  });

  await PrivateChat.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        dm.push(item.name);
      }

      res.render("private_room.ejs", {
        channelname: dm_name,
        user: req.user,
        channels: channels,
        userlist: userlist,
        messages: db_messages,
        dm: dm,
      });
    }
  });
});

router.get("/:name", ensureAuthenticated, async (req, res) => {
  let userlist = [];
  let db_messages = [];
  let channels = [];
  let dm = [];
  let id = req.user._id;
  let room_name = req.params.name;

  Room.findOne({ name: room_name })
    .populate({
      path: "messages",
      populate: { path: "message_sender", model: "User" },
    })
    .exec(function (error, result) {
      if (error) {
        return HandleError(error);
      }
      for (item of result.messages) {
        let message = {
          _id: item._id,
          message_sender: item.message_sender.name,
          message: item.message,
        };
        db_messages.push(message);
      }
    });

  await User.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        if (item.loggedin === true) {
          userlist.push({ name: item.name, id: item._id });
        }
      }
    }
  });

  await Room.find((error, result) => {
    if (error) {
      console.log(error);
    } else {
      for (item of result) {
        channels.push(item.name);
      }

      res.render("rooms.ejs", {
        channelname: room_name,
        user: req.user,
        channels: channels,
        userlist: userlist,
        messages: db_messages,
        dm: dm,
      });
    }
  });
});



module.exports = router;
