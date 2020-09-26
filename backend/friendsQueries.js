const { Accounts, Friends } = require("./models");
const { Op } = require("sequelize");

const createFriends = async (req, res) => {
    try {
        const main = req.body.params.main;
        const friend = req.body.params.friend;
        const user = await Friends.create(
            {
                m_id: main,
                status: "requested",
                f_id: friend
                

            },
            {
                include: [Accounts]
            }
        );
        const friendUser = await Friends.create(
            {
                m_id: friend,
                status: "pending request",
                f_id: main
                

            },
            {
                include: [Accounts]
            }
        );
        return res.status(201).json({
            user
        });
    } catch (error) {
        return res.status(500).json({ error: error.message})
    }
}

var attributes = ['username', 'photo', 'name']

const getUserFriends = async (req, res) => {
    try {
        const friends = await Friends.findAll({
            where: {
                [Op.and]: [
                    { m_id: req.params.user},
                    { status: "accepted"}
                  ] },
            include: [{model: Accounts, attributes: attributes}]
            
        });
        return res.status(200).json({ friends });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const getUserRequests = async (req, res) => {
    try {
        const requests = await Friends.findAll({
            where: {
            [Op.and]: [
                { m_id: req.params.user},
                { status: "pending request"}
              ] },
              include: [{model: Accounts, attributes: attributes}]

        });
        return res.status(200).json({ requests });
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const acceptRequest = async (req, res) => {
    try {
        const main = req.params.user;
        const friend = req.params.friend;
        const accepted = req.body.params.accepted
        const account_1 = await Friends.update({status: accepted}, {
            where: { m_id: main, f_id: friend }
        });
        const account_2 = await Friends.update({status: accepted}, {
            where: { m_id: friend, f_id: main }
        });
        if (account_1 && account_2) {
            const updatedAccount_1 = await Friends.findOne({ where: { m_id: main, f_id: friend} });
            return res.status(200).json({ user: updatedAccount_1 });
        }
        return res.status(404).send("Friendship not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const deleteFriendship = async (req, res) => {
    try {
        const main = req.params.user;
        const friend = req.params.friend;
        const deleted_1 = await Friends.destroy( {
            where: { m_id: main, f_id: friend }
        });
        const deleted_2 = await Friends.destroy( {
            where: { m_id: friend, f_id: main }
        });
        if (deleted_1 && deleted_2) {
            return res.status(204).send("Friendship deleted");
        }
        return res.status(404).send("Friendship not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports =
{
    createFriends,
    getUserFriends,
    getUserRequests,
    acceptRequest,
    deleteFriendship
}
