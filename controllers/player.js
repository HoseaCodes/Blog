import Payments from "../models/player";
import Users  from "../models/user.js";


async function getPlayers(req, res) {
	try {
		const players = await Player.find();
		res.json(players);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function getbadges(req, res) {
	try {
		const players = await Player.find({username: req.params.username});
		res.json(players.badges);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function createPlayer(req, res) {
	try {
		const user = await Users.findById(req.user.id);
		if (!user) return res.status(400).json({ msg: "User does not exist" });

		let { username, paymentID } = req.body;

    	const { _id, name, email } = user;

		const newPlayer = new Player({
      		user_id: _id,
			name: name,
			email: email,
			username: username,
			paymentID: paymentID,
			rank: 0,
			reputation: 0,
			badges: {
				name: "New User",
				points: 10
			}
		});

		await newPlayer.save();
		res.json({ msg: "Player created successfully" });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function createbadge(req, res) {
	try {
		const { badge } = req.body;

        const player = await Player.findOneAndUpdate({ _id: req.params.id }, {
            badges: badge
        })

		if (!player) return res.status(400).json({ msg: "Plater does not exist" });


		res.json({ msg: "Badge assigned successfully" });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function deletePlayer(req, res) {
    try {

		await Player.findByIdAndDelete(req.params.id)

        logger.info(`Deleted player ${req.params.id} has been deleted`);

        res.json({ msg: `Deleted player: ${req.params.id}`  })
    } catch (err) {

        logger.error(err)

        return res.status(500).json({ msg: err.message })
    }
}

async function updatePlayer(req, res) {
    try {
        const { rank, username, reputation, paymentID, badges } = req.body;

        const originalBody = req.body

        await Player.findOneAndUpdate({ _id: req.params.id }, {
            rank, username, reputation, paymentID, badges
        })

        const preparedLog = `Changing the following: ${originalBody} to ${req.body} for the player ${username}`;

        logger.info(preparedLog);

        res.json({ msg: `Updated player ${username}` })
    } catch (err) {

        logger.error(err);

        return res.status(500).json({ msg: err.message });
    }
}



export {
	createPlayer,
	createbadge,
	getPlayers,
	getbadges,
	deletePlayer,
	updatePlayer
 };
