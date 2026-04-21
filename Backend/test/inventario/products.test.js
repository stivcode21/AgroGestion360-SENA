const request = require("supertest");
const app = require("../../app");

describe("PRODUCT API", () => {
  const agent = request.agent(app);

  //seccion exitosa
  it("should login correctly", async () => {
    const res = await agent.post("/api/auth/login").send({
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
  });

  describe("Products - Error cases", () => {
    it("should not register without a token", async () => {
      const res = await request(app).post("/api/product/register").send({
        nombre: "Cuido vaca",
        id_tipo: "2",
        cantidad: 22,
        precio_unitario: 50000,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should generate an error when creating a new product", async () => {
      const res = await agent.post("/api/product/register").send({
        nombre: 2212,
        id_tipo: "2",
        url_img: null,
        marca: 1213123,
        cantidad: 22,
        fecha_vencimiento: null,
        unidad_medida: 121,
        proveedor: 212121,
        precio_unitario: 50000,
        observaciones: 212112,
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("Products - all life cycle", () => {
    let createdProductId;

    it("should create a new product", async () => {
      const res = await agent.post("/api/product/register").send({
        nombre: "Cuido vaca",
        id_tipo: "2",
        url_img: null,
        marca: "Solla",
        cantidad: 22,
        fecha_vencimiento: null,
        unidad_medida: "1kg",
        proveedor: "la galeria",
        precio_unitario: 50000,
        observaciones: "de muy buen alimento",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("data");

      createdProductId = res.body.data.id_insumo;
    });

    it("should edit new product", async () => {
      expect(createdProductId).toBeDefined();

      const res = await agent
        .put(`/api/product/edit/${createdProductId}`)
        .send({
          nombre: "Cuid00 vacaa",
          marca: "Sollaaa",
          cantidad: 42,
          unidad_medida: "5kg",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("message");
    });

    it("should delete product", async () => {
      expect(createdProductId).toBeDefined();

      const res = await agent.delete(`/api/product/delete/${createdProductId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });
  });
});
