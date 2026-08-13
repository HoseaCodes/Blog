# Roadmap

Planned work, in two parts: engineering debt that should be paid before new features, and the product ideas the site is heading towards.

- [Engineering, ranked](#engineering-ranked)
- [Articles](#articles)
- [Users](#users)
- [Games](#games)
- [Shop](#shop)
- [Projects and case studies](#projects-and-case-studies)
- [DevOps](#devops)
- [Portfolio research](#portfolio-research)

---

## Engineering, ranked

Ranked by value, not effort. The first six are correctness or safety issues, not enhancements.

1. **Article edits never reach readers.** `updateArticle` writes with `findOneAndUpdate`, which is query middleware and does **not** fire the `pre('validate')` hook that renders `markdown` → `sanitizedHtml`. The read path serves `sanitizedHtml`, so **every edit to an existing article is invisible on the live site** — the original text keeps being served. Confirmed against production. Fix the write path, add an update-path test, and **backfill**: any article edited since publication is currently serving stale HTML. See [ADR-006](adr/ADR-006-write-time-sanitisation.md).
2. **Fix scheduled publishing.** `cron/scheduledPost.js` compares a formatted string to a `Date` with `===`. Fix the comparison, add a test, and decide how the job survives `min_machines_running = 0`.
3. **Ownership and role checks on content mutations.** Any authenticated user can edit or delete any article. Write the negative test first — it should fail today.
4. **Turn on the rate limiter.** It is already constructed in `app.js`; the `app.use` line is commented out. Start with `/api/ai/*` and `/api/tts/*`, which cost money per call.
5. **Fix `GET /api/user/admin/all`** — **confirmed exposed in production**: an unauthenticated request returns real user records including email addresses and status. This is not an oversight; the controller says so itself:

   ```js
   // TEMP: no server-side auth. The /admin/users page gates access client-side
   // using the role returned from Storm-Gate's /me. Anyone who can reach this
   // endpoint (including unauthenticated) can dump every user. Lock down before
   // deploying publicly — re-add auth middleware + a real admin check.
   ```

   It was deployed publicly. Re-add `auth` + `authAdmin`. Also replace `loginRequired`, which passes whenever `req.params.id` exists — i.e. always.
6. **Fix slug generation.** `createArticle` builds the slug as `title.toLowerCase().replace(/ /g, "-")`, which replaces spaces and **strips no punctuation** — a title with a comma or colon produces a slug like `one-contract:-building-an-arcade`. Both `slug` and `slugify` are already dependencies and unused here. Note the schema's own slugify hook is commented out in `models/article.js`, so the controller is the only place this happens.
7. **Add `/health`** with a Mongo ping, and wire an HTTP check in `fly.toml`.
8. **Fill or delete the 12 empty unit test suites** so `npm test` exits zero and means something. Fix `imageOp.test.js`'s transform config while there.
9. **Test the blog workflow endpoints** — publish, schedule, restore, batch delete are the widest-blast-radius mutations and have no coverage.
10. **A uniform response envelope** and a real error contract (RFC 7807 or equivalent), with correlation ids.
11. **Validate `ACCESS_TOKEN_SECRET` at startup** and refuse to boot without it.
12. **Harden the Docker image** — multi-stage, `node:20-slim`, non-root user.
13. **React 18 / Vite migration**, retiring `react-scripts@4.0.3`, the `@babel/core` pin and the `--legacy-peer-deps` requirement. A project, not a bump.
14. **Fill in `api/openapi.yaml`.** Swagger UI is now served at `/api-docs` and properly gated, but the spec describes 2 of roughly 150 endpoints and still lists a SwaggerHub mock server. A spec that thin is worse than none, because the UI implies completeness.
15. **Make Snyk blocking**, or state plainly that it is advisory. Today it is `continue-on-error` plus `|| true`.
16. **Retire the `dev.v*` tagging** in `master.yaml`, which nothing consumes, and the deprecated `::set-output` calls.
17. **Tidy the contact form.** The GetForm endpoint id is duplicated across `Contact.jsx` and the apparently-unused `ContactForm.jsx`; the success notification fires before the POST resolves, so failures read as successes; and the public endpoint has no spam protection.

---

## Articles

- [x] Save a blog post as a draft
- [x] View comments
- [x] Estimated reading time
- [ ] Save a post to favourites
- [ ] Scheduled publishing that actually fires
- [ ] Track views on anonymous reads
- [ ] Like a comment
- [ ] Notifications button on a post
- [ ] Let a signed-in user edit their own post
- [ ] Syntax highlighting improvements
- [ ] Reactions
- [ ] Unsplash integration — pick a cover image from [Unsplash](https://unsplash.com/documentation) while writing

Reference implementation worth reading: [react-blog-github](https://github.com/saadpasta/react-blog-github).

---

## Users

- Follow an author
- Save an author to favourites
- View your profile page
- Update your profile page
- 404 routing

---

## Games

- **Re-list the ten disabled games.** Thirteen components exist; only Sweet Crush, Pacman and Space Invaders are active in `src/Constants/games.js`. The rest — Frogger included — are commented out. Check each against the score contract as you re-enable it
- **Normalise scoring, or make the leaderboard per-game.** `highScores` ranks every game together while Frogger awards 1 per event and others award up to 500, so Frogger can never place. `getGameLeaderboard(gameId)` already exists
- **Route `HighScores`** — it is written, styled and unreachable
- Build the dedicated Game page
- Mount `routes/player.js` — player profiles and badges are written but unreachable
- The five themed mini-games in [FEATURES.md](FEATURES.md#game-zone): Code Runner, Load Balancer, Memory Leak Hunter, API Tetris, Crypto Miner
- Wire game scores into the points economy end to end
- Play-during-loading: use long loads as game time rather than dead time

---

## Shop

- Build the Shop page
- Link it to the Etsy shop
- Add to cart
- Checkout
- Order history

---

## Projects and case studies

Add as case studies: Calorie Kitchen, Sneaker-API, Ecommerce-Site, Ecommerce-Backend-Template, React-Crypto, Crypto-Learn, CareerConnect, Expense-Tracker — and build one template all of them share.

Projects to highlight: Pure CSS, Social Ring (update), Kidvercity (update), LeadGen, SneakerAPI, Writemind, CareerCompose, and — as they finish — CareerConnect, UIHeat, Analytics, AI Quiz, Budget App.

---

## DevOps

- [x] GitHub Actions
- [x] Static scan
- [x] Dependency scan
- [x] Lint
- [x] Integration testing
- [x] Release automation
- [x] Version handling
- [ ] Unit and E2E testing
- [ ] Multiple environments — staging exists; still need env-to-config mapping
- [ ] Upload to EOT

---

## Portfolio research

Reference sites collected while designing this one, kept because they are still useful when the next section gets built.

<details>
<summary>Cloud and AI portfolios</summary>

- <https://cassanellicarlo.com/>
- <https://djomegni.com/>
- <https://kozodoi.me/portfolio/>
- <http://www.ericwadkins.com/>
- <https://github.com/thavlik/machine-learning-portfolio>
- <https://aksh-ai.com/>
- <https://medium.com/muthoni-wanyoike/building-a-strong-ai-portfolio-showcase-your-skills-to-employers-d6be0c999f0a>
- <https://www.projectpro.io/article/ml-projects-ideas-with-source-code/474>
- <https://github.com/nitsuga1986/machine-learning-nd-portfolio>
</details>

<details>
<summary>DevOps portfolios</summary>

- <https://dev.to/softwaresennin/build-a-stellar-devops-portfolio-with-no-prior-experience-jp8>
- <https://medium.com/@AnnAfame/how-to-build-your-projects-portfolio-as-a-junior-devops-engineer-252b554f2291>
- <https://troyingram.net/>
- <https://adityacprtm.dev/portfolio>
- <https://adityagundecha.com/>
- <https://www.mayankdevops.com/>
- <https://www.jodywan.com/>
- <https://www.projectpro.io/article/real-time-devops-projects-for-practice/585>
- <https://www.surajdhakre.xyz/projects>
- <https://www.knowledgehut.com/blog/devops/devops-projects>
</details>

<details>
<summary>Frontend portfolios</summary>

- <https://itssharl.ee/fr>
- <https://www.behance.net/gallery/186671031/Portfolio-for-Frontend-Developer>
- <https://tamalsen.dev/>
- <https://dunks1980.com/>
- <https://bepatrickdavid.com/>
- <https://www.lauren-waller.com/>
- <https://vanholtz.co/>
- <https://resn.co.nz/>
- <https://www.seyi.dev/>
- <https://cydstumpel.nl/>
</details>

<details>
<summary>Backend portfolios</summary>

- <https://blog.hubspot.com/website/backend-projects>
- <https://blog.devgenius.io/designing-a-backend-developer-portfolio-website-a-ux-case-study-5881236ec36b>
- <https://www.youtube.com/watch?v=nIracKeqsFk>
</details>

<details>
<summary>Game dev portfolios</summary>

- <https://bruno-simon.com/>
- <http://www.rleonardi.com/interactive-resume/>
- <https://caferati.me/>
- <https://jesse-zhou.com/>
</details>

<details>
<summary>Engineering portfolios — mechanical, electrical, robotics, architecture</summary>

**Mechanical**
- <https://mitcommlab.mit.edu/meche/commkit/portfolio/>
- <https://www.freelance.pizza/post/build-a-stunning-engineering-portfolio>
- <https://thanhvtran.com/>
- [Sienna Magee portfolio (PDF)](https://static1.squarespace.com/static/5605c610e4b06b221b9e1b52/t/5a9b0a1c0d9297b125485029/1520110148892/Sienna+Magee+Portfolio+v2.pdf)
- [William Sadowski design portfolio (PDF)](https://www.williamsadowski.com/Portfolio/DesignPortfolio_Sadowski.pdf)
- <https://www.hannahgazdus.com/>
- <https://www.tjwatson.net/>
- <https://mjaspeg.wixsite.com/mjaspe>
- <https://www.hardwareishard.net/portfolio-database>
- <https://fwachter.github.io/>
- <https://sites.google.com/view/sethschafferportfolio/home>
- <https://www.colinkeil.com/>
- <https://evangrant.wordpress.ncsu.edu/>

**Electrical**
- <https://www.jeremyblum.com/portfolio/>
- <https://priswidjaja.wixsite.com/portfolio>
- <https://slidesgo.com/theme/electrical-engineer-portfolio>
- <https://twcarobotics.com/engineering-notebook/>
- [FTC Browncoats engineering portfolio (PDF)](https://ftcbrowncoats.org/wp-content/uploads/2021/05/Engineering-Portfolio.pdf)

**Robotics**
- <https://www.mccormick.northwestern.edu/robotics/curriculum/featured-project-portfolios.html>
- [Kuriosity Robotics portfolio (PDF)](https://www.kuriosityrobotics.com/_files/ugd/065d5b_84b3c96fc00c4ac7bedb8852eeddec67.pdf)
- <https://ethanholand.com/>
- <https://www.jesseweisberg.com/>

**Architecture**
- <https://www.schabell.org/2022/05/portfolio-architecture-examples-application-development-collection.html>
- <https://spetrescu.ro/>
</details>
