const request = require("supertest");
const assert = require("assert");

const donation = {
  email: "saeedhassansolangi@gmail.com",
  name: "Item one",
  description: "item one description",
  quantity: 12,
  quality: "new",
  date: new Date().getDate(),
  longitude: -23,
  latitude: 21,
  time: Date.now(),
};

describe("Should test the items", () => {
  let server;

  beforeEach(() => {
    server = request.agent("http://127.0.0.1:5000");
  });

  it("should connect to the server", () => {
    assert.ok(server);
  });

  it("GET /donations", function () {
    server
      .get("/donations/")
      .expect("Content-type", /json/)
      .expect(200)
      .end(function (_, res) {
        assert.equal(200, res.status, "should return 200");
      });
  });

  it("POST /donations", () => {
    server
      .post("/donations/")
      .send(donation)
      .expect("Content-type", /json/)
      .end(function (_, res) {
        assert(res.body.message.includes("donation added successfully"));
      });
  });

  it("POST /donations/collect", function () {
    server
      .post("/donations/")
      .send(donation)
      .expect("Content-type", /json/)
      .expect(201)
      .end(function ($, _) {
        server.get("/donations").end(function (err, res) {
          server
            .post(`/donations/${res.body[res.body.length - 1]._id}/collect`)
            .send({
              email: "saeedhassansolangi",
            })
            .end(function (_, res) {
              assert(
                res.body.message.includes(
                  "item collected successfully successfully"
                )
              );
            });
        });
      });
  });

  it("POST /donations/distribute", function () {
    server
      .post("/donations/")
      .send(donation)
      .expect("Content-type", /json/)
      .expect(201)
      .end(function ($, _) {
        server.get("/donations").end(function (err, res) {
          const lastItem = res.body[res.body.length - 1];
          server
            .post(`/donations/${lastItem._id}/collect`)
            .send({
              email: "saeedhassansolangi",
            })
            .end(function (_, res) {
              server
                .post(`/donations/${lastItem._id}/distribute`)
                .send({
                  email: "saeedhassansolangi",
                })
                .end(function (err, res) {
                  const expectedMessage = "donation distributed successfully";
                  assert(res.body.message.includes(expectedMessage));
                });
            });
        });
      });
  });
});
