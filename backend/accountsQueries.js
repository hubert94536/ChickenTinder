const { Accounts, Friends, Notifications } = require('./models.js')
const { Op } = require('sequelize')

// Check if email exists
const checkEmail = async (req, res) => {
  try {
    const { email } = req.params
    const user = await Accounts.findOne({
      where: { email: email },
    })
    if (user) {
      return res.status(404).send('Email unavailable')
    }
    return res.status(200).send('Email available')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Check if phone number exists
const checkPhoneNumber = async (req, res) => {
  try {
    const { phone_number } = req.params
    const user = await Accounts.findOne({
      where: { phone_number: phone_number },
    })
    if (user) {
      return res.status(404).send('Phone number unavailable')
    }
    return res.status(200).send('Phone number available')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Check if username exists
const checkUsername = async (req, res) => {
  try {
    const { username } = req.params
    const user = await Accounts.findOne({ where: { username: username } })
    if (user) {
      return res.status(404).send('Username unavailable')
    }
    return res.status(200).send('Username available')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Creates account
const createAccount = async (req, res) => {
  try {
    await Accounts.create({
      id: req.body.params.id,
      name: req.body.params.name,
      username: req.body.params.username,
      email: req.body.params.email,
      photo: req.body.params.photo,
      phone_number: req.body.params.phone_number,
    })
    return res.status(201).send('Account created')
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}

// Delete account by id
// TODO: Delete their associated photo from S3
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params
    await Friends.destroy({
      where: {
        [Op.or]: [
          {
            main_id: id,
          },
          {
            friend_id: id,
          },
        ],
      },
    })
    await Notifications.destroy({
      where: {
        [Op.or]: [
          {
            receiver_id: id,
          },
          {
            sender_id: id,
          },
        ],
      },
    })
    const deleted = await Accounts.destroy({
      where: { id: id },
    })
    if (deleted) {
      return res.status(204).send('User deleted')
    }
    return res.status(404).send('User with the specified ID does not exists')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Get the account by id
const getAccountById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await Accounts.findOne({ where: { id: id } })
    if (user) {
      return res.status(200).json({ user })
    }
    return res.status(404).send('User with the specified ID does not exists')
  } catch (error) {
    console.log(error)
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

// Update account by id
// TODO: Transactions
const updateAccount = async (req, res) => {
  try {
    const { id } = req.params
    const updated = await Accounts.update(req.body.params, {
      where: { id: id },
    })
    if (updated) {
      return res.status(200).send('Updated account info')
    }
    return res.status(404).send('User with the specified ID does not exists')
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Get first 100 account usernames or names starting with input letters
const searchAccounts = async (req, res) => {
  try {
    const { text } = req.params
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
      attributes: ['id', 'name', 'username', 'photo'],
    })
    return res.status(200).json({ users })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

module.exports = {
  checkEmail,
  checkPhoneNumber,
  checkUsername,
  createAccount,
  deleteAccount,
  getAccountById,
  getAllAccounts,
  searchAccounts,
  updateAccount,
}
