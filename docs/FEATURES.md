# Features

What the site actually does, from a visitor's and an author's point of view. Implementation detail lives in [ARCHITECTURE.md](ARCHITECTURE.md); planned work lives in [ROADMAP.md](ROADMAP.md).

- [The site](#the-site)
- [Terminal](#terminal)
- [Easter eggs](#easter-eggs)
- [Blog and authoring](#blog-and-authoring)
- [AI assistance](#ai-assistance)
- [SEO](#seo)
- [Media](#media)
- [Newsletter](#newsletter)
- [Cross-posting](#cross-posting)
- [Game Zone](#game-zone)
- [Points and the store](#points-and-the-store)
- [Analytics](#analytics)

---

## The site

[hoseacodes.com](http://www.hoseacodes.com/) — a personal blog and portfolio, first published September 2020.

The home page introduces who I am, with a résumé download, current technologies, a project showcase, an embedded Twitter widget and testimonials. From there: [portfolio](https://www.dominiquehosea.com), blog posts, about, and contact. Additional sections cover case studies, projects, a shop and the game store.

---

## Terminal

An interactive terminal, in the corner of a personal site, that is a real command loop rather than a decoration.

**Open it with `Ctrl`/`Cmd` + `H`.** Close it the same way, with `Escape`, or with the `×` button.

| Command | Does |
|---|---|
| `help` | List every command |
| `about` | About me |
| `languages` | Programming languages with proficiency levels |
| `skills` | Technical skills with proficiency levels |
| `projects` | Notable projects |
| `editor` | Current editor setup |
| `spotify` | Currently playing or recently played track |
| `github` · `twitter` · `linkedin` | Open the respective profile |
| `cat` | A random cat picture, in a new tab |
| `echo <text>` | Print text |
| `ls` · `cd <dir>` · `mkdir <name>` | Navigate a simulated filesystem |
| `sudo <command>` | Behaves about as well as you would expect |
| `clear` | Clear the screen |

Start with `help`.

Implementation: `src/Components/ShortcutModals/TerminalModal.jsx`.

---

## Easter eggs

Two full desktop simulations, reachable from the site: an **Ubuntu** desktop (`src/Components/UbuntuEasterEgg/`) with its own window manager, app config and terminal, and a **macOS** desktop (`src/Components/MacEasterEgg/`). There is also a planets scene and a scramble-text effect.

---

## Blog and authoring

Articles are written in Markdown and rendered to sanitised HTML **at write time**, so nothing on the read path can serve unsanitised content ([ADR-006](adr/ADR-006-write-time-sanitisation.md)).

**Authoring workflow** — drafts with auto-save, one-click publish, scheduled publishing with a date and time, duplicate, archive, batch publish and batch delete, and version history with restore.

> **Scheduling records the intent but nothing acts on it.** The cron job that would flip scheduled posts to published cannot fire — see [OPERATIONS.md](OPERATIONS.md#failure-modes). Publish manually until that is fixed.

**Reader features** — categories and tags, syntax-highlighted code, estimated reading time, likes, bookmarks ("saved" articles), comments, view counts, related posts, and social preview cards for crawlers (`/blog/:slug` serves Open Graph and Twitter metadata server-side, so shared links unfurl properly).

---

## AI assistance

Thirteen OpenAI-backed endpoints available while writing: generate from a prompt, improve for grammar/clarity/engagement, suggest titles, build an outline, expand, summarise, translate, generate per-platform social posts, grammar check, style suggestions, meta tags, key point extraction and calls to action.

There is also **AI art** (Stability AI): generate a watermarked preview, then buy the full asset with PayPal or with points.

And **text to speech** for articles, which is the one AI surface with a real per-user quota and usage accounting.

---

## SEO

Real-time scoring while writing: readability (Flesch Reading Ease), keyword density, meta description generation, title optimisation, duplicate content checks, link structure analysis, competitor analysis, trending topics, image alt-text suggestions, and Schema.org structured data generation.

A generated `/sitemap.xml` is served at the site root.

---

## Media

A Cloudinary-backed library: upload with progress, multi-file upload, folder organisation, search, metadata editing, image optimisation, and library statistics. Local image processing (`imagemin`, WebP) runs at boot via `utils/imageOp.js`.

---

## Newsletter

Double opt-in signup powered by Resend. Signup is **idempotent** — signing up again with the same address rotates the verification token rather than creating a second row. Verify and unsubscribe are token links, and both endpoints are public by necessity, which is why the router's mount position in `app.js` matters ([ARCHITECTURE.md](ARCHITECTURE.md#mount-ordering--a-real-invariant)).

Admins can broadcast a published article to the list.

Without `RESEND_API_KEY`, signup still records the subscriber and delivery becomes a logged no-op — the integration suite depends on that behaviour.

---

## Contact

The contact page posts directly to **GetForm**, a hosted form backend — a native browser POST, not a call through this API. Submissions land in the GetForm dashboard and are never stored here.

Worth knowing if a message goes missing: the "Processing Your Request…" notification fires *before* the submission resolves, so it appears whether or not the POST succeeded. See [ARCHITECTURE.md](ARCHITECTURE.md#third-party-integrations).

---

## Cross-posting

Connect a LinkedIn account through OAuth, then push a published article to it — with per-article intro text, or a generated fallback built from title, description and URL. `linkedinPostedAt` and `linkedinPostUrn` are stamped on the article so a small edit and republish does not post a duplicate.

The OAuth callback is intentionally the one un-gated admin route: LinkedIn's browser redirect cannot carry a JWT.

Environment groundwork exists for dev.to and Medium cross-posting; those branches are inactive unless their keys are set.

---

## Game Zone

A game centre for a technical command centre — mini-games with a personal spin, where scores become points, points unlock things on the site, and long loading screens become something to do rather than something to wait through.

**Listed today:** Pac-Man, Space Invaders, Sweet Crush. The Game Store (`src/Pages/GameStore/`) wraps them in a browsable storefront with filters, animated cards and a points HUD.

**Built but not listed:** Frogger, Connect Four, Food Fall, Race, Scroll, Bird Shooter, Whack-a-Mole, Tic Tac Toe, Sudoku, Speed Test. Thirteen components exist in `src/Components/Games/`; ten are commented out of the catalogue in `src/Constants/games.js` and cannot be reached. Re-listing one is uncommenting its entry — see [GAMES.md](GAMES.md#built-vs-listed).

**The original design sketch**, still the target for the themed set:

1. **Code Runner** — typing-speed challenge over real code snippets. Points from WPM plus accuracy. Unlocks advanced templates and faster deployment tools.
2. **Load Balancer** — resource management. Drag incoming requests across servers to prevent overload; points for efficiency and uptime. Unlocks infrastructure monitoring and deploy credits.
3. **Memory Leak Hunter** — pattern matching against visual code blocks. Points for speed and accuracy. Unlocks debugging tools and performance insights.
4. **API Tetris** — stack API components into microservices; different shapes are different services (auth, database, cache). Points for clean architecture and completed systems. Unlocks architecture templates and service blueprints.
5. **Crypto Miner** — a clicker, deliberately minimal, for loading screens. Steady accumulation. Unlocks multipliers and auto-mining.

`routes/player.js` (player profiles and badges) is written but **not mounted** — dead code awaiting this work.

---

## Points and the store

Points behave like tokens: earn them by playing, sync them when a session ends, or buy packs with PayPal. Spend them in the store on downloadable items, or on AI art.

Endpoints: balance, transaction ledger, sync, earn, spend, pack purchase and capture, store catalogue (public), redeem, my-redemptions, and authenticated downloads. See [API.md](API.md#points-and-store).

---

## Analytics

View and engagement tracking, per-article statistics, top articles, traffic sources, reader demographics, conversion metrics, a real-time view and an export path — recorded in MongoDB, alongside `react-ga4` for page-level analytics in the browser.

The write endpoints (`/api/analytics/view` and `/engagement`) are **public**, so anonymous reads are counted — but they are also unauthenticated and unthrottled, so the counts can be inflated by anyone with a loop. Reading the numbers back requires a token.
