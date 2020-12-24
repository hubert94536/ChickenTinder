const { Op } = require('sequelize')
const { Accounts, Friends, Notifications } = require('./models')

var attributes = ['username', 'photo', 'name']

// Accept a friend request
const acceptRequest = async (req, res) => {
  try {
    const main = req.params.main
    const friend = req.params.friend
    // set status to friends for friend and main account ids
    const mainAccount = await Friends.update(
      { status: 'friends' },
      {
        where: {
          [Op.and]: [{ main_id: main }, { friend_id: friend }],
        },
      },
    )
    const friendAccount = await Friends.update(
      { status: 'friends' },
      {
        where: {
          [Op.and]: [{ main_id: friend }, { friend_id: main }],
        },
      },
    )
    if (mainAccount && friendAccount) {
      // update notification to main from pending friend request to friends
      await Notifications.update(
        { type: 'friends' },
        {
          where: {
            [Op.and]: [{ receiver_id: main }, { sender_id: friend }, { type: 'pending' }],
          },
        },
      )
      // create notification to friend for accepted friend request
      await Notifications.create({
        receiver_id: friend,
        type: 'accepted',
        sender_id: main,
        include: [Accounts],
      })
      return res.status(200).send('Friendship accepted')
    }
    return res.status(404).send('Friendship not found')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Creates friendship requests between both accounts
const createFriends = async (req, res) => {
  try {
    const main = req.params.main
    const friend = req.params.friend
    // create pending and requested friendship statuses
    await Friends.bulkCreate([
      { main_id: main, status: 'requested', friend_id: friend, include: [Accounts] },
      { main_id: friend, status: 'pending', friend_id: main, include: [Accounts] },
    ])
    // create notification to friend for pending friend request
    await Notifications.create({
      receiver_id: friend,
      type: 'pending',
      sender_id: main,
      include: [Accounts],
    })
    return res.status(201).send('Friend requested')
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

// Delete a friendship
const deleteFriendship = async (req, res) => {
  try {
    const main = req.params.main
    const friend = req.params.friend
    // delete friendship rows for both main and friend
    const destroyed = await Friends.destroy({
      where: {
        [Op.or]: [
          { [Op.and]: [{ main_id: friend }, { friend_id: main }] },
          { [Op.and]: [{ main_id: main }, { friend_id: friend }] },
        ],
      },
    })
    if (destroyed) {
      return res.status(204).send('Friendship deleted')
    }
    return res.status(404).send('Friendship not found')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Get all user friends/requests
const getFriends = async (req, res) => {
  try {
    const friends = await Friends.findAll({
      where: { main_id: req.params.id },
      include: [
        {
          model: Accounts,
          attributes: attributes,
        },
      ],
    })
    return res.status(200).json({ friends })
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  acceptRequest,
  createFriends,
  deleteFriendship,
  getFriends,
}
