const { Accounts } = require('./models.js')
var sessions = new Object(); //store temporary sessions
var clients = new Object(); //associates username with client id
var invites = new Object(); //store invites 
module.exports = (io) => {
    io.on('connection', socket => {
        clients[socket.handshake.query.username] = socket.id;
        if (socket.handshake.query.username in invites) {
            let sender = invites[socket.handshake.query.username]
            io.to(clients[socket.handshake.query.username]).emit('invite', {
                username: sender,
                pic: sessions[sender].members[sender].pic,
                name: sessions[sender].members[sender].name
            })
        }

        //creates session and return session info to host
        socket.on('createRoom', async data => {
            try {
                await Accounts.update({
                    inSession: true,
                }, {
                    where: { username: data.host }
                });
                socket.join(data.host);
                sessions[data.host] = new Object();
                sessions[data.host].members = new Object();
                sessions[data.host].members[data.host] = new Object();
                sessions[data.host].members[data.host].pic = data.pic;
                sessions[data.host].members[data.host].filters = false;
                sessions[data.host].members[data.host].name = data.name;
                sessions[data.host].restaurants = new Object();
                socket.emit('update', JSON.stringify(sessions[data.host].members));
                console.log(sessions);
            } catch (error) {
                console.log(error);
                socket.emit('exception', error);
            }

        });

        //send invite with host info to join a room
        socket.on('invite', async data => {
            try {
                let user = await Accounts.findOne({
                    where: { username: data.username }
                });
                //check if friend is in another group
                if (user) {
                    socket.emit('unreachable', data.username);
                } else {
                    invites[data.username].sender = data.host;
                    io.to(clients[data.username]).emit('invite', {
                        username: data.host,
                        pic: sessions[data.host].members[data.host].pic,
                        name: sessions[data.host].members[data.host].name
                    });
                }
            } catch (error) {
                console.log(error);
                socket.emit('exception', error);
            }
        });

        //declines invite and send to host
        socket.on('decline', data => {
            try {
                delete invites[data.username];
                io.to(clients[data.room]).emit('decline', data.username);
            } catch (error) {
                console.log(error);
                socket.emit('exception', error);
            }
        })

        //alerts everyone in room updated status
        socket.on('joinRoom', async data => {
            //include to check if room exists
            if (data.room in sessions) {
                try {
                    await Accounts.update({
                        inSession: true,
                    }, {
                        where: { username: data.username }
                    });
                    socket.join(data.room)
                    delete invites[data.username];
                    sessions[data.room].members[data.username] = new Object();
                    sessions[data.room].members[data.username].filters = false;
                    sessions[data.room].members[data.username].pic = data.pic;
                    sessions[data.host].members[data.username].name = data.name;
                    io.in(data.room).emit('update', JSON.stringify(sessions[data.room].members));
                    console.log(sessions[data.room]);
                } catch (error) {
                    console.log(error.message);
                    socket.emit('exception', error);
                }
            }
            else {
                socket.emit('exception', 'status 404');
            }
        });

        //alerts to everyone user submitted filters & returns selected filters
        socket.on('submitFilters', data => {
            //merge to master list, send response back
            try {
                sessions[data.room].members[data.username].filters = true;
                io.in(data.room).emit("update", JSON.stringify(sessions[data.room].members));
                io.to(clients[data.room]).emit("filters", { filters: data.filters });
                console.log(JSON.stringify(sessions[data.room]));
            } catch (error) {
                console.log(error.message);
                socket.emit('exception', error);
            }

        });

        //alert to all clients in room to start
        socket.on('start', data => {
            //proceed to restaurant matching after EVERYONE submits filters
            io.in(data.room).emit('start');
            console.log(data.room);
        });

        socket.on('like', data => {
            //add restaurant id to list + check for matches
            try {
                sessions[data.room].restaurants[data.restaurant] = (sessions[data.room].restaurants[data.restaurant] || 0) + 1;
                if (sessions[data.room].restaurants[data.restaurant] == Object.keys(sessions[data.room].members).length) {
                    socket.emit('like', { restaurant: data.restaurant, room: data.room });
                    console.log(data.restaurant);
                }
                else {
                    console.log(sessions[data.room]);
                }
            } catch (error) {
                console.log(error.message);
                socket.emit('exception', error);
            }

        });

        socket.on('match', data => {
            try {
                io.in(data.room).emit('match', data.restaurant);
            } catch (error) {
                console.log(error.message);
                socket.emit('exception', error);
            }
        })

        //leaving a session
        socket.on('leave', async data => {
            try {
                await Accounts.update({
                    inSession: false,
                }, {
                    where: { username: data.username }
                });
                socket.leave(data.room);
                delete sessions[data.room].members[data.username];
                io.in(data.room).emit('update', JSON.stringify(sessions[data.room].members));
                console.log(sessions[data.room]);
            } catch (error) {
                console.log(error.message);
                socket.emit('exception', error);
            }
        });

        socket.on('kick', data => {
            try {
                io.to(clients[data.username]).emit('kick', { room: data.room });
                console.log(data.username);
            }
            catch (error) {
                console.log(error.message);
                socket.emit('exception', error);
            }
        })

        socket.on('end', data => {
            //remove all users in room to delete
            try {
                delete sessions[data.room];
                io.in(data.room).emit('leave', data.room);
                console.log(sessions);
            } catch (error) {
                console.log(error.message);
                socket.emit('exception', error);
            }
        });

    });
}