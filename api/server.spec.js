const request = require("supertest");

const server = require("./server.js");

describe("server.js", function() {
  describe("check env var", function() {
    it("should set env to testing", function() {
      expect(process.env.DB_ENV).toBe("testing");
    });
  });
});

describe("GET /", function() {
  it("should 200 saying api running", function() {
    return request(server)
      .get("/")
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  describe("GET /api/users", () => {
    it("should return shall not pass!", async () => {
      const res = await request(server).get("/api/users");
      expect(res.body.you).toBe(undefined);
    });
  });

  
});
