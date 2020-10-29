// friendsAPi.js mock functions

// returns res.status 200
const createFriendshipMock = (friend) => {
    return Promise.resolve(200);
}

// returns res.status 200 and an array of user info for 5 users
const getFriendsMock = () => {
    const data = 
    {
        status: 200,
        friendList: [
            {
                id: "1",
                name: "Jeff Winger",
                photo: "https://example.com/jeff.png",
                username: "jeff168",
                status: 200,
            },
            {
                id: "2",
                name: "Britta Perry",
                photo: "https://example.com/britta.png",
                username: "britta168",
                status: 200,
            },
            {
                id: "3",
                name: "Annie Edison",
                photo: "https://example.com/annie.png",
                username: "annie168",
                status: 200,
            },
            {
                id: "4",
                name: "Troy Barnes",
                photo: "https://example.com/troy.png",
                username: "troy168",
                status: 200,
            },
            {
                id: "5",
                name: "Abed Nadir",
                photo: "https://example.com/abed.png",
                username: "abed168",
                status: 200,
            }
        ]
    }
    return Promise.resolve(data);
}

// returns res.status 200
const acceptFriendRequestMock = (friend) => {
    return Promise.resolve(200);
}

// returns res.status 200
const removeFriendshipMock = (friend) => {
    return Promise.resolve(200);
}

export default{
    createFriendshipMock,
    getFriendsMock,
    acceptFriendRequestMock,
    removeFriendshipMock,
}
