/*
  Seeds the /admin/roadmap tracker: two curricula, their programs, and the
  paid alternatives that would replace them.

  Run with:  node scripts/seedRoadmap.mjs --dry-run
             node scripts/seedRoadmap.mjs

  Content was authored in the Curriculum Ledger artifact and exported from its
  document store, which is why the slugs are readable rather than generated.

  Idempotent: upserts by slug, so re-running updates rather than duplicating.
  Nothing is deleted. Fields absent from a record here are left alone on an
  existing document, so a partial edit in the UI survives a re-seed.

  Every course link below was checked before seeding. Three could not be:
  scad.edu and Epic block automated requests, returning the same response for
  real and invented paths, so those records carry a note saying so.
*/

import "dotenv/config";
import mongoose from "mongoose";
import Curriculums from "../models/curriculum.js";
import Programs from "../models/program.js";
import Alternatives from "../models/alternative.js";
import Settings from "../models/setting.js";

const DRY_RUN = process.argv.includes("--dry-run");

// Month 1 of the plan. The Gantt labels its axis from this.
const ANCHOR = "2026-10";

const CURRICULA = [
    {
      "slug": "game-development",
      "name": "Game Development",
      "why": "",
      "shortTermGoal": "",
      "longTermGoal": "",
      "rating": 0,
      "detail": "A twelve-month route from Unity fundamentals to a playable vertical slice of **Neighborhood Wars**.\n\nThe sequencing assumes you already program professionally, so the C# and general-programming material moves fast. What is genuinely new is game architecture, 3D art and animation, level design, and shipping.\n\nFrom month three on, spend roughly 30-40% of the time learning and 60-70% applying it directly to Neighborhood Wars. The goal at month twelve is one polished playable section, not a stack of certificates.",
      "startMonth": 1,
      "endMonth": 12,
      "color": "#d98324",
      "order": 10
    },
    {
      "slug": "computer-science",
      "name": "Computer Science",
      "why": "",
      "shortTermGoal": "",
      "longTermGoal": "",
      "rating": 0,
      "detail": "The CS depth a B.F.A. in game development would not give you, assembled from the courses working engineers actually cite.\n\nOne canonical free course per subject: discrete math, data structures and algorithms, computer architecture, operating systems, networks, databases, and distributed systems.\n\n6.824 has the most direct line to the platform and AI-infrastructure work you are aiming at. It sits last because the earlier subjects support it.",
      "startMonth": 1,
      "endMonth": 12,
      "color": "#4f6bed",
      "order": 20
    }
  ];

