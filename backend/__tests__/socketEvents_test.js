const io = require('socket.io-client')
const redis = require('redis')
const { promisify } = require('util')
// jest.mock('./yelpQuery.js')

// Testing sockets functionality with Redis
// Disclaimer: if test cases fail, comment out expect.assertions()
// for more detailed info
describe('socket with Redis', () => {
  var socket
  var redisClient
  var hgetAll
  var sendCommand
  beforeEach(function async(done) {
    // Set up socket client
    socket = io('http://192.168.0.23:5000', {
      query: { id: '123' },
    })
    // Set up Redis client and promisfy Redis client
    redisClient = redis.createClient('redis://localhost:6379')
    // redisClient = redis.createClient({
    //   host: 'redis-14649.c1.us-west-2-2.ec2.cloud.redislabs.com',
    //   port: 14649,
    //   password: '7qAgdWUUSTLkCW6AlxORPxVZAlO3alzq'
    // })
    hgetAll = promisify(redisClient.hgetall).bind(redisClient)
    sendCommand = promisify(redisClient.send_command).bind(redisClient)
    socket.on('connect', function () {
      done()
    })
    socket.on('disconnect', function () {
      done()
    })
  })

  afterEach(function (done) {
    // Cleanup: close socket and Redis connections
    if (socket.connected) {
      socket.disconnect()
    }
    redisClient.quit()
    done()
  })

  it('it connects and disconnects correctly', async (done) => {
    try {
      expect.assertions(2)
      // test socket id and user id can be used to fetch the other
      let user = await hgetAll(`users:${123}`)
      let client = await hgetAll(`clients:${user.client}`)
      expect(client.id).toBe('123')
      socket.disconnect()

      // test disconnection
      setTimeout(async () => {
        try {
          // socket id should be deleted from database
          let user = await hgetAll(`users:${123}`)
          let client = await hgetAll(`clients:${user.client}`)
          expect(client).toBe(null)
          done()
        } catch (err) {
          done(err)
        }
      }, 120)
    } catch (err) {
      done(err)
    }
  })

  it('creates session correctly', (done) => {
    expect.assertions(8)
    socket.emit('createRoom', {
      name: 'test',
      username: 'testUser',
      id: '123',
      photo: 'example@pic.com',
    })

    socket.on('update', async (session) => {
      try {
        // session should have correct format and data
        expect(session.host).toBe('123')
        expect(session.code).toBeDefined()
        expect(session.members['123']).toEqual({
          name: 'test',
          username: 'testUser',
          photo: 'example@pic.com',
          filters: false,
        })

        // session should be correctly stored in Redis
        session = await sendCommand('JSON.GET', [session.code])
        session = JSON.parse(session)
        expect(session.members['123']).toMatchObject({
          name: 'test',
          username: 'testUser',
          photo: 'example@pic.com',
          filters: false,
        })
        let filters = await sendCommand('JSON.GET', [`filters:${session.code}`])
        expect(filters).toBeDefined()
        socket.disconnect()
      } catch (err) {
        done(err)
      }

      // test disconnection
      setTimeout(async () => {
        try {
          let code = session.code
          // session should be deleted
          session = await sendCommand('JSON.GET', [code])
          expect(session).toBe(null)
          // session's filters should also be deleted
          let storedFilters = await sendCommand('JSON.GET', [`filters:${code}`])
          expect(storedFilters).toBe(null)
          // session's restaurant list should also be deleted
          let res = await sendCommand('JSON.GET', [`res:${code}`])
          expect(res).toBe(null)
          done()
        } catch (err) {
          done(err)
        }
      }, 50)
    })
    setTimeout(() => {
      done()
    }, 1000)
  })

  it('joins room correctly', async (done) => {
    // expect.assertions(5)
    // create room
    socket.emit('createRoom', {
      name: 'test',
      username: 'testUser',
      id: '123',
      photo: 'example@pic.com',
    })

    // joining a nonexistant room should return message
    try {
      socket.emit('joinRoom', { code: 1234 })
      await socket.on('message', (message) => {
        expect(message).toBe('Room does not exist :(')
      })
    } catch (err) {
      done(err)
    }
    let waiting = true

    socket.on('update', async (session) => {
      // if waiting for room to be created first
      if (waiting) {
        socket.emit('joinRoom', {
          name: 'test1',
          username: 'testUser1',
          id: '1234',
          photo: 'example1@pic.com',
          code: session.code,
        })
        waiting = false
      } else {
        let host = {
          name: 'test',
          username: 'testUser',
          photo: 'example@pic.com',
          filters: false,
        }
        let member = {
          name: 'test1',
          username: 'testUser1',
          photo: 'example1@pic.com',
          filters: false,
        }

        try {
          // session should be updated with new member
          expect(session.members['123']).toMatchObject(host)
          expect(session.members['1234']).toMatchObject(member)
          // session should be stored correctly in Redis
          let storedSession = await sendCommand('JSON.GET', [session.code])
          storedSession = JSON.parse(storedSession)
          expect(storedSession.members['123']).toMatchObject(host)
          expect(storedSession.members['1234']).toMatchObject(member)
          done()
        } catch (err) {
          done(err)
        }
      }
    })
    setTimeout(() => {
      done()
    }, 1000)
  })

  it('submits filters correctly', async (done) => {
    expect.assertions(3)
    // create room
    socket.emit('createRoom', {
      name: 'test',
      username: 'testUser',
      id: '123',
      photo: 'example@pic.com',
    })
    let sentFilters = false

    socket.on('update', (session) => {
      // only check for filters after submitting filters
      let code = session.code
      if (sentFilters) {
        // member's filters should be updated to true in session
        expect(session.members['123'].filters).toBe(true)
        setTimeout(async () => {
          try {
            // session should be correctly stored in Redis
            session = await sendCommand('JSON.GET', [code])
            session = JSON.parse(session)
            expect(session.members['123'].filters).toBe(true)
            // filters should be correctly stored in Redis
            let filters = await sendCommand('JSON.GET', [`filters:${code}`])
            filters = JSON.parse(filters)
            expect(filters.categories).toBe('chinese,newamerican')
            done()
          } catch (err) {
            done(err)
          }
        }, 50)
      } else {
        // submit filters after creating room
        sentFilters = true
        socket.emit('submitFilters', {
          code: code,
          id: '123',
            categories: 'chinese,newamerican',
        })
      }
    })
    setTimeout(() => {
      done()
    }, 1000)
  })

  it('starts round and submits likes correctly', async (done) => {
    expect.assertions(2)
    // create room
    socket.emit('createRoom', {
      name: 'test',
      username: 'testUser',
      id: '123',
      photo: 'example@pic.com',
    })

    let code = null
    socket.on('update', (session) => {
      // submit filters after creating room
      code = session.code
      socket.emit('start', {
        code: code,
        filters: {
          categories: 'chinese,newamerican',
          majority: 2,
          price: '',
          radius: 10000,
          location: 'Fremont, CA',
        },
      })
    })

    let res = null
    socket.on('start', (resList) => {
      res = resList[0]
      expect(resList[0].name).toBeDefined()
      // like the same restaurant twice (to reach majority)
      socket.emit('like', {
        code: code,
        resId: resList[0].id,
      })
      setTimeout(() => {
        socket.emit('like', {
          code: code,
          resId: resList[0].id,
        })
      }, 10)
    })

    // should receive id in restaurant match
    socket.on('match', (resId) => {
      expect(resId).toBe(res.id)
      done()
    })
    setTimeout(() => {
      done()
    }, 1000)
  })

  it('leaves session correctly', async (done) => {
    expect.assertions(2)
    // create room
    socket.emit('createRoom', {
      name: 'test',
      username: 'testUser',
      id: '123',
      photo: 'example@pic.com',
    })

    socket.on('update', (session) => {
      // leave session after creating
      socket.emit('leave', {
        code: session.code,
        id: '123',
      })
      setTimeout(async () => {
        try {
          // session should be deleted
          let room = await sendCommand('JSON.GET', [session.code])
          let filters = await sendCommand('JSON.GET', [`filters:${session.code}`])
          expect(room).toBe(null)
          expect(filters).toBe(null)
          done()
        } catch (err) {
          done(err)
        }
      }, 100)
    })
    setTimeout(() => {
      done()
    }, 1000)
  })

  it('gets top 3 restaurants correctly', async (done) => {
    expect.assertions(2)
    // initialize filters
    let filters = {}
    filters.groupSize = 2
    filters.finished = []
    filters.restaurants = {
      res1: 2,
      res2: 1,
      res3: 3,
    }
    // create room
    socket.emit('createRoom', {
      name: 'test',
      username: 'testUser',
      id: '123',
      photo: 'example@pic.com',
    })

    socket.on('update', async (session) => {
      // let server know user is done swiping
      await sendCommand('JSON.SET', [`filters:${session.code}`, '.', JSON.stringify(filters)])
      socket.emit('final', { id: 123, code: session.code })
      setTimeout(() => {
        socket.emit('final', { id: 456, code: session.code })
      }, 10)
    })

    socket.on('final', (data) => {
      // order of top 3 choices should be correct
      expect(data.choices).toEqual(['res3', 'res1', 'res2'])
      expect(data.random).toBeDefined()
      done()
    })
    setTimeout(() => {
      done()
    }, 1000)
  })
})
