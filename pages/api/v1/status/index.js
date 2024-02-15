import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version");
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int as opened_connections FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  const version = databaseVersionResult.rows[0].server_version;
  const maxConnections = parseInt(
    databaseMaxConnectionsResult.rows[0].max_connections,
  );
  const openedConnections =
    databaseOpenedConnectionsResult.rows[0].opened_connections;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: maxConnections,
        opened_connections: openedConnections,
        version: version,
      },
    },
  });
}

export default status;
