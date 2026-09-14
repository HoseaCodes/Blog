// Boot arcade-api for the integration run.
//
// The points ledger lives in the Go arcade-api service now, so the blog's
// integration tests need a real one to talk to. This starts a throwaway
// Postgres (Testcontainers) and runs the arcade-api binary against it — the same
// hermetic pattern arcade-api's own tests use, kept off the deployed service so
// a test run can never touch production balances.
//
// The binary is built once (make build) rather than `go run`, so a compile
// error surfaces as a build failure, not a mysterious boot timeout. Point at a
// checkout other than ../../../arcade-api with ARCADE_API_DIR.
const path = require("path");
const { spawn, execFileSync } = require("child_process");
const { GenericContainer, Wait } = require("testcontainers");

const SERVICE_TOKEN = "integration-service-token-long-enough-to-pass";
const ARCADE_PORT = 8091; // 8081 is the mocked Storm-Gate; keep clear of it.

// The characterization suite's "daily earn cap" block needs a daily cap of 100.
// arcade-api requires the single-earn cap to be <= the daily cap, so it is 100
// too; every earn the suite makes through the facade is <= 100. The blog's own
// per-call ceiling (the "caps a single earn" test) is enforced in the Express
// controller at its default of 10000, before the facade is ever called, so it is
// unaffected by this value.
const CAPS = {
  POINTS_MAX_DAILY_EARN: "100",
  POINTS_MAX_SINGLE_EARN: "100",
  POINTS_MAX_OFFLINE_CLAIM: "50000",
};

function arcadeDir() {
  return (
    process.env.ARCADE_API_DIR ||
    path.resolve(__dirname, "../../../../arcade-api")
  );
}

async function waitForHealth(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${url}/health`);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`arcade-api did not become healthy at ${url} in time`);
}

/**
 * Start Postgres + arcade-api. Returns a handle with the base URL, the service
 * token, the database URL (for direct seeding/asserting), and a stop().
 */
async function startArcadeService() {
  const dir = arcadeDir();

  // Build once. Fail loudly and early if the Go toolchain or source is missing —
  // a half-built binary would otherwise surface as a boot timeout.
  try {
    execFileSync("go", ["build", "-o", "out/server", "./cmd/server"], {
      cwd: dir,
      stdio: "inherit",
    });
  } catch (err) {
    throw new Error(
      `failed to build arcade-api in ${dir} (set ARCADE_API_DIR if it lives elsewhere): ${err.message}`
    );
  }

  const pg = await new GenericContainer("postgres:16-alpine")
    .withEnvironment({
      POSTGRES_USER: "test",
      POSTGRES_PASSWORD: "test",
      POSTGRES_DB: "arcade",
    })
    .withExposedPorts(5432)
    .withWaitStrategy(
      Wait.forLogMessage(/database system is ready to accept connections/, 2)
    )
    .start();

  const dbUrl = `postgres://test:test@${pg.getHost()}:${pg.getMappedPort(5432)}/arcade?sslmode=disable`;

  const bin = path.join(dir, "out", "server");
  const child = spawn(bin, [], {
    env: {
      ...process.env,
      PORT: String(ARCADE_PORT),
      DATABASE_URL: dbUrl,
      SERVICE_TOKEN,
      // Verifier is lazy and these tests only exercise /internal (service token),
      // so this is never dialed — but it must be set for the service to boot.
      STORM_GATE_URL: "http://127.0.0.1:8081",
      CORS_ORIGINS: "http://127.0.0.1:3000",
      HOLD_TTL_SECONDS: "120",
      ...CAPS,
    },
    stdio: ["ignore", "inherit", "inherit"],
  });

  const url = `http://127.0.0.1:${ARCADE_PORT}`;
  try {
    await waitForHealth(url);
  } catch (err) {
    child.kill("SIGKILL");
    await pg.stop();
    throw err;
  }

  return {
    url,
    serviceToken: SERVICE_TOKEN,
    databaseUrl: dbUrl,
    caps: CAPS,
    async stop() {
      child.kill("SIGTERM");
      await pg.stop();
    },
  };
}

module.exports = { startArcadeService, SERVICE_TOKEN, CAPS };
