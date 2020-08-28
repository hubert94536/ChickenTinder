import io from "socket.io-client"
import React from "react"

//delete bottom 2 lines, be careful of hoisting
global.username = 'hubs'
global.name = 'hubert'

const socket = io("http://192.168.0.23:5000", {
    query: `username=${global.username}`
});

const createRoom = () => {
    try {
        socket.emit('createRoom', { host: global.username, pic: global.pic, name: global.name });
    } catch (error) {
        console.log(error);
    }
}

const sendInvite = (username) => {
    try {
        socket.emit('invite', { username: username, host: global.username });
    } catch (error) {
        console.log(error);
    }
}

const declineInvite = (room) => {
    try {
        socket.emit('decline', {username: global.username, room: room})
    } catch (error) {
        console.log(error);
    }
}

const joinRoom = (room) => {
    try {
        socket.emit('joinRoom', { username: global.username, pic: global.pic, room: room, name: global.name });
    } catch (error) {
        console.log(error);
    }
}

const leaveRoom = (room) => {
    try {
        socket.emit('leave', { username: global.username, room: room });
    } catch (error) {
        console.log(error);
    }
}

const kickUser = (username) => {
    try {
        socket.emit('kick', { username: username, room: global.username });
    } catch (error) {
        console.log(error);
    }
}

const endSession = () => {
    try {
        socket.emit('end', { room: global.username });
    } catch (error) {
        console.log(error);
    }
}

const startSession = () => {
    try {
        socket.emit('start', { room: global.username })
    } catch (error) {
        console.log(error);
    }
}

const submitFilters = (filters, room) => {
    try {
        socket.emit('submitFilters', { username: global.username, filters: filters, room: room });
    } catch (error) {
        console.log(error);
    }
}

const likeRestaurant = (room, restaurant) => {
    try {
        socket.emit('like', { room: room, restaurant: restaurant });
    } catch (error) {
        console.log(error);
    }
}

const getSocket = () => {
    return socket;
}

module.exports = {
    createRoom,
    joinRoom,
    sendInvite,
    declineInvite,
    leaveRoom,
    kickUser,
    startSession,
    endSession,
    submitFilters,
    likeRestaurant,
    getSocket
}