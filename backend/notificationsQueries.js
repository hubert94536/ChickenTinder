const { Accounts, Notifications } = require('./models')
var attributes = ['username', 'photo', 'name']

// Creates notification
const createNotif = async (rid, type, content, sid) => {
  try {
    await Notifications.create({
      receiver_id: rid,
      type: type,
      content: content,
      sender_id: sid,
      include: [Accounts]
    })
    return Promise.resolve(201)
  } catch (error) {
    return Promise.reject(500)
  }
}

// Delete a notification
const deleteNotif = async (req, res) => {
  try {
    const id = req.params.id
    const destroyed = await Notifications.destroy({
      where: { id: id }
    })
    if (destroyed) {
      return res.status(204).send('Notification deleted')
    }
    return res.status(404).send('Notification not found')
  } catch (error) {
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
    return res.status(500).send(error.message)
  }
}

// Update notif by id
const updateNotif = async (id, type) => {
  try {
    const updated = await Notifications.update({ type: type }, {
      where: { id: id },
    })
    if (updated) {
      return Promise.resolve(200)
    }
    return Promise.reject(404)
  } catch (error) {
    return Promise.reject(error)
  }
}



module.exports = {
  createNotif,
  deleteNotif,
  getNotifs,
  updateNotif
}
