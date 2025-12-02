test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  const parsedUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parsedUpdateAt);

  const dbVersion = responseBody.dependencies.database.db_version;
  expect(dbVersion).toBeDefined();
  expect(dbVersion).toEqual("16.0");

  const dbMaxConnections =
    responseBody.dependencies.database.db_max_connections;
  expect(dbMaxConnections).toBeDefined();
  expect(Number(dbMaxConnections)).toEqual(100);

  const dbUsedConnections =
    responseBody.dependencies.database.db_opened_connections;
  expect(dbUsedConnections).toBeDefined();
  expect(Number(dbUsedConnections)).toEqual(1);
});
