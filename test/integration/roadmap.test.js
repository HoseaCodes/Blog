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
const Settings = require("../../models/setting.js").default;

// Storm-Gate's /me supplies both role AND email; email is what scopes a
// roadmap to its owner, so every admin here has a concrete address.
const OWNER = "owner@example.com";
const OTHER = "someone-else@example.com";

const admin = (email = OWNER) => mockStormGateMe({ role: 1, email });
const member = () => mockStormGateMe({ role: 0, email: OWNER });

async function seedCurriculum(overrides = {}) {
  return Curriculums.create({
    ownerEmail: OWNER,
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
      expect(res.body.curriculum).toMatchObject({
        slug: "computer-science",
        rating: 4,
        ownerEmail: OWNER,
      });

      const inDb = await Curriculums.findOne({ slug: "computer-science" });
      expect(inDb).not.toBeNull();
      expect(inDb.why).toBe("Close the CS gap");
    });

    test("de-duplicates a slug that already exists FOR THIS OWNER", async () => {
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
      await Programs.create({ ownerEmail: OWNER, slug: "p1", curriculumSlug: "test-track", name: "P1" });
      await Programs.create({ ownerEmail: OWNER, slug: "p2", curriculumSlug: "test-track", name: "P2" });
      await Programs.create({ ownerEmail: OWNER, slug: "keep", curriculumSlug: "other-track", name: "Keep" });
      await Alternatives.create({ ownerEmail: OWNER, slug: "a1", curriculumSlug: "test-track", name: "A1" });

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
      await Programs.create({ ownerEmail: OWNER, slug: "os", curriculumSlug: "test-track", name: "OS" });

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
        ownerEmail: OWNER,
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
  // The point of the ownership change: two admins, two separate roadmaps.
  describe("ownership isolation", () => {
    test("another admin's roadmap is invisible", async () => {
      await seedCurriculum();
      await Programs.create({ ownerEmail: OWNER, slug: "p1", curriculumSlug: "test-track", name: "P1" });
      await Alternatives.create({ ownerEmail: OWNER, slug: "a1", curriculumSlug: "test-track", name: "A1" });

      admin(OTHER);
      const res = await api().get("/api/roadmap").set("Authorization", bearerToken());

      expect(res.status).toBe(200);
      expect(res.body.curricula).toHaveLength(0);
      expect(res.body.programs).toHaveLength(0);
      expect(res.body.alternatives).toHaveLength(0);
    });

    test("another admin cannot edit, patch or delete your curriculum", async () => {
      await seedCurriculum({ rating: 2 });
      admin(OTHER);

      const put = await api()
        .put("/api/roadmap/curricula/test-track")
        .set("Authorization", bearerToken())
        .send({ name: "Hijacked", why: "mine now" });
      expect(put.status).toBe(404);

      const patch = await api()
        .patch("/api/roadmap/curricula/test-track")
        .set("Authorization", bearerToken())
        .send({ rating: 5 });
      expect(patch.status).toBe(404);

      const del = await api()
        .delete("/api/roadmap/curricula/test-track")
        .set("Authorization", bearerToken());
      expect(del.status).toBe(404);

      // Untouched on every count.
      const inDb = await Curriculums.findOne({ slug: "test-track" });
      expect(inDb).not.toBeNull();
      expect(inDb.name).toBe("Test Track");
      expect(inDb.rating).toBe(2);
      expect(inDb.ownerEmail).toBe(OWNER);
    });

    test("another admin cannot move a program's progress", async () => {
      await seedCurriculum();
      await Programs.create({ ownerEmail: OWNER, slug: "os", curriculumSlug: "test-track", name: "OS" });

      admin(OTHER);
      const res = await api()
        .patch("/api/roadmap/programs/os/progress")
        .set("Authorization", bearerToken())
        .send({ progress: 99 });

      expect(res.status).toBe(404);
      expect((await Programs.findOne({ slug: "os" })).progress).toBe(0);
    });

    test("another admin cannot attach a program to your curriculum", async () => {
      await seedCurriculum();
      admin(OTHER);

      const res = await api()
        .post("/api/roadmap/programs")
        .set("Authorization", bearerToken())
        .send({ name: "Intruder", curriculumSlug: "test-track" });

      expect(res.status).toBe(400);
      expect(await Programs.countDocuments()).toBe(0);
    });

    test("two owners may each hold the same slug", async () => {
      await seedCurriculum({ slug: "computer-science", name: "Computer Science" });

      admin(OTHER);
      const res = await api()
        .post("/api/roadmap/curricula")
        .set("Authorization", bearerToken())
        .send({ name: "Computer Science", why: "my own copy" });

      expect(res.status).toBe(200);
      // Not "computer-science-2": the slug is only unique per owner.
      expect(res.body.curriculum.slug).toBe("computer-science");
      expect(res.body.curriculum.ownerEmail).toBe(OTHER);
      expect(await Curriculums.countDocuments({ slug: "computer-science" })).toBe(2);
    });

    // Seeded directly rather than through the API: mockStormGateMe persists its
    // interceptor, so mocking two different profiles inside one test would have
    // the first one answer both requests.
    test("settings are per owner", async () => {
      await Settings.create({ key: `roadmap:${OWNER}`, value: { anchor: "2026-10" } });

      admin(OTHER);
      const res = await api().get("/api/roadmap").set("Authorization", bearerToken());

      expect(res.status).toBe(200);
      expect(res.body.settings).toEqual({});
    });

    test("an owner reads back their own settings", async () => {
      await Settings.create({ key: `roadmap:${OWNER}`, value: { anchor: "2027-03" } });

      admin();
      const res = await api().get("/api/roadmap").set("Authorization", bearerToken());

      expect(res.body.settings.anchor).toBe("2027-03");
    });
  });
});
