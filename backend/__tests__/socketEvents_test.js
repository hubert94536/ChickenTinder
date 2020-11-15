const io = require('socket.io-client')
const redis = require('redis')
const { promisify } = require("util")

describe('socket with Redis', () => {
  var socket
  var redisClient
  var hgetAll
  var sendCommand
  beforeEach(function async(done) {
    // Set up
    socket = io('http://192.168.0.23:5000', {
      query: {id: 123},
    })
    redisClient = redis.createClient('redis://localhost:6379')
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
    // Cleanup
    if (socket.connected) {
      socket.disconnect()
    }
    redisClient.quit()
    done()
  })

  it('it connects and disconnects correctly', async () => {
    let user = await hgetAll(`users:${123}`)
    let client = await hgetAll(`clients:${user.client}`)
    expect(client.id).toBe('123')
  })

  it('creates session correctly', async () => {
    socket.emit('createRoom', {
      name: 'test',
      username: 'testUser',
      id: '123',
      photo: 'example@pic.com'
    })

    await socket.on('update', async (session) => {
      // check update status
      expect(session.host).toBe('123')
      expect(session.code).toBeDefined()
      expect(session.members['123'].name).toBe('test')
      expect(session.members['123'].username).toBe('testUser')
      expect(session.members['123'].photo).toBe('example@pic.com')
      expect(session.members['123'].filters).toBe(false)
      // check session stored in Redis
      session = await sendCommand('JSON.GET', [session.code])
      session = session.toJSON
      expect(session.members['123'].name).toBe('test')
      expect(session.members['123'].username).toBe('testUser')
      expect(session.members['123'].photo).toBe('example@pic.com')
      expect(session.members['123'].filters).toBe(false)
      let filters = await sendCommand('JSON.GET', [`filters:${session.code}`])
      expect(filters).toBeDefined()
      // test that disconnection deletes room
      socket.disconnect()
      let code = session.code
      session = await sendCommand('JSON.GET', [code])
      expect(session).toBe(null)
      filters = await sendCommand('JSON.GET', [`filters:${code}`])
      expect(filters).toBe(null)
      let res = await sendCommand('JSON.GET', [`res:${code}`])
      expect(res).toBe(null)
    })
  })
})
