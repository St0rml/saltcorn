const request = require("supertest");
const app = require("../app");
const Table = require("saltcorn-data/models/table");
const {
  getStaffLoginCookie,
  getAdminLoginCookie,
  itShouldRedirectUnauthToLogin,
  toInclude,
  toNotInclude
} = require("../auth/testhelp");

describe("Table Endpoints", () => {
  it("should create tables", async done => {
    const loginCookie = await getAdminLoginCookie();

    const res = await request(app)
      .post("/table/")
      .send("name=mypostedtable")
      .set("Cookie", loginCookie);

    expect(res.statusCode).toEqual(302);
    done();
  });

  itShouldRedirectUnauthToLogin("/table/");

  it("should list tables", async done => {
    const loginCookie = await getAdminLoginCookie();
    await request(app)
      .get("/table/")
      .set("Cookie", loginCookie)
      .expect(toInclude("mypostedtable"))
      .expect(toInclude("books"));
    done();
  });

  it("should edit tables", async done => {
    const loginCookie = await getAdminLoginCookie();

    const tbl = await Table.findOne({ name: "mypostedtable" });

    const res = await request(app)
      .get(`/table/${tbl.id}`)
      .set("Cookie", loginCookie)
      .expect(toInclude("<table"))
      .expect(toInclude("Add field"));
    done();
  });

  it("should delete tables", async done => {
    const loginCookie = await getAdminLoginCookie();

    const tbl = await Table.findOne({ name: "mypostedtable" });
    const delres = await request(app)
      .post(`/table/delete/${tbl.id}`)
      .set("Cookie", loginCookie);
    expect(delres.statusCode).toEqual(302);

    const res = await request(app)
      .get("/table/")
      .set("Cookie", loginCookie)
      .expect(toNotInclude("mypostedtable"))
      .expect(toInclude("books"));

    done();
  });
});
