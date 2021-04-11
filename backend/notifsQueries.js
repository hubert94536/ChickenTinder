const { Accounts, Notifications } = require('./models')
const { Op } = require("sequelize")

var attributes = ['username', 'photo', 'name']
// Creates notification
const createNotif = async (req) => {
  try {
    await Notifications.create({
      receiver_uid: req.body.receiver_uid,
      type: req.body.type,
      content: req.body.content,
      sender_uid: req.body.sender_uid,
      include: [Accounts],
    })
    return Promise.resolve(201)
  } catch (error) {
    console.error(error)
    return Promise.reject(500)
  }
}

// Delete a notification
const deleteNotif = async (req, res) => {
  try {
    const id = req.body.id
    const destroyed = await Notifications.destroy({
      where: { id: id },
    })
    if (destroyed) {
      return res.status(204).send('Notification deleted')
    }
    return res.status(404).send('Notification not found')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Get all notifications
const getAllNotifs = async (req, res) => {
  try {
    const notifs = await Notifications.findAll({
      include: [
        {
          model: Accounts,
          attributes: attributes,
        },
      ],
    })
    return res.status(200).json({ notifs })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Get all user notifications
const getNotifs = async (req, res) => {
  try {
    const uid = req.authId
    const notifs = await Notifications.findAll({
      where: { receiver_uid: uid },
      include: [
        {
          model: Accounts,
          attributes: attributes,
        },
      ],
    })

    await Notifications.update(
      { read: true },
      {
        where: {
          id: {
              [Op.in]: notifs.map(notif => notif.id)
          }
        }
      }
    )

    return res.status(200).json({ notifs })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Update notif by id
const updateNotif = async (id, type) => {
  try {
    const updated = await Notifications.update(
      { type: type },
      {
        where: { id: id },
      },
    )
    if (updated) {
      return Promise.resolve(200)
    }
    return Promise.reject(404)
  } catch (error) {
    console.error(error)
    return Promise.reject(error)
  }
}

module.exports = {
  createNotif,
  deleteNotif,
  getAllNotifs,
  getNotifs,
  updateNotif,
}
