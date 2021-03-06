const express = require("express");
const router = express.Router();
const passport = require("passport");
const { PORT, DATABASE_URL } = require("../config/main");
const { Campaign } = require("../models/campaign");

router.get(
  "/campaigns",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Campaign.find({ author: req.user.id })
      .populate("author", "username")
      .then(campaigns => {
        res.json(campaigns);
      })
      .catch(err => {
        res.status(400).json({ error: "something went terribly wrong" });
      });
  }
);

router.post(
  "/campaigns",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const requiredFields = ["title", "players"];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!(field in req.body)) {
        const message = `Missing \`${field}\` in request body`;
        return res.status(400).send(message);
      }
    }
    Campaign.create({
      author: req.user.id,
      title: req.body.title,
      players: req.body.players
    })
      .then(savedCampaign => res.status(201).json(savedCampaign))
      .catch(err => {
        res.status(500).json({ error: "something went wrong" });
      });
  }
);

router.put(
  "/campaigns/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (!(req.params.id && req.body._id)) {
      res.status(400).json({
        error: "Request path id and request body id values must match"
      });
    }

    const updated = {};
    const updateableFields = ["title", "players"];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });

    Campaign.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedPost =>
        res
          .status(200)
          .json({ message: "campaign updated" })
          .end()
      )
      .catch(err => res.status(500).json({ message: "Something went wrong" }));
  }
);

router.delete(
  "/campaigns/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Campaign.findByIdAndRemove(req.params.id)
      .then(() => {
        res.status(204).json({ message: "campaign deleted" });
      })
      .catch(err => {
        res.status(500).json({ error: "something went terribly wrong" });
      });
  }
);

module.exports = router;
