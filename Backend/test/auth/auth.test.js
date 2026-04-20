const request = require("supertest");
const app = require("../../app");

describe("AUTH API", () => {
  const agent = request.agent(app);

  describe("Login - Error cases", () => {
    it("should login fail with incorret password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "superadmin@gmail.com",
        password: "1234567821",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should login fail with incorret email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "superadmin@.com",
        password: "12345678",
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should login fail with fields emty", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "",
        password: "",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Login - Authenticated session", () => {
    //seccion exitosa
    it("should login correctly", async () => {
      const res = await agent.post("/api/auth/login").send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("user");
    });

    it("should check if session is active", async () => {
      const res = await agent.get("/api/auth/verify");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("user");
    });
  });

  describe("logout - successful", () => {
    it("should closed session", async () => {
      const res = await agent.post("/api/auth/logout");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("should verify if token not is exist", async () => {
      const res = await agent.get("/api/auth/verify");

      expect(res.statusCode).toBe(401);
    });
  });
});
