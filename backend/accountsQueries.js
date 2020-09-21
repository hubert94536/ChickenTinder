const { Accounts } = require('./models.js')
const { Sequelize, Op } = require('sequelize')

// Get all accounts
const getAllAccounts = async (req, res) => {
  try {
    const users = await Accounts.findAll()
    return res.status(200).json({ users })
  } catch (error) {
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
        username: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('username')), 'LIKE', text + '%')
      }
    })
    return res.status(200).json({ users })
  } catch (error) {
    console.log(error)
    return res.status(500).send(error.message)
  }
}

// Creates account
const createAccount = async (req, res) => {
  try {
    const user = await Accounts.create(req.body.params)
    return res.status(201).json({ user })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Get the account by id
const getAccountById = async (req, res) => {
  try {
    const { id } = req.params
    const user = await Accounts.findOne({
      where: { id: id }
    })
    if (user) {
      return res.status(200).json({ user })
    }
    return res.status(404).send('User with the specified ID does not exists')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

// Update account by id
const updateAccount = async (req, res) => {
  try {
    const { id } = req.params
    const [updated] = await Accounts.update(req.body.params, {
      where: { id: id }
    })
    if (updated) {
      const updatedAccount = await Accounts.findOne({ where: { id: id } })
      return res.status(200).json({ user: updatedAccount })
    }
    throw new Error('User not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

// Delete account by id
const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Accounts.destroy({
      where: { id: id }
    })
    if (deleted) {
      return res.status(204).send('User deleted')
    }
    throw new Error('User not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

// Check if username exists
const checkUsername = async (req, res) => {
  try {
    const { username } = req.params
    const user = await Accounts.findOne({
      where: { username: username }
    })
    if (user) {
      return res.status(404).send('Username found')
    }
    return res.status(200).send('Username not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

// Check if phone number exists
const checkPhoneNumber = async (req, res) => {
  try {
    const { phone_number } = req.params
    const user = await Accounts.findOne({
      where: { phone_number: phone_number }
    })
    if (user) {
      return res.status(404).send('Phone number found')
    }
    return res.status(200).send('Phone number not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  createAccount,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  checkUsername,
  checkPhoneNumber,
  searchAccounts
}
