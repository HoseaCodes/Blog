// Integration tests for the Articles API. Drives the real Express app over
// HTTP (supertest) against a real MongoDB (Testcontainers), and asserts both
// the HTTP response AND the database side-effect. `auth` is real; the outbound
// Storm-Gate /me lookup it performs is mocked with nock.
const { api } = require("../helpers/api.cjs");
const { buildArticle } = require("../helpers/factories.cjs");
const { bearerToken, mockStormGateMe } = require("../helpers/auth.cjs");

const Articles = require("../../models/article.js").default;

const slugFor = (title) => title.toLowerCase().replace(/ /g, "-");

describe("Articles API", () => {
  describe("POST /api/articles", () => {
    test("creates an article, returns it, and persists it to the DB", async () => {
      mockStormGateMe();
      const payload = buildArticle();

      const res = await api()
        .post("/api/articles")
        .set("Authorization", bearerToken())
        .send(payload);

      // Outcome via the API response...
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        success: true,
        article: { article_id: payload.article_id, title: payload.title },
      });

      // ...and the side-effect in the database.
      const inDb = await Articles.findOne({ article_id: payload.article_id });
      expect(inDb).not.toBeNull();
      expect(inDb.title).toBe(payload.title);
      expect(inDb.slug).toBe(slugFor(payload.title));
      // markdown is sanitized into HTML by a pre-validate hook.
      expect(inDb.sanitizedHtml).toContain("Body paragraph.");
    });

    test("rejects an unauthenticated request with 401 and writes nothing", async () => {
      const payload = buildArticle();

      const res = await api().post("/api/articles").send(payload);

      expect(res.status).toBe(401);
      const inDb = await Articles.findOne({ article_id: payload.article_id });
      expect(inDb).toBeNull();
    });

    test("rejects a duplicate article_id with 400", async () => {
      mockStormGateMe();
      const auth = bearerToken();
      const first = buildArticle();
      const seed = await api()
        .post("/api/articles")
        .set("Authorization", auth)
        .send(first);
      // Assert the precondition: if this create silently fails there is no
      // duplicate to reject, and the real cause shows up as a confusing
      // "expected 400, got 200" on the assertion below instead of here.
      expect(seed.status).toBe(200);

      const res = await api()
        .post("/api/articles")
        .set("Authorization", auth)
        .send(buildArticle({ article_id: first.article_id }));

      expect(res.status).toBe(400);
    });

    test("rejects a payload with no image with 400", async () => {
      mockStormGateMe();
      const { images, ...noImage } = buildArticle();

      const res = await api()
        .post("/api/articles")
        .set("Authorization", bearerToken())
        .send(noImage);

      expect(res.status).toBe(400);
    });

    test("still succeeds when the Storm-Gate /me lookup fails (graceful degradation)", async () => {
      // No mockStormGateMe(): the outbound /me call is blocked by nock's
      // disableNetConnect, `auth` swallows the error, and creation proceeds
      // because create only needs an authenticated caller, not the profile.
      const payload = buildArticle();

      const res = await api()
        .post("/api/articles")
        .set("Authorization", bearerToken())
        .send(payload);

      expect(res.status).toBe(200);
      expect(await Articles.findOne({ article_id: payload.article_id })).not.toBeNull();
    });
  });

  describe("GET /api/articles/:id", () => {
    test("returns a previously-created article by slug", async () => {
      mockStormGateMe();
      const payload = buildArticle();
      await api().post("/api/articles").set("Authorization", bearerToken()).send(payload);

      const res = await api().get(`/api/articles/${slugFor(payload.title)}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.article.article_id).toBe(payload.article_id);
    });

    test("returns 404 for an unknown id", async () => {
      const res = await api().get("/api/articles/no-such-article");
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/articles/:id", () => {
    test("deletes an article; it is gone from the DB afterward", async () => {
      mockStormGateMe();
      const auth = bearerToken();
      const payload = buildArticle();
      await api().post("/api/articles").set("Authorization", auth).send(payload);
      const created = await Articles.findOne({ article_id: payload.article_id });

      const res = await api()
        .delete(`/api/articles/${created._id}`)
        .set("Authorization", auth);

      expect(res.status).toBe(200);
      expect(await Articles.findById(created._id)).toBeNull();
    });
  });
});