const PROGRAMS = [
    {
      "slug": "mit-6042j",
      "curriculumSlug": "computer-science",
      "name": "Mathematics for Computer Science",
      "code": "6.042J",
      "provider": "MIT OpenCourseWare",
      "startMonth": 1,
      "endMonth": 2,
      "lengthLabel": "~13 wks",
      "progress": 0,
      "link": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-fall-2010/",
      "detail": "The prerequisite the rest of this lane quietly assumes. Proof technique, induction, graphs, counting and discrete probability turn up again in algorithms, databases and distributed systems.\n\nDo it first even though it feels least connected to shipping anything.",
      "teaches": [
        "Proofs",
        "Induction",
        "Graph theory",
        "Counting",
        "Probability",
        "Recurrences"
      ],
      "outcome": "The mathematical vocabulary the later subjects assume",
      "order": 10
    },
    {
      "slug": "princeton-algorithms",
      "curriculumSlug": "computer-science",
      "name": "Algorithms, Part I & II",
      "code": "",
      "provider": "Princeton / Coursera",
      "startMonth": 2,
      "endMonth": 4,
      "lengthLabel": "~12 wks",
      "progress": 0,
      "link": "https://www.coursera.org/learn/algorithms-part1",
      "detail": "Sedgewick and Wayne. The most direct answer to the FAANG interview bar, and the subject where your existing experience helps least — professional backend work rarely makes you implement a red-black tree.\n\nPart II (graphs and strings) is the half most people skip and the half that shows up in system design.",
      "teaches": [
        "Union-find",
        "Sorting",
        "Priority queues",
        "Symbol tables",
        "Graphs",
        "Strings",
        "Complexity"
      ],
      "outcome": "The data-structures fluency interviews actually test",
      "order": 20
    },
    {
      "slug": "nand2tetris",
      "curriculumSlug": "computer-science",
      "name": "Build a Modern Computer from First Principles",
      "code": "",
      "provider": "nand2tetris",
      "startMonth": 4,
      "endMonth": 5,
      "lengthLabel": "~12 wks",
      "progress": 0,
      "link": "https://www.nand2tetris.org/",
      "detail": "Computer architecture by construction: NAND gates up to a running Tetris. It closes the gap between the code you write and what the machine does, which is the thing a CS degree gives you that self-taught engineers most often lack.\n\nThe most enjoyable course in this lane, and the one that makes the operating-systems material land.",
      "teaches": [
        "Boolean logic",
        "ALU design",
        "Machine language",
        "Assembler",
        "VM",
        "Compiler",
        "OS basics"
      ],
      "outcome": "A working computer and compiler you built from NAND gates",
      "order": 30
    },
    {
      "slug": "ostep",
      "curriculumSlug": "computer-science",
      "name": "Operating Systems: Three Easy Pieces",
      "code": "OSTEP",
      "provider": "Wisconsin (Arpaci-Dusseau)",
      "startMonth": 5,
      "endMonth": 7,
      "lengthLabel": "~10 wks",
      "progress": 0,
      "link": "https://pages.cs.wisc.edu/~remzi/OSTEP/",
      "detail": "Free, complete, and the standard recommendation. Three parts: virtualisation, concurrency, persistence.\n\nThe concurrency section is the one that pays off immediately in backend work, and the persistence section is the groundwork for the databases course.",
      "teaches": [
        "Processes",
        "Scheduling",
        "Virtual memory",
        "Concurrency",
        "Locks",
        "File systems",
        "Persistence"
      ],
      "outcome": "A real mental model of virtualisation, concurrency and persistence",
      "order": 40
    },
    {
      "slug": "stanford-cs144",
      "curriculumSlug": "computer-science",
      "name": "Introduction to Computer Networking",
      "code": "CS144",
      "provider": "Stanford",
      "startMonth": 7,
      "endMonth": 8,
      "lengthLabel": "~8 wks",
      "progress": 0,
      "link": "https://cs144.github.io/",
      "detail": "The labs are the reason to pick this one: you build a working TCP in C++ over the course, rather than reading about it.\n\nDirectly useful for the multiplayer architecture Neighborhood Wars will eventually need.",
      "teaches": [
        "The four-layer model",
        "TCP",
        "Routing",
        "Packet switching",
        "Congestion control"
      ],
      "outcome": "Your own working TCP implementation",
      "order": 50
    },
    {
      "slug": "cmu-15445",
      "curriculumSlug": "computer-science",
      "name": "Database Systems",
      "code": "15-445",
      "provider": "Carnegie Mellon",
      "startMonth": 8,
      "endMonth": 10,
      "lengthLabel": "~14 wks",
      "progress": 0,
      "link": "https://15445.courses.cs.cmu.edu/",
      "detail": "Andy Pavlo's course, taught from the inside out: you implement buffer pool, B+tree, execution and concurrency control.\n\nAfter this, the Mongo and Postgres decisions in your own blog and arcade work stop being guesswork.",
      "teaches": [
        "Storage",
        "Buffer pools",
        "Indexes",
        "Query execution",
        "Query optimisation",
        "Concurrency control",
        "Recovery"
      ],
      "outcome": "Components of a working database you wrote yourself",
      "order": 60
    },
    {
      "slug": "mit-6824",
      "curriculumSlug": "computer-science",
      "name": "Distributed Systems",
      "code": "6.824",
      "provider": "MIT",
      "startMonth": 10,
      "endMonth": 12,
      "lengthLabel": "~13 wks",
      "progress": 0,
      "link": "https://pdos.csail.mit.edu/6.824/",
      "detail": "The course with the most direct line to the platform and AI-infrastructure roles you named. You implement Raft and build a fault-tolerant sharded key-value store in Go.\n\nPlaced last deliberately: it assumes the concurrency from OSTEP, the networking from CS144 and the transactions from 15-445. Doing it first is how people bounce off it.",
      "teaches": [
        "MapReduce",
        "Raft",
        "Fault tolerance",
        "Replication",
        "Consistency",
        "Sharding",
        "Transactions"
      ],
      "outcome": "A working Raft implementation and a sharded key-value store",
      "order": 70
    },
    {
      "slug": "unity-game-dev-pathway",
      "curriculumSlug": "game-development",
      "name": "Unity Game Development Pathway",
      "code": "",
      "provider": "Unity Learn",
      "startMonth": 1,
      "endMonth": 3,
      "lengthLabel": "~12 wks",
      "progress": 0,
      "link": "https://learn.unity.com/pathway/game-development",
      "detail": "The closest free equivalent to a structured game-development course rather than a pile of tutorials. You build one 3D game and one 2D game, write a design document, and ship a finished project.\n\nApply each module to Neighborhood Wars as you go instead of building the sample games and discarding them.",
      "teaches": [
        "C#",
        "2D and 3D",
        "Game design document",
        "UI",
        "Animation",
        "VFX",
        "Lighting",
        "Publishing"
      ],
      "outcome": "A finished small game, plus a written game design document",
      "order": 10
    },
    {
      "slug": "unity-junior-programmer",
      "curriculumSlug": "game-development",
      "name": "Unity Junior Programmer",
      "code": "",
      "provider": "Unity Learn",
      "startMonth": 1,
      "endMonth": 3,
      "lengthLabel": "~12 wks",
      "progress": 0,
      "link": "https://learn.unity.com/pathway/junior-programmer",
      "detail": "The programming-heavy companion to the main pathway. Given your background you will move through the introductory sections quickly; the value is in the game-specific architecture, not the C# syntax.",
      "teaches": [
        "Object-oriented game architecture",
        "Gameplay systems",
        "Debugging",
        "Data",
        "Reusable systems"
      ],
      "outcome": "Job-ready Unity programming patterns",
      "order": 20
    },
    {
      "slug": "cs50-2d-game-development",
      "curriculumSlug": "game-development",
      "name": "Introduction to 2D Game Development",
      "code": "CS50G",
      "provider": "Harvard",
      "startMonth": 4,
      "endMonth": 5,
      "lengthLabel": "~8 wks",
      "progress": 0,
      "link": "https://cs50.harvard.edu/games/",
      "detail": "Games modelled on Pong, Flappy Bird, Breakout, Match 3, Mario, Zelda, Angry Birds and Pokemon. The point is not the clones; it is seeing the same architectural patterns (state machines, collision, entity update loops) solved seven different ways.\n\nCurrent and maintained, free through Harvard OpenCourseWare.",
      "teaches": [
        "Game architecture",
        "Collision detection",
        "State machines",
        "Animation",
        "Audio",
        "Gameplay systems"
      ],
      "outcome": "Working implementations of classic mechanics",
      "order": 30
    },
    {
      "slug": "cs50g-archive",
      "curriculumSlug": "game-development",
      "name": "CS50 Introduction to Game Development (archived)",
      "code": "CS50G 2018",
      "provider": "Harvard",
      "startMonth": 4,
      "endMonth": 5,
      "lengthLabel": "~12 wks",
      "progress": 0,
      "link": "https://cs50.harvard.edu/games/2018/",
      "detail": "Harvard retired this version in June 2024, so it is archived rather than maintained. It is still worth the detour for its Unity and C# material, which the current 2D-only course does not cover.\n\nOptional. Skip it if the Unity pathways already covered the same ground for you.",
      "teaches": [
        "Unity",
        "C#",
        "Lua",
        "2D and 3D",
        "Graphics",
        "Animation",
        "Sound",
        "Collision"
      ],
      "outcome": "Unity and Lua coverage the current course drops",
      "order": 40
    },
    {
      "slug": "blender-education",
      "curriculumSlug": "game-development",
      "name": "Blender",
      "code": "",
      "provider": "blender.org",
      "startMonth": 6,
      "endMonth": 7,
      "lengthLabel": "Self-paced",
      "progress": 0,
      "link": "https://www.blender.org/support/tutorials/",
      "detail": "The largest gap between you and a game-development graduate is not programming, it is art. Modelling, UVs, materials, lighting and animation are what a BFA spends its studio credits on.\n\nModel the actual assets Neighborhood Wars needs rather than working through unrelated exercises.",
      "teaches": [
        "3D modelling",
        "UVs",
        "Materials",
        "Character animation",
        "Lighting",
        "Level design"
      ],
      "outcome": "Your own props, environments and simple character animation",
      "order": 50
    },
    {
      "slug": "unreal-new-user-track",
      "curriculumSlug": "game-development",
      "name": "Unreal Engine New User Track",
      "code": "",
      "provider": "Epic Games",
      "startMonth": 8,
      "endMonth": 9,
      "lengthLabel": "Self-paced",
      "progress": 0,
      "link": "https://dev.epicgames.com/community/unreal-engine/getting-started",
      "detail": "A second engine, learned after Unity rather than alongside it. Epic splits the track by role - programmer (C++), designer (Blueprints and level design), artist (materials and assets).\n\nThe designer and artist tracks are the reason to do this: they teach you what the other half of a game team actually does, which pure programming courses never cover.\n\n*Link not verified - Epic blocks automated checks. If it has moved, search Epic's learning portal for the New User track.*",
      "teaches": [
        "C++",
        "Blueprints",
        "Gameplay",
        "Level design",
        "Materials",
        "Packaging"
      ],
      "outcome": "A packaged 3D platformer",
      "order": 60
    },
    {
      "slug": "neighborhood-wars-slice",
      "curriculumSlug": "game-development",
      "name": "Neighborhood Wars vertical slice",
      "code": "",
      "provider": "Your project",
      "startMonth": 10,
      "endMonth": 12,
      "lengthLabel": "3 months",
      "progress": 0,
      "link": "",
      "detail": "Stop taking courses. Build one polished playable section end to end: neighbourhood, units, resources, combat, AI opponent, win condition, UI, audio, save and load, finished environment.\n\nAt month twelve this is what you want to be holding — a slice on itch.io or Steam with source, a gameplay trailer and devlogs, rather than thirty disconnected certificates.",
      "teaches": [
        "AI opponent",
        "Pathfinding",
        "Save and load",
        "Inventory",
        "Combat",
        "Optimisation",
        "Audio",
        "Polish"
      ],
      "outcome": "One polished playable section, a trailer, and a devlog",
      "order": 70
    }
  ];

