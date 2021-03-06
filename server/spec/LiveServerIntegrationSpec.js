var request = require('request');
var expect = require('chai').expect;

describe('server', function() {
  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        expect(messages[0].username).to.equal('Jono');
        expect(messages[0].text).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  it('should not accept POST requests without a message', function (done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
      }
    };
    
    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  
  it('should not accept POST requests without a username', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        text: 'Do my bidding!',
      }
    };
    
    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  
  it('should not accept POST requests that are not a json object', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: [ 'username', 'text'],
    };
    
    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  
  it('should add a createdAt timestamp to each accepted POST request', function(done) {
    var requestParams = {
      method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'
      }
    };
    
    request(requestParams, function(error, response, body) {
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        
        expect(messages[0].createdAt).to.be.a('string');
        done();
      });
    });
  });
  
  it('should respond to an OPTIONS request', function (done) {
    var requestParams = {
      method: 'OPTIONS',
      uri: 'http://127.0.0.1:3000/classes/messages',
    };
    
    request(requestParams, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(response.headers).to.be.an('object');
      expect(response.headers['access-control-allow-origin']).to.exist;
      expect(response.headers['access-control-allow-methods']).to.exist;
      expect(response.headers['access-control-allow-headers']).to.exist;
      done();
    });
  });

  
});
