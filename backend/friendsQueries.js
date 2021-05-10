const { Op } = require('sequelize')
const { Accounts, Friends, Notifications } = require('./models')

var attributes = ['username', 'photo', 'name']
import crashlytics from '@react-native-firebase/crashlytics'

// Accept a friend request
const acceptRequest = async (req, res) => {
  try {
    const main = req.authId
    const friend = req.body.friend
    // set status to friends for friend and main account uids
    const status = await Friends.update(
      { status: 'friends' },
      {
        where: {
          [Op.or]: [
            { [Op.and]: [{ main_uid: friend }, { friend_uid: main }] },
            { [Op.and]: [{ main_uid: main }, { friend_uid: friend }] },
          ],
        },
      },
    )
    if (status) {
      // update notification to main from pending friend request to friends
      await Notifications.update(
        { type: 'friends' },
        {
          where: {
            [Op.and]: [{ receiver_uid: main }, { sender_uid: friend }, { type: 'pending' }],
          },
        },
      )
      // create notification to friend for accepted friend request
      await Notifications.create({
        receiver_uid: friend,
        type: 'accepted',
        sender_uid: main,
        include: [Accounts],
      })
      return res.status(200).send('Friendship accepted')
    }
    return res.status(404).send('Friendship not found')
  } catch (error) {
    crashlytics().recordError(error)
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Creates friendship requests between both accounts
const createFriends = async (req, res) => {
  try {
    const main = req.authId
    const friend = req.body.friend
    // create pending and requested friendship statuses
    await Friends.bulkCreate([
      { main_uid: main, status: 'requested', friend_uid: friend, include: [Accounts] },
      { main_uid: friend, status: 'pending', friend_uid: main, include: [Accounts] },
    ])
    // create notification to friend for pending friend request
    await Notifications.create({
      receiver_uid: friend,
      type: 'pending',
      sender_uid: main,
      include: [Accounts],
    })
    return res.status(201).send('Friend requested')
  } catch (error) {
    crashlytics().recordError(error)
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}

// Delete a friendship
const deleteFriendship = async (req, res) => {
  try {
    const main = req.authId
    const friend = req.body.friend
    // delete friendship rows for both main and friend
    const destroyed = await Friends.destroy({
      where: {
        [Op.or]: [
          { [Op.and]: [{ main_uid: friend }, { friend_uid: main }] },
          { [Op.and]: [{ main_uid: main }, { friend_uid: friend }] },
        ],
      },
    })
    if (destroyed) {
      return res.status(204).send('Friendship deleted')
    }
    return res.status(404).send('Friendship not found')
  } catch (error) {
    crashlytics().recordError(error)
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Get all user friends/requests
const getFriends = async (req, res) => {
  try {
    const friends = await Friends.findAll({
      where: { main_uid: req.authId },
      include: [
        {
          model: Accounts,
          attributes: attributes,
        },
      ],
    })
    return res.status(200).json({ friends })
  } catch (error) {
    crashlytics().recordError(error)
    return res.status(500).send(error.message)
  }
}

// Creates friendship requests between both accounts
const createTestFriends = async (req, res) => {
  try {
    const main = req.body.uid
    const friend = req.body.friend
    // create pending and requested friendship statuses
    await Friends.bulkCreate([
      { main_uid: main, status: 'requested', friend_uid: friend, include: [Accounts] },
      { main_uid: friend, status: 'pending', friend_uid: main, include: [Accounts] },
    ])
    // create notification to friend for pending friend request
    await Notifications.create({
      receiver_uid: friend,
      type: 'pending',
      sender_uid: main,
      include: [Accounts],
    })
    return res.status(201).send('Friend requested')
  } catch (error) {
    crashlytics().recordError(error)
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}
// Accept a friend request
const acceptTestRequest = async (req, res) => {
  try {
    const main = req.body.uid
    const friend = req.body.friend
    // set status to friends for friend and main account uids
    const status = await Friends.update(
      { status: 'friends' },
      {
        where: {
          [Op.or]: [
            { [Op.and]: [{ main_uid: friend }, { friend_uid: main }] },
            { [Op.and]: [{ main_uid: main }, { friend_uid: friend }] },
          ],
        },
      },
    )
    if (status) {
      // update notification to main from pending friend request to friends
      await Notifications.update(
        { type: 'friends' },
        {
          where: {
            [Op.and]: [{ receiver_uid: main }, { sender_uid: friend }, { type: 'pending' }],
          },
        },
      )
      // create notification to friend for accepted friend request
      await Notifications.create({
        receiver_uid: friend,
        type: 'accepted',
        sender_uid: main,
        include: [Accounts],
      })
      return res.status(200).send('Friendship accepted')
    }
    return res.status(404).send('Friendship not found')
  } catch (error) {
    crashlytics().recordError(error)
    console.error(error)
    return res.status(500).send(error.message)
  }
}

const getAllFriends = async (req, res) => {
  try {
    const friends = await Friends.findAll({
      include: [
        {
          model: Accounts,
          attributes: attributes,
        },
      ],
    })
    return res.status(200).json({ friends })
  } catch (error) {
    crashlytics().recordError(error)
    return res.status(500).send(error.message)
  }
}

module.exports = {
  acceptRequest,
  createFriends,
  deleteFriendship,
  getAllFriends,
  createTestFriends,
  acceptTestRequest,
  getFriends,
}
