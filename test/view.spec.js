const request = require('supertest');
const app = require('../app.js');

describe('View page', () => {
  it('GET / should return 200', (done) => {
    request(app)
      .get('/')
      .expect(200, done);
  });

});
