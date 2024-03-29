const { Op } = require('sequelize')
const { hdel } = require('./config.js')
const { Accounts, Friends, Notifications } = require('./models.js')

// Check if email exists
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body
    const user = await Accounts.findOne({
      where: { email: email },
    })
    if (user) {
      return res.status(404).send('Email unavailable')
    }
    return res.status(200).send('Email available')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Check if phone number exists
const checkPhoneNumber = async (req, res) => {
  try {
    const { phone_number } = req.body
    const user = await Accounts.findOne({
      where: { phone_number: phone_number },
    })
    if (user) {
      return res.status(404).send('Phone number unavailable')
    }
    return res.status(200).send('Phone number available')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Check if username exists
const checkUsername = async (req, res) => {
  try {
    const { username } = req.body
    const user = await Accounts.findOne({ where: { username: username } })
    if (user) {
      return res.status(404).send('Username unavailable')
    }
    return res.status(200).send('Username available')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Creates account
const createAccount = async (req, res) => {
  try {
    await Accounts.create({
      uid: req.authId,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      photo: req.body.photo,
      phone_number: req.body.phone_number,
    })
    return res.status(201).send('Account created')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}
// TODO: for testing purposes only
const createTestAccount = async (req, res) => {
  try {
    await Accounts.create({
      uid: req.body.uid,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      photo: req.body.photo,
      phone_number: req.body.phone_number,
    })
    return res.status(201).send('Account created')
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}

// Delete account by uid
const deleteTestAccount = async (req, res) => {
  try {
    const uid = req.body.uid
    await Friends.destroy({
      where: {
        [Op.or]: [
          {
            main_uid: uid,
          },
          {
            friend_uid: uid,
          },
        ],
      },
    })
    await Notifications.destroy({
      where: {
        [Op.or]: [
          {
            receiver_uid: uid,
          },
          {
            sender_uid: uid,
          },
        ],
      },
    })
    const deleted = await Accounts.destroy({
      where: { uid: uid },
    })
    if (deleted) {
      return res.status(204).send('User deleted')
    }
    return res.status(404).send('User with the specified UID does not exists')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Delete account by uid
const deleteAccount = async (req, res) => {
  try {
    const uid = req.authId
    await Friends.destroy({
      where: {
        [Op.or]: [
          {
            main_uid: uid,
          },
          {
            friend_uid: uid,
          },
        ],
      },
    })
    await Notifications.destroy({
      where: {
        [Op.or]: [
          {
            receiver_uid: uid,
          },
          {
            sender_uid: uid,
          },
        ],
      },
    })
    const deleted = await Accounts.destroy({
      where: { uid: uid },
    })
    if (deleted) {
      await hdel(`users:${uid}`, 'client', 'regtoken')
      return res.status(204).send('User deleted')
    }
    return res.status(404).send('User with the specified UID does not exists')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Get the account by uid
const getAccountByUID = async (req, res) => {
  try {
    const uid = req.authId
    const user = await Accounts.findOne({ where: { uid: uid } })
    if (user) {
      return res.status(200).json({ user })
    }
    return res.status(404).send('User with the specified UID does not exists')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Get all accounts
const getAllAccounts = async (req, res) => {
  try {
    const users = await Accounts.findAll()
    return res.status(200).json({ users })
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

// Update account by uid
const updateAccount = async (req, res) => {
  try {
    const uid = req.authId
    const updated = await Accounts.update(req.body, {
      where: { uid: uid },
    })
    if (updated) {
      return res.status(200).send('Updated account info')
    }
    return res.status(404).send('User with the specified UID does not exists')
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

// Get first 100 account usernames or names starting with input letters
const searchAccounts = async (req, res) => {
  try {
    const { text } = req.body
    const users = await Accounts.findAndCountAll({
      limit: 100,
      where: {
        [Op.or]: [
          {
            username: { [Op.iLike]: `%${text}%` },
          },
          {
            name: { [Op.iLike]: `%${text}%` },
          },
        ],
      },
      attributes: ['uid', 'name', 'username', 'photo'],
    })
    return res.status(200).json({ users })
  } catch (error) {
    console.error(error)
    return res.status(500).send(error.message)
  }
}

module.exports = {
  checkEmail,
  checkPhoneNumber,
  checkUsername,
  createAccount,
  createTestAccount,
  deleteAccount,
  deleteTestAccount,
  getAccountByUID,
  getAllAccounts,
  searchAccounts,
  updateAccount,
}
