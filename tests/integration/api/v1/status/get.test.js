test("GET em /api/v1/status deve retornar 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.updated_at).toBeDefined();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  const maxConnections = responseBody.dependencies.database.max_connections;

  expect(maxConnections).toBeDefined();
  expect(parseInt(maxConnections)).toEqual(maxConnections);
  expect(maxConnections).toBeGreaterThan(0);

  const openedConnections =
    responseBody.dependencies.database.opened_connections;
  expect(openedConnections).toBeDefined();
  expect(parseInt(openedConnections)).toEqual(openedConnections);
  expect(openedConnections).toEqual(1);

  const version = responseBody.dependencies.database.version;
  expect(version).toBeDefined();
  expect(version).toEqual("16.0");
});