const ALTERNATIVES = [
    {
      "slug": "gatech-omscs",
      "curriculumSlug": "computer-science",
      "name": "Online M.S. Computer Science (OMSCS)",
      "provider": "Georgia Tech",
      "kind": "paid",
      "costAmount": null,
      "costUnit": "",
      "costNote": "Not checked - the cost page is rendered client-side; confirm before budgeting",
      "credential": "M.S.",
      "format": "Online",
      "link": "https://omscs.gatech.edu/",
      "tradeoff": "Covers most of this lane's subjects and has a games and graphics specialisation, so it is the middle ground between the two tracks. Slower than self-study and on someone else's schedule, but it ends in an accredited credential the free path cannot produce.",
      "order": 10
    },
    {
      "slug": "rice-online-mcs",
      "curriculumSlug": "computer-science",
      "name": "Online Master of Computer Science",
      "provider": "Rice University",
      "kind": "paid",
      "costAmount": null,
      "costUnit": "",
      "costNote": "Not checked - confirm current tuition before comparing",
      "credential": "M.C.S.",
      "format": "Online",
      "link": "https://csweb.rice.edu/academics/graduate-programs/online-mcs",
      "tradeoff": "The option aimed squarely at strengthening you as a software engineer rather than a game creator. Strong department and a real credential; typically a higher price than OMSCS, so check both before deciding.",
      "order": 20
    },
    {
      "slug": "scad-bfa-game-development",
      "curriculumSlug": "game-development",
      "name": "B.F.A. Game Development",
      "provider": "SCAD",
      "kind": "paid",
      "costAmount": 42975,
      "costUnit": "per year",
      "costNote": "2026-27 full-time undergraduate tuition, before housing and other expenses. Link not verified: scad.edu blocks automated checks, returning the same response for real and invented paths.",
      "credential": "B.F.A.",
      "format": "On-campus / online",
      "link": "https://www.scad.edu/academics/programs/game-development",
      "tradeoff": "Buys studio time, critique and a cohort you cannot replicate alone, plus real art instruction and an internship route. Against that: almost no CS depth (no data structures, OS, networks or distributed systems), four years, and roughly $43k a year for skills the tracked path also teaches.",
      "order": 10
    },
    {
      "slug": "scad-ma-mfa-idgd",
      "curriculumSlug": "game-development",
      "name": "M.A. / M.F.A. Interactive Design and Game Development",
      "provider": "SCAD (SCADnow online)",
      "kind": "paid",
      "costAmount": null,
      "costUnit": "",
      "costNote": "Tuition not checked. Link not verified either: scad.edu blocks automated checks, so confirm both the page and the price before comparing.",
      "credential": "M.A. / M.F.A.",
      "format": "Online",
      "link": "https://www.scad.edu/academics/programs/interactive-design-and-game-development",
      "tradeoff": "The stronger SCAD option for you: it adds game design and production on top of the engineering you already have, in one to two years instead of four, and your existing bachelor's makes you eligible. Still expensive, and still not where CS depth comes from.",
      "order": 20
    }
  ];

