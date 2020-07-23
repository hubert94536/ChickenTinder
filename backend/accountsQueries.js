const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.USERS_USER,
    host: process.env.USERS_HOST,
    password: process.env.USERS_PASSWORD,
    port: process.env.USERS_PORT,
    database: process.env.USERS_DATABASE,
    ssl: true
})


const getUsers = (request, response) => {
    console.log('hi');
    pool.query('SELECT * FROM accounts ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        //response.status(200).json(results.rows)
        console.log(results.rows[0].name)
    })
}

// const getUserById = (request, response) => {
//     const id = parseInt(request.params.id)

//     pool.query('SELECT * FROM accounts WHERE id = $1', [id], (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(200).json(results.rows)
//     })
// }

// const createUser = (request, response) => {
//     const { name, email } = request.body

//     pool.query('INSERT INTO users (name, password) VALUES ($1, $2)', [name, email], (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(201).send(`User added with ID: ${result.insertId}`)
//     })
// }

// const updateUser = (request, response) => {
//     const id = parseInt(request.params.id)
//     const { name, email } = request.body

//     pool.query(
//         'UPDATE users SET name = $1, email = $2 WHERE user_id = $3',
//         [name, email, id],
//         (error, results) => {
//             if (error) {
//                 throw error
//             }
//             response.status(200).send(`User modified with user_id: ${id}`)
//         }
//     )
// }

// const deleteUser = (request, response) => {
//     const id = parseInt(request.params.id)

//     pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
//         if (error) {
//             throw error
//         }
//         response.status(200).send(`User deleted with ID: ${id}`)
//     })
// }

module.exports = {
    getUsers,
    // getUserById,
    // createUser,
    // updateUser,
    // deleteUser,
}