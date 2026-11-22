import pg from "pg";

export const pool = new pg.Pool({
  connectionString: "postgres://lab:lab@localhost:5433/lab",
});
