// Integration tests for the Newsletter Subscribers API. Exercises the public
// double-opt-in flow (signup -> verify -> unsubscribe) against a real MongoDB,
// and the admin list endpoint whose authorization depends on the role returned
// by the (nock-mocked) Storm-Gate /me lookup.
//
// Outbound email runs in no-op mode here: utils/email.js skips the network when
// RESEND_API_KEY is unset (see test/setup/env.cjs), so signup is deterministic
// and never contacts Resend.
const { api } = require("../helpers/api.cjs");
const { buildSubscriber } = require("../helpers/factories.cjs");
const { bearerToken, mockStormGateMe } = require("../helpers/auth.cjs");

const Subscribers = require("../../models/subscriber.js").default;

describe("Subscribers API", () => {
  describe("POST /api/subscribers (public signup)", () => {
    test("creates an unverified subscriber with a verify token", async () => {
      const { email } = buildSubscriber();

      const res = await api().post("/api/subscribers").send({ email });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");

      const inDb = await Subscribers.findOne({ email });
      expect(inDb).not.toBeNull();
      expect(inDb.verified).toBe(false);
      expect(inDb.verifyToken).toBeTruthy();
      expect(inDb.unsubscribeToken).toBeTruthy();
    });

    test("rejects an invalid email with 400 and writes nothing", async () => {
      const res = await api().post("/api/subscribers").send({ email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(await Subscribers.countDocuments()).toBe(0);
    });

    test("is idempotent: re-signup with the same email rotates the token, no duplicate row", async () => {
      const { email } = buildSubscriber();
      await api().post("/api/subscribers").send({ email });
      const first = await Subscribers.findOne({ email });

      const res = await api().post("/api/subscribers").send({ email });

      expect(res.status).toBe(200);
      expect(await Subscribers.countDocuments({ email })).toBe(1);
      const second = await Subscribers.findOne({ email });
      expect(second.verifyToken).not.toBe(first.verifyToken);
    });
  });

  describe("GET /api/subscribers/verify/:token", () => {
    test("confirms the subscription for a valid token", async () => {
      const { email } = buildSubscriber();
      await api().post("/api/subscribers").send({ email });
      const { verifyToken } = await Subscribers.findOne({ email });

      const res = await api().get(`/api/subscribers/verify/${verifyToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      const inDb = await Subscribers.findOne({ email });
      expect(inDb.verified).toBe(true);
      expect(inDb.verifiedAt).toBeTruthy();
    });

    test("returns 404 for an unknown token", async () => {
      const res = await api().get("/api/subscribers/verify/deadbeef");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /api/subscribers/unsubscribe/:token", () => {
    test("opts the subscriber out", async () => {
      const { email } = buildSubscriber();
      await api().post("/api/subscribers").send({ email });
      const { unsubscribeToken } = await Subscribers.findOne({ email });

      const res = await api().get(`/api/subscribers/unsubscribe/${unsubscribeToken}`);

      expect(res.status).toBe(200);
      const inDb = await Subscribers.findOne({ email });
      expect(inDb.verified).toBe(false);
      expect(inDb.unsubscribedAt).toBeTruthy();
    });
  });

  describe("GET /api/subscribers (admin list) — authorization from mocked /me", () => {
    beforeEach(async () => {
      await Subscribers.create(buildSubscriber());
      await Subscribers.create(buildSubscriber());
    });

    test("returns the list when /me reports an admin (role=1)", async () => {
      mockStormGateMe({ role: 1 });

      const res = await api()
        .get("/api/subscribers")
        .set("Authorization", bearerToken());

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.count).toBe(2);
      expect(Array.isArray(res.body.subscribers)).toBe(true);
    });

    test("returns 403 when /me reports a non-admin (role=0)", async () => {
      mockStormGateMe({ role: 0 });

      const res = await api()
        .get("/api/subscribers")
        .set("Authorization", bearerToken());

      expect(res.status).toBe(403);
    });

    test("returns 401 without a token", async () => {
      const res = await api().get("/api/subscribers");
      expect(res.status).toBe(401);
    });
  });
});
