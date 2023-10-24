const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const app = require('../app'); // assuming your app is in a file named app.js

chai.use(chaiHttp);
chai.should();

describe('File upload API tests', () => {
  it('should accept files in GET query parameter', (done) => {
    chai.request(app)
      .get('/api/upload?file=test.txt')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should accept files in JSON body parameter', (done) => {
    chai.request(app)
      .post('/api/upload')
      .send({ file: fs.createReadStream('test.txt') })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should accept files with "Content-Type" header set to "multipart/form-data"', (done) => {
    chai.request(app)
      .post('/api/upload')
      .set('Content-Type', 'multipart/form-data')
      .attach('file', fs.readFileSync('test.txt'), 'test.txt')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should accept files with "Content-Type" header set to "application/octet-stream"', (done) => {
    chai.request(app)
      .post('/api/upload')
      .set('Content-Type', 'application/octet-stream')
      .send(fs.readFileSync('test.txt'))
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should accept files with other types of headers used for file upload', (done) => {
    chai.request(app)
      .post('/api/upload')
      .set('Content-Type', 'image/jpeg')
      .send(fs.readFileSync('test.jpg'))
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should replace the value with a different file when the "Content-Type" header is changed', (done) => {
    chai.request(app)
      .post('/api/upload')
      .set('Content-Type', 'application/json')
      .send(fs.readFileSync('test.txt'))
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should upload a different file in the body while keeping the header same', (done) => {
    chai.request(app)
      .post('/api/upload')
      .set('Content-Type', 'multipart/form-data')
      .attach('file', fs.readFileSync('test2.txt'), 'test2.txt')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('should respond with an exception trace when no file is sent while keeping the header same', (done) => {
    chai.request(app)
      .post('/api/upload')
      .set('Content-Type', 'multipart/form-data')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it('should respond with an exception trace when the header is removed and a file is sent', (done) => {
    chai.request(app)
      .post('/api/upload')
      .attach('file', fs.readFileSync('test.txt'), 'test.txt')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });

  it('should respond with an exception trace when the header is removed and no file is sent', (done) => {
    chai.request(app)
      .post('/api/upload')
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});