async function upsert(Model, label, records) {
  let created = 0;
  let updated = 0;

  for (const record of records) {
    if (DRY_RUN) {
      console.log(`  would upsert ${label} ${record.slug}`);
      continue;
    }
    const existing = await Model.exists({ slug: record.slug });
    await Model.findOneAndUpdate(
      { slug: record.slug },
      record,
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    if (existing) updated += 1;
    else created += 1;
  }

  if (!DRY_RUN) console.log(`  ${label}: ${created} created, ${updated} updated`);
}

async function main() {
  const uri = process.env.MONGODB_URL || "mongodb://localhost:27017/";
  await mongoose.connect(uri);
  mongoose.set("strictQuery", false);

  // Never log the URI itself — it carries credentials.
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
  if (DRY_RUN) console.log("DRY RUN — nothing will be written.\n");

  // Curricula first: programs and alternatives reference them by slug, and the
  // controller rejects a child whose parent does not exist.
  await upsert(Curriculums, "curricula", CURRICULA);
  await upsert(Programs, "programs", PROGRAMS);
  await upsert(Alternatives, "alternatives", ALTERNATIVES);

  const orphans = PROGRAMS.concat(ALTERNATIVES).filter(
    (r) => !CURRICULA.some((c) => c.slug === r.curriculumSlug)
  );
  if (orphans.length) {
    console.warn(`\nWARNING: ${orphans.length} record(s) reference a curriculum that is not seeded here:`);
    orphans.forEach((o) => console.warn(`  ${o.slug} -> ${o.curriculumSlug}`));
  }

  if (!DRY_RUN) {
    await Settings.findOneAndUpdate(
      { key: "roadmap" },
      { key: "roadmap", value: { anchor: ANCHOR } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  settings: anchor ${ANCHOR}`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
