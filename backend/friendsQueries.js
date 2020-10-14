const { Accounts, Friends } = require('./models')
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op
var attributes = ['username', 'photo', 'name']

// Creates friendship requests between both accounts
const createFriends = async (req, res) => {
  try {
    const main = req.body.params.main
    const friend = req.body.params.friend
    await Friends.bulkCreate([
      { m_id: main, status: 'Requested', f_id: friend, f_info: friend, include: [Accounts] },
      { m_id: friend, status: 'Pending Request', f_id: main, f_info: main, include: [Accounts] },
    ])
    return res.status(201).send('Friend requested')
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// Get all user friends/requests
const getFriends = async (req, res) => {
  try {
    const friends = await Friends.findAll({
      where: { m_id: req.params.user },
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

// Accept a friend request
const acceptRequest = async (req, res) => {
  try {
    const main = req.params.user
    const friend = req.params.friend
    const mainAccount = await Friends.update(
      { status: 'Accepted' },
      {
        where: {
          [Op.and]: [{ m_id: main }, { f_id: friend }],
        },
      },
    )
    const friendAccount = await Friends.update(
      { status: 'Accepted' },
      {
        where: {
          [Op.and]: [{ m_id: friend }, { f_id: main }],
        },
      },
    )
    if (mainAccount && friendAccount) {
      return res.status(200).send('Friendship accepted')
    }
    return res.status(404).send('Friendship not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

// Delete a friendship
const deleteFriendship = async (req, res) => {
  try {
    const main = req.params.user
    const friend = req.params.friend
    const destroyed = await Friends.destroy({
      where: {
        [Op.or]: [
          { [Op.and]: [{ m_id: friend }, { f_id: main }] },
          { [Op.and]: [{ m_id: main }, { f_id: friend }] },
        ],
      },
    })
    if (destroyed) {
      return res.status(204).send('Friendship deleted')
    }
    return res.status(404).send('Friendship not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  createFriends,
  getFriends,
  acceptRequest,
  deleteFriendship,
}
