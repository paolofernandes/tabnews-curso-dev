import database from "infra/database.js";

async function status(request, response) {
  const result = await database.query(`
    SELECT
        current_setting('server_version') AS db_version,
        s1.setting::int AS db_max_connections,
        (SELECT COUNT(*) FROM pg_stat_activity WHERE datname = 'local_db') AS db_used_connections
    FROM
        pg_settings s1
    WHERE
        s1.name = 'max_connections';`);
  console.log(result.rows[0]);

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  console.log(databaseVersionValue);

  const databaseMaxConnectionResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionValue =
    databaseMaxConnectionResult.rows[0].max_connections;
  console.log(databaseMaxConnectionValue);

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;
  console.log(databaseOpenedConnectionsValue);

  const updateAt = new Date().toISOString();
  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        db_version: databaseVersionValue,
        db_max_connections: databaseMaxConnectionValue,
        db_opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
