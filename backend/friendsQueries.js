const Accounts = require("./accountsModel");
const Friends = require("./friendsModel");

const createFriends = async (req, res) => {
    try {
        const main = req.body.main_user;
        const friend = req.body.friend_user;
        const friends1 = await Friends.create(
            {
                main_user: main,
                status: "requested",
                friend_user: {
                    username: friend
                }
                

            },
            {
                include: [Accounts]
            }
        );
        const friends2 = await Friends.create(
            {
                main_user: friend,
                status: "pending request",
                friend_user: {
                    username: main
                }
                

            },
            {
                include: [Accounts]
            }
        );
        return res.status(201).json({
            friends1, friends2
        });
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: error.message})
    }
}

const getAllFriends = async (req, res) => {
    try {
        const main = req.main_user;
        const friends = await Friends.findAll({
            where: { main_user: main, status: "accepted" },
        });
        return res.status(200).json({ friends });
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message);
    }
}

const acceptAccounts = async (req, res) => {
    try {
        const main = req.main_user;
        const friend = req.friend_user;
        const account_1 = await Friends.update({status: "accepted"}, {
            where: { main_user: main, friend_user: friend }
        });
        const account_2 = await Friends.update({status: "accepted"}, {
            where: { main_user: friend, friend_user: main }
        });
        if (account_1 && account_2) {
            const updatedAccount_1 = await Friends.findOne({ where: { main_user: main, friend_user: friend} });
            return res.status(200).json({ user: updatedAccount_1 });
        }
        throw new Error('Friendship not found');
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message);
    }
};
