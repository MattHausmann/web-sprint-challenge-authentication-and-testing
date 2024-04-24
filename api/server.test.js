const request = require('supertest'); // calling it "request" is a common practice
const server = require('./server.js'); // this is our first red, file doesn't exist yet
const db = require('../data/dbConfig.js');
const bcrypt = require('bcryptjs');

const userA = {"username":"a","password":bcrypt.hashSync("a", 8)};

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  await db('users').truncate();
  await db('users').insert(userA);
})

afterAll(async () => {
  await db('users').delete();
})

describe('/api/auth/register', () => {

  it("adds a user to the table if there's not a duplicate username", async () => {
    return await request(server)
      .post('/api/auth/register')
      .send({"username":"b","password":"b"})
      .then(async () => {
        const users = await db('users');
        expect(users).toHaveLength(2);
      })
  });
  

  it("doesn't add a user to the table if there's no username", async () => {
    return await request(server)
      .post('/api/auth/register')
      .send({"password":"a"})
      .then(async () => {
        const users = await db('users');
        expect(users).toHaveLength(1);
      })
  });

  it("doesn't add a user to the table if there's a duplicate username", async () => {
    return await request(server)
      .post('/api/auth/register')
      .send({"username":"a","password":"b"})
      .then(async () => {
        const users = await db('users');
        expect(users).toHaveLength(1);
      })
  })
});

describe('/api/auth/login/', () => {
  it('returns token when username and password correct', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({"username":"a","password":"a"});
    expect(response.body.token).toBeTruthy();
  });

  it('returns no token when username not in db', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({"username":"not_in_db","password":"a"});
    expect(response.body.token).toBeFalsy();
  });
  it('returns no token when password invalid', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({"username":"a","password":"b"});
    expect(response.body.token).toBeFalsy();
  });
})

describe('/api/jokes', () => {
  it('returns jokes with a valid token', async () => {
    const loginResponse = await request(server)
      .post('/api/auth/login')
      .send({"username":"a","password":"a"});
    const token = loginResponse.body.token;

    const jokesResponse = await request(server)
      .get('/api/jokes')
      .set('Authorization', token)
      .send()
    expect(jokesResponse.body).toHaveLength(3);
  });

  it('returns no jokes without a token', async () => {
    const response = await request(server)
      .get('/api/jokes')
      .send()

    expect(response.text).not.toContain("I'm tired of following my dreams");
  });

  it('returns no jokes with an invalid token', async () => {
    const response = await request(server)
      .get('/api/jokes')
      .set('Authorization', 'invalid_token')
      .send()

    expect(response.text).not.toContain("I'm tired of following my dreams");
    
  })
});