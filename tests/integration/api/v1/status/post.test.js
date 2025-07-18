describe("POST /api/v1/status", () => {
  describe("Usando usuário anônimo", () => {
    test("Busca o status corrente do sistema", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();
      expect(responseBody.name).toBeDefined();
      expect(responseBody.message).toBeDefined();
      expect(responseBody.action).toBeDefined();
      expect(responseBody.status_code).toBeDefined();
    });
  });
});
