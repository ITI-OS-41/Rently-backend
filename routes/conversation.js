/** @format */

const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conv

router.post("/", async (req, res) => {
	Conversation.requiredFields();
	// req.body.sender = req.user.id;
  console.log(req.body)
	const newConversation = new Conversation(req.body);

	try {
		const savedConversation = await newConversation.save();
		res.status(200).json(savedConversation);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get conv of a user

router.get("/:userId", async (req, res) => {
	try {
		const conversation = await Conversation.find({
			members: { $in: [req.params.userId] },
		});
		res.status(200).json(conversation);
	} catch (err) {
		res.status(500).json(err);
	}
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
	try {
		const conversation = await Conversation.findOne({
			members: { $all: [req.params.firstUserId, req.params.secondUserId] },
		});
		res.status(200).json(conversation);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.delete("/:id", async (req, res) => {
	const id = req.params.id;

	Conversation.findById(req.params.id)
		.then((conversation) => {
			if (conversation) {
				conversation.remove().then(() => {
					return res.status(200).send(conversation);
				});
			} else {
				return res.status(404).json({ msg: "conversation not found" });
			}
		})
		.catch((error) => {
			console.log(error);
			return res.status(500).send({ msg: "bad server" });
		});
});

module.exports = router;
