import io from "socket.io-client"
import React from "react"
import { AsyncStorage } from 'react-native'

//delete this line
AsyncStorage.setItem('username', "hubs")
const socket = io("http://192.168.0.23:5000", {
    connectParams: {
        username: AsyncStorage.getItem('username')
    }
});

export default class Sockets extends React.Component {
    constructor(props) {
        super(props);
        this.username = AsyncStorage.getItem(username);
    }

    createRoom = (pic, name) => {
        try {
            socket.emit('createRoom', { host: this.username, pic: pic, name: name });
        } catch (error) {
            console.log(error);
        }
    }

    sendInvite = (username) => {
        try {
            socket.emit('invite', { username: username, host: this.username });
        } catch (error) {
            console.log(error);
        }
    }

    joinRoom = (pic, room, name) => {
        try {
            socket.emit('joinRoom', { username: this.username, pic: pic, room: room, name: name });
        } catch (error) {
            console.log(error);
        }
    }

    leaveRoom = (room) => {
        try {
            socket.emit('leave', { username: this.username, room: room });
        } catch (error) {
            console.log(error);
        }
    }

    kickUser = (username, room) => {
        try {
            socket.emit('kick', { username: username, room: room });
        } catch (error) {
            console.log(error);
        }
    }

    endSession = (room) => {
        try {
            socket.emit('end', { room: room });
        } catch (error) {
            console.log(error);
        }
    }

    startSession = (room) => {
        try {
            socket.emit('start', { room: room })
        } catch (error) {
            console.log(error);
        }
    }

    submitFilters = (filters, room) => {
        try {
            socket.emit('submitFilters', { username: this.username, filters: filters, room: room });
        } catch (error) {
            console.log(error);
        }
    }

    likeRestaurant = (room, restaurant) => {
        try {
            socket.emit('like', { room: room, restaurant: restaurant });
        } catch (error) {
            console.log(error);
        }
    }

    getSocket = () => {
        return socket;
    }
}

