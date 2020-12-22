const { Accounts, Notifications } = require('./models')
var attributes = ['username', 'photo', 'name']

// Creates notification
const createNotif = async (req) => {
  try {
    await Notifications.create({
      receiver_id: req.body.receiver_id,
      type: req.body.type,
      content: req.body.content,
      sender_id: req.body.sender_id,
      include: [Accounts],
    })
    Promise.resolve(201)
  } catch (error) {
    console.log(error)
    return Promise.reject(500)
  }
}

// Delete a notification
const deleteNotif = async (req, res) => {
  try {
    const id = req.params.id
    const destroyed = await Notifications.destroy({
      where: { id: id },
    })
    if (destroyed) {
      return res.status(204).send('Notification deleted')
    }
    return res.status(404).send('Notification not found')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Get all user notifications
const getNotifs = async (req, res) => {
  try {
    const id = req.params.id
    const notifs = await Notifications.findAll({
      where: { receiver_id: id },
      include: [
        {
          model: Accounts,
          attributes: attributes,
        },
      ],
    })
    return res.status(200).json({ notifs })
  } catch (error) {
    console.log(error)
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
    console.log(error)
    return Promise.reject(error)
  }
}

module.exports = {
  createNotif,
  deleteNotif,
  getNotifs,
  updateNotif,
}
