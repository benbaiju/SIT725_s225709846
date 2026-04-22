const expect = require("chai").expect;
const request = require("request");

describe("Calculator API", function () {
  const baseUrl = "http://localhost:3000";

  it("returns status 200 to check if api works", function (done) {
    request(baseUrl, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it("ADD: should return correct sum for valid numbers", function (done) {
    request.get(`${baseUrl}/add?a=10&b=5`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("15");
      done();
    });
  });

  it("ADD: should handle missing parameters", function (done) {
    request.get(`${baseUrl}/add?a=10`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it("ADD: should handle zero values", function (done) {
    request.get(`${baseUrl}/add?a=0&b=0`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("0");
      done();
    });
  });

  it("SUBTRACT: should return correct result for valid numbers", function (done) {
    request.get(`${baseUrl}/subtract?a=10&b=3`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("7");
      done();
    });
  });

  it("SUBTRACT: should handle missing parameters", function (done) {
    request.get(`${baseUrl}/subtract?a=10`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it("SUBTRACT: should handle negative numbers", function (done) {
    request.get(`${baseUrl}/subtract?a=-5&b=-2`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("-3");
      done();
    });
  });

  it("MULTIPLY: should return correct product for valid numbers", function (done) {
    request.get(`${baseUrl}/multiply?a=4&b=5`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("20");
      done();
    });
  });

  it("MULTIPLY: should handle missing parameters", function (done) {
    request.get(`${baseUrl}/multiply?a=4`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it("MULTIPLY: should handle multiply by zero", function (done) {
    request.get(`${baseUrl}/multiply?a=9&b=0`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("0");
      done();
    });
  });

  it("DIVIDE: should return correct quotient for valid numbers", function (done) {
    request.get(`${baseUrl}/divide?a=20&b=4`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("5");
      done();
    });
  });

  it("DIVIDE: should handle missing parameters", function (done) {
    request.get(`${baseUrl}/divide?a=20`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it("DIVIDE: should handle divide by zero", function (done) {
    request.get(`${baseUrl}/divide?a=10&b=0`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("divide by zero");
      done();
    });
  });

  it("SQUARE: should return square for valid number", function (done) {
    request.get(`${baseUrl}/square?a=6`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("36");
      done();
    });
  });

  it("SQUARE: should handle missing parameter", function (done) {
    request.get(`${baseUrl}/square`, function (error, response, body) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });

  it("SQUARE: should handle zero input", function (done) {
    request.get(`${baseUrl}/square?a=0`, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
      expect(body).to.include("0");
      done();
    });
  });
});