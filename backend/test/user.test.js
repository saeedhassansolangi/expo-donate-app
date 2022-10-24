const request = require("supertest");
const assert = require("assert");

const user = {
  email: "saeedsolang111`qi@gmail.com",
  password: "123456",
  username: "solangisae11eq1d1",
  phone_number: "03161607902",
  role: "donar",
};

describe("Should test the Users", () => {
  let server;

  beforeEach(() => {
    server = request.agent("http://127.0.0.1:5000");
  });

  it("should connect to the server", () => {
    assert.ok(server);
  });

  it("POST /users/register", function () {
    const user = {
      email: "masoodmagneejo@gmail.com",
      password: "123456",
      username: "masoodmagneejo",
      phone_number: "03161607902",
      role: "donar",
    };

    server
      .post("/users/register")
      .send(user)
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert(res.body.hasOwnProperty("token"), "token is not found");
      });
  });

  it("POST /users/login", function () {
    server
      .post("/users/login")
      .send({
        email: "saeedhassansolangi",
        password: "123456",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert.equal(res.body.user.email, "saeedhassansolangi");
      });
  });

  it("POST /users/register", function () {
    server
      .post("/users/register")
      .send(user)
      .expect(422)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert(
          res.body.message.includes("User already registered with this email")
        );
      });
  });
});
