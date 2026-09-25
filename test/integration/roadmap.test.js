// Integration tests for the private roadmap API. Drives the real Express app
// over HTTP (supertest) against a real MongoDB (Testcontainers), with the
// outbound Storm-Gate /me lookup mocked by nock.
//
// The focus is the access gate and the two behaviours this API adds on top of
// plain CRUD: the delete cascade, and the progress transition stamps. The rest
// of the CRUD is the same shape as articles.test.js already covers.
const { api } = require("../helpers/api.cjs");
const { bearerToken, mockStormGateMe } = require("../helpers/auth.cjs");

const Curriculums = require("../../models/curriculum.js").default;
const Programs = require("../../models/program.js").default;
const Alternatives = require("../../models/alternative.js").default;

const admin = () => mockStormGateMe({ role: 1 });
const member = () => mockStormGateMe({ role: 0 });

async function seedCurriculum(overrides = {}) {
  return Curriculums.create({
    slug: "test-track",
    name: "Test Track",
    why: "Because the gate needs something to guard",
    startMonth: 1,
    endMonth: 6,
    ...overrides,
  });
}

describe("Roadmap API", () => {
  describe("access control", () => {
    // Unlike /api/projects, reads are gated too: this is a private planning
    // tool with no public surface.
    test("rejects an unauthenticated read with 401", async () => {
      const res = await api().get("/api/roadmap");
      expect(res.status).toBe(401);
    });

    test("rejects an authenticated NON-admin read with 403", async () => {
      member();

      const res = await api().get("/api/roadmap").set("Authorization", bearerToken());

      expect(res.status).toBe(403);
      expect(res.body.msg).toMatch(/admin/i);
    });

    test("rejects an authenticated non-admin write with 403 and persists nothing", async () => {
      member();

      const res = await api()
        .post("/api/roadmap/curricula")
        .set("Authorization", bearerToken())
        .send({ name: "Sneaky", why: "should not exist" });

      expect(res.status).toBe(403);
      expect(await Curriculums.countDocuments({ name: "Sneaky" })).toBe(0);
    });

    test("allows an admin read", async () => {
      admin();
      await seedCurriculum();

      const res = await api().get("/api/roadmap").set("Authorization", bearerToken());

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.curricula).toHaveLength(1);
      expect(res.body.curricula[0].slug).toBe("test-track");
      // One payload carries every part of the page.
      expect(res.body).toHaveProperty("programs");
      expect(res.body).toHaveProperty("alternatives");
      expect(res.body).toHaveProperty("settings");
    });
  });

  describe("POST /api/roadmap/curricula", () => {
    test("creates a curriculum, slugifies the name, and persists it", async () => {
      admin();

      const res = await api()
        .post("/api/roadmap/curricula")
        .set("Authorization", bearerToken())
        .send({ name: "Computer Science", why: "Close the CS gap", rating: 4 });

      expect(res.status).toBe(200);
      expect(res.body.curriculum).toMatchObject({ slug: "computer-science", rating: 4 });

      const inDb = await Curriculums.findOne({ slug: "computer-science" });
      expect(inDb).not.toBeNull();
      expect(inDb.why).toBe("Close the CS gap");
    });

    test("de-duplicates a slug that already exists", async () => {
      admin();
      await seedCurriculum({ slug: "computer-science", name: "Computer Science" });

      const res = await api()
        .post("/api/roadmap/curricula")
        .set("Authorization", bearerToken())
        .send({ name: "Computer Science", why: "A second one" });

      expect(res.status).toBe(200);
      expect(res.body.curriculum.slug).toBe("computer-science-2");
    });

    test("rejects a curriculum with no name", async () => {
      admin();

      const res = await api()
        .post("/api/roadmap/curricula")
        .set("Authorization", bearerToken())
        .send({ why: "nameless" });

      expect(res.status).toBe(400);
      expect(await Curriculums.countDocuments()).toBe(0);
    });
  });

  describe("DELETE /api/roadmap/curricula/:slug", () => {
    // The behaviour worth locking down: children are meaningless without the
    // parent, and orphans would render as bars that never resolve.
    test("cascades to the curriculum's programs and alternatives", async () => {
      admin();
      await seedCurriculum();
      await Programs.create({ slug: "p1", curriculumSlug: "test-track", name: "P1" });
      await Programs.create({ slug: "p2", curriculumSlug: "test-track", name: "P2" });
      await Programs.create({ slug: "keep", curriculumSlug: "other-track", name: "Keep" });
      await Alternatives.create({ slug: "a1", curriculumSlug: "test-track", name: "A1" });

      const res = await api()
        .delete("/api/roadmap/curricula/test-track")
        .set("Authorization", bearerToken());

      expect(res.status).toBe(200);
      expect(res.body.removed).toEqual({ programs: 2, alternatives: 1 });

      expect(await Programs.countDocuments({ curriculumSlug: "test-track" })).toBe(0);
      expect(await Alternatives.countDocuments({ curriculumSlug: "test-track" })).toBe(0);
      // Another curriculum's programs are untouched.
      expect(await Programs.countDocuments({ slug: "keep" })).toBe(1);
    });
  });

  describe("POST /api/roadmap/programs", () => {
    test("refuses a program whose curriculum does not exist", async () => {
      admin();

      const res = await api()
        .post("/api/roadmap/programs")
        .set("Authorization", bearerToken())
        .send({ name: "Orphan", curriculumSlug: "nope" });

      expect(res.status).toBe(400);
      expect(await Programs.countDocuments()).toBe(0);
    });

    test("accepts teaches as a comma-separated string", async () => {
      admin();
      await seedCurriculum();

      const res = await api()
        .post("/api/roadmap/programs")
        .set("Authorization", bearerToken())
        .send({
          name: "Operating Systems",
          curriculumSlug: "test-track",
          teaches: "Processes, Scheduling , Concurrency",
        });

      expect(res.status).toBe(200);
      expect(res.body.program.teaches).toEqual(["Processes", "Scheduling", "Concurrency"]);
    });
  });

  describe("PATCH /api/roadmap/programs/:slug/progress", () => {
    test("stamps startedAt on the first move off zero and completedAt at 100", async () => {
      admin();
      await seedCurriculum();
      await Programs.create({ slug: "os", curriculumSlug: "test-track", name: "OS" });

      const started = await api()
        .patch("/api/roadmap/programs/os/progress")
        .set("Authorization", bearerToken())
        .send({ progress: 40 });

      expect(started.status).toBe(200);
      expect(started.body.program.progress).toBe(40);
      expect(started.body.program.startedAt).not.toBeNull();
      expect(started.body.program.completedAt).toBeNull();

      const firstStarted = (await Programs.findOne({ slug: "os" })).startedAt;

      const done = await api()
        .patch("/api/roadmap/programs/os/progress")
        .set("Authorization", bearerToken())
        .send({ progress: 100 });

      expect(done.body.program.completedAt).not.toBeNull();
      // startedAt is stamped once, not re-stamped on every later write.
      expect(new Date((await Programs.findOne({ slug: "os" })).startedAt).getTime())
        .toBe(new Date(firstStarted).getTime());
    });

    test("clears completedAt when progress drops back below 100", async () => {
      admin();
      await seedCurriculum();
      await Programs.create({
        slug: "os",
        curriculumSlug: "test-track",
        name: "OS",
        progress: 100,
        completedAt: new Date(),
      });

      const res = await api()
        .patch("/api/roadmap/programs/os/progress")
        .set("Authorization", bearerToken())
        .send({ progress: 60 });

      expect(res.body.program.completedAt).toBeNull();
    });
  });

  describe("PATCH /api/roadmap/curricula/:slug", () => {
    // The in-place edits on the page: rating pips and the two goal cells. A
    // partial patch must not blank the fields it did not send.
    test("updates only the fields supplied", async () => {
      admin();
      await seedCurriculum({ shortTermGoal: "Ship the slice", rating: 3 });

      const res = await api()
        .patch("/api/roadmap/curricula/test-track")
        .set("Authorization", bearerToken())
        .send({ rating: 5 });

      expect(res.status).toBe(200);

      const inDb = await Curriculums.findOne({ slug: "test-track" });
      expect(inDb.rating).toBe(5);
      expect(inDb.shortTermGoal).toBe("Ship the slice");
      expect(inDb.why).toBe("Because the gate needs something to guard");
    });

    test("rejects an out-of-range rating instead of storing it", async () => {
      admin();
      await seedCurriculum();

      const res = await api()
        .patch("/api/roadmap/curricula/test-track")
        .set("Authorization", bearerToken())
        .send({ rating: 9 });

      // clamped by the controller, never written past the schema maximum
      expect(res.status).toBe(200);
      expect((await Curriculums.findOne({ slug: "test-track" })).rating).toBe(5);
    });
  });
});
