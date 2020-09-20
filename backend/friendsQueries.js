const { Accounts, Friends } = require("./models");
const { Op } = require("sequelize");

const createFriends = async (req, res) => {
    try {
        const main = req.body.params.main_user;
        const friend = req.body.params.friend_user;
        const user = await Friends.create(
            {
                main_user: main,
                f_status: "requested",
                friend_user: {
                    username: friend
                }
                

            },
            {
                include: [Accounts]
            }
        );
        const friendUser = await Friends.create(
            {
                main_user: friend,
                f_status: "pending request",
                friend_user: {
                    username: main
                }
                

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

// const createFriends = async (req, res) => {
//     try {
//         const main = req.body.params.main;
//         const friend = req.body.params.friend;
//         const user = await Friends.create(
//             {
//                 main_user: main,
//                 f_status: "requested",
//                 friend_user: friend

//             }
//         );
//         const friendUser = await Friends.create(
//             {
//                 main_user: friend,
//                 f_status: "pending request",
//                 friend_user: main
//             }
//         );
//         return res.status(201).json({
//             user
//         });
//     } catch (error) {
//         return res.status(500).json({ error: error.message})
//     }
// }

const getUserFriends = async (req, res) => {
    try {
        const friends = await Friends.findAll({
            where: {
                [Op.and]: [
                    { main_user: req.params.user},
                    { f_status: "accepted"}
                  ] }
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
                { main_user: req.params.user},
                { f_status: "pending request"}
              ] }

            
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
        const account_1 = await Friends.update({f_status: accepted}, {
            where: { main_user: main, friend_user: friend }
        });
        const account_2 = await Friends.update({f_status: accepted}, {
            where: { main_user: friend, friend_user: main }
        });
        if (account_1 && account_2) {
            const updatedAccount_1 = await Friends.findOne({ where: { main_user: main, friend_user: friend} });
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
            where: { main_user: main, friend_user: friend }
        });
        const deleted_2 = await Friends.destroy( {
            where: { main_user: friend, friend_user: main }
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
