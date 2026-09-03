/*
  GitHub repository catalog — the "breakdown" section on /project.

  Deliberately NOT stored in Mongo alongside `projectData`. The projects
  collection holds curated case studies (hero imagery, user flows, feature
  write-ups) and each document is hand-authored; this is a flat inventory of
  every public repo on the account, refreshed in bulk from the GitHub profile.
  Mixing the two would flood the showcase grid with 89 cards that have no
  case-study content behind them.

  `kind` mirrors GitHub's fork flag. Forks are labelled as reference/learning
  copies so the page never presents someone else's project as original work.
  `category` is an editorial grouping used for the breakdown counts and the
  filter chips — it is not a GitHub field. Reuse one of the eleven already in
  play rather than inventing a twelfth for one repo; the chip row is derived
  from whatever values appear here, so a one-off spawns a one-repo chip:

    AI & LLM apps · Backend & APIs · DevOps & Platform · Observability ·
    Frontend & UI · Mobile · Developer tools · Documentation · Learning & CS ·
    Testing & best practices · Products & experiments
*/

export const GITHUB_PROFILE = "https://github.com/HoseaCodes";

// Bump when the catalog is regenerated from the profile.
export const GITHUB_CATALOG_UPDATED = "September 3, 2026";

export const githubRepos = [
  /* ---------- original and collaborative ---------- */
  {
    name: "AI-Quiz-SDK",
    url: "https://github.com/HoseaCodes/AI-Quiz-SDK",
    language: "TypeScript",
    kind: "original",
    category: "AI & LLM apps",
    description:
      "Turns GitHub repositories into AI-generated quizzes so developers can learn a codebase's product behavior, architecture, and algorithms. Reduces token cost through selective ingestion, source-code compression, digest caching, and cost estimates while supporting user-controlled credentials.",
  },
  {
    name: "Email-Integrator",
    url: "https://github.com/HoseaCodes/Email-Integrator",
    language: "Java",
    kind: "original",
    category: "Backend & APIs",
    description:
      "Provides a Spring Boot service that applications can use to send email through a streamlined API, reducing the integration work required to add reliable outbound communication.",
  },
  {
    name: "PropFlow-API",
    url: "https://github.com/HoseaCodes/PropFlow-API",
    language: "Java",
    kind: "original",
    category: "Backend & APIs",
    description:
      "Provides a secure Spring Boot API for managing short-term-rental properties and financial ledgers, with stateless JWT authentication, fail-closed row-level ownership, database migrations, and extensive PostgreSQL-backed tests.",
  },
  {
    name: "Blog",
    url: "https://github.com/HoseaCodes/Blog",
    language: "JavaScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "Publishes my personal story, software-engineering articles, and technical walkthroughs through a React application built with JSX and hooks.",
  },
  {
    name: "ci-cd-pipeline-demo",
    url: "https://github.com/HoseaCodes/ci-cd-pipeline-demo",
    language: "Python",
    kind: "original",
    category: "DevOps & Platform",
    description:
      "Demonstrates a production-grade delivery pipeline around a small Python service, including reusable workflows, matrix testing, security scanning, automated releases, and gated staging-to-production promotion.",
  },
  {
    name: "CareerConnect",
    url: "https://github.com/HoseaCodes/CareerConnect",
    language: "EJS",
    kind: "original",
    category: "Backend & APIs",
    description:
      "Helps early-career software developers discover jobs, follow technology updates, and network with peers through an authenticated Node.js and MongoDB platform.",
  },
  {
    name: "DevCenter",
    url: "https://github.com/HoseaCodes/DevCenter",
    language: "Python",
    kind: "original",
    category: "Products & experiments",
    description:
      "A collaborative Django application that consolidates third-party services into one authenticated workspace, reducing the need for developers to keep many separate tools and browser tabs open.",
  },
  {
    name: "Hoseacodes",
    url: "https://github.com/HoseaCodes/Hoseacodes",
    language: null,
    kind: "original",
    category: "Documentation",
    description:
      "Powers my GitHub profile README and presents my platform-engineering focus, technical stack, and selected backend and infrastructure work.",
  },
  {
    name: "infra-demo",
    url: "https://github.com/HoseaCodes/infra-demo",
    language: "Java",
    kind: "original",
    category: "DevOps & Platform",
    description:
      "Shows how to ship a Spring Boot service with production-minded Docker, Kubernetes, Terraform, CI/CD, observability, autoscaling, and container-security practices.",
  },
  {
    name: "Storm-Gate",
    url: "https://github.com/HoseaCodes/Storm-Gate",
    language: "JavaScript",
    kind: "original",
    category: "Backend & APIs",
    description:
      "Provides a reusable Node.js authentication API deployed on AWS EC2, allowing applications to add secure identity workflows without rebuilding the same backend capability.",
  },
  {
    name: "Pure-css",
    url: "https://github.com/HoseaCodes/Pure-css",
    language: "CSS",
    kind: "original",
    category: "Frontend & UI",
    description:
      "Archives generative CSS compositions, geometric studies, and animations as reusable examples of what can be built without image assets or JavaScript-heavy rendering.",
  },
  {
    name: "rimae",
    url: "https://github.com/HoseaCodes/rimae",
    language: "HTML",
    kind: "original",
    category: "Observability",
    description:
      "Provides an append-only event-ingestion and exploration dashboard for searching, filtering, visualizing, and preserving the decisions and events that shape a project.",
  },
  {
    name: "SolidersOfWealthUI",
    url: "https://github.com/HoseaCodes/SolidersOfWealthUI",
    language: "JavaScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "Frontend codebase for the Soldiers of Wealth experience; the public repository currently provides limited documentation about its intended user workflow.",
  },
  {
    name: "javascript",
    url: "https://github.com/HoseaCodes/javascript",
    language: null,
    kind: "original",
    category: "Learning & CS",
    description:
      "A JavaScript learning and experimentation repository used to practice language concepts and retain reusable examples.",
  },
  {
    name: "SynapseAI",
    url: "https://github.com/HoseaCodes/SynapseAI",
    language: "Python",
    kind: "original",
    category: "AI & LLM apps",
    description:
      "Exposes multiple cost-aware AI capabilities — including summarization, extraction, analysis, Q&A, rewriting, and asynchronous jobs — through an AWS serverless API.",
  },
  {
    name: "ui-library",
    url: "https://github.com/HoseaCodes/ui-library",
    language: "JavaScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "Provides plug-and-play responsive UI components that help developers style web applications faster.",
  },
  {
    name: "callback",
    url: "https://github.com/HoseaCodes/callback",
    language: "HTML",
    kind: "original",
    category: "Mobile",
    description:
      "Implements a secure OAuth bridge between Vercel and React Native, handling browser authorization, server-side token exchange, deep linking, CSRF protection, and secure mobile token storage.",
  },
  {
    name: "MusicSync",
    url: "https://github.com/HoseaCodes/MusicSync",
    language: "Shell",
    kind: "original",
    category: "Products & experiments",
    description:
      "An experimental repository for synchronizing music-related data or workflows; the public repository currently has no explanatory README.",
  },
  {
    name: "PropFlow-UI",
    url: "https://github.com/HoseaCodes/PropFlow-UI",
    language: "TypeScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "Provides the Angular client for PropFlow, giving users a web interface for managing short-term-rental properties and the financial data exposed by the PropFlow API.",
  },
  {
    name: "LeakCheck",
    url: "https://github.com/HoseaCodes/LeakCheck",
    language: "TypeScript",
    kind: "original",
    category: "Developer tools",
    description:
      "A VS Code extension that identifies common React and React Native memory-leak patterns, explains the risk inline, and teaches safer cleanup practices through an optional quiz mode.",
  },
  {
    name: "PantryIQ",
    url: "https://github.com/HoseaCodes/PantryIQ",
    language: null,
    kind: "original",
    category: "Products & experiments",
    description:
      "Designs a smart grocery-planning experience that connects shared lists with inventory, pricing, budgeting, substitutions, meal planning, and cart handoff.",
  },
  {
    name: "wingman-app",
    url: "https://github.com/HoseaCodes/wingman-app",
    language: "JavaScript",
    kind: "original",
    category: "Mobile",
    description:
      "Provides a React Native and Firebase foundation with authentication, navigation, shared auth state, and configured cloud services for building a mobile application.",
  },
  {
    name: "GameCenter",
    url: "https://github.com/HoseaCodes/GameCenter",
    language: "JavaScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "Offers a modular React micro-frontend for independently developing, deploying, and integrating browser games while sharing assets, navigation, and persistent high scores.",
  },
  {
    name: "DevOpsLab",
    url: "https://github.com/HoseaCodes/DevOpsLab",
    language: null,
    kind: "original",
    category: "DevOps & Platform",
    description:
      "Documents a low-cost local environment for practicing containers, infrastructure as code, CI/CD, configuration management, Kubernetes, networking, and operational troubleshooting.",
  },
  {
    name: "Networking",
    url: "https://github.com/HoseaCodes/Networking",
    language: null,
    kind: "original",
    category: "Documentation",
    description:
      "Provides a reusable MkDocs documentation-site structure with organized guides, API-reference pages, customization assets, and automated deployment.",
  },
  {
    name: "MkDocs",
    url: "https://github.com/HoseaCodes/MkDocs",
    language: null,
    kind: "original",
    category: "Documentation",
    description:
      "Provides a starter template for building, customizing, and automatically publishing structured technical documentation with MkDocs.",
  },
  {
    name: "TaxDocs",
    url: "https://github.com/HoseaCodes/TaxDocs",
    language: null,
    kind: "original",
    category: "Documentation",
    description:
      "Organizes technical and setup documentation for a tax-related project using a versionable MkDocs documentation site.",
  },
  {
    name: "Portfolio",
    url: "https://github.com/HoseaCodes/Portfolio",
    language: "EJS",
    kind: "original",
    category: "Backend & APIs",
    description:
      "A Node.js backend that uses the MVC design pattern to serve my portfolio site.",
  },
  {
    name: "next-saas-template",
    url: "https://github.com/HoseaCodes/next-saas-template",
    language: "TypeScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "A Next.js SaaS starter wired up with Clerk authentication, Stripe billing, and Prisma.",
  },
  {
    name: "EngineeringJournal",
    url: "https://github.com/HoseaCodes/EngineeringJournal",
    language: null,
    kind: "original",
    category: "Documentation",
    description:
      "A repository intended to capture engineering notes, decisions, lessons, and progress; its public version currently has no explanatory README.",
  },
  {
    name: "POC-Teller",
    url: "https://github.com/HoseaCodes/POC-Teller",
    language: "JavaScript",
    kind: "original",
    category: "Products & experiments",
    description:
      "A proof-of-concept JavaScript repository for exploring the Teller integration or product workflow; the public repository currently contains minimal documentation.",
  },
  {
    name: "365DaysOfHomeLab",
    url: "https://github.com/HoseaCodes/365DaysOfHomeLab",
    language: null,
    kind: "original",
    category: "DevOps & Platform",
    description:
      "Turns homelab learning into a structured year-long challenge covering servers, storage, networking, virtualization, automation, self-hosting, and troubleshooting.",
  },
  {
    name: "PHUT",
    url: "https://github.com/HoseaCodes/PHUT",
    language: "JavaScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "A Next.js application scaffold for developing and deploying the PHUT web experience; the public README currently documents the framework setup rather than the product problem.",
  },
  {
    name: "OnePercent",
    url: "https://github.com/HoseaCodes/OnePercent",
    language: "JavaScript",
    kind: "original",
    category: "Learning & CS",
    description:
      "A comprehensive guide for achieving mastery across multiple disciplines through structured, strategic learning paths.",
  },
  {
    name: "Python-Tech_Bot",
    url: "https://github.com/HoseaCodes/Python-Tech_Bot",
    language: "Python",
    kind: "original",
    category: "DevOps & Platform",
    description:
      "Demonstrates how to package and deploy a Python AWS Lambda function and reusable dependency layer using Terraform.",
  },
  {
    name: "AC-Templates",
    url: "https://github.com/HoseaCodes/AC-Templates",
    language: null,
    kind: "original",
    category: "Developer tools",
    description:
      "A collection intended to centralize reusable Ambitious Concepts project templates; the public repository currently has no explanatory README.",
  },
  {
    name: "Wingman",
    url: "https://github.com/HoseaCodes/Wingman",
    language: "JavaScript",
    kind: "original",
    category: "Mobile",
    description:
      "A JavaScript project scaffold that provides a conventional repository structure and documentation template for developing the Wingman application.",
  },
  {
    name: "PDF-Master",
    url: "https://github.com/HoseaCodes/PDF-Master",
    language: "JavaScript",
    kind: "original",
    category: "AI & LLM apps",
    description:
      "Lets users upload, store, view, hear, summarize, question, and generate quizzes from PDF documents through a Next.js application backed by MongoDB, AWS S3, and AI services.",
  },
  {
    name: "insightlytics",
    url: "https://github.com/HoseaCodes/insightlytics",
    language: "JavaScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "A Next.js application scaffold for an analytics-oriented product; the public README currently documents framework setup rather than the product workflow.",
  },
  {
    name: "BudgetApp",
    url: "https://github.com/HoseaCodes/BudgetApp",
    language: "JavaScript",
    kind: "original",
    category: "Mobile",
    description:
      "A React Native finance application foundation that emphasizes a layered testing strategy across static analysis, unit, integration, component, and end-to-end tests.",
  },
  {
    name: "StripeConnectPOC",
    url: "https://github.com/HoseaCodes/StripeConnectPOC",
    language: "JavaScript",
    kind: "original",
    category: "Products & experiments",
    description:
      "A proof of concept for evaluating Stripe Connect payment onboarding and money-movement workflows; the public repository currently has no explanatory README.",
  },
  {
    name: "LuminaryApp",
    url: "https://github.com/HoseaCodes/LuminaryApp",
    language: null,
    kind: "original",
    category: "Products & experiments",
    description:
      "A client application associated with the Luminary payments platform; the public repository currently has no explanatory README.",
  },
  {
    name: "Mune-UI",
    url: "https://github.com/HoseaCodes/Mune-UI",
    language: "TypeScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "The TypeScript user-interface repository for the Mun-E application; the current public documentation is minimal.",
  },
  {
    name: "UI-Heat",
    url: "https://github.com/HoseaCodes/UI-Heat",
    language: "JavaScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "Provides a reusable JavaScript component library for building polished, responsive interfaces more quickly.",
  },
  {
    name: "Forester",
    url: "https://github.com/HoseaCodes/Forester",
    language: "JavaScript",
    kind: "original",
    category: "Observability",
    description:
      "Centralizes application logs, errors, and performance signals so developers can diagnose failures faster across frontend and backend systems.",
  },
  {
    name: "HyroxSocialClub",
    url: "https://github.com/HoseaCodes/HyroxSocialClub",
    language: "Swift",
    kind: "original",
    category: "Mobile",
    description:
      "A Swift application for helping HYROX athletes plan training, log workouts, monitor progress, and engage with a fitness community.",
  },
  {
    name: "ReadMe-Teamplate",
    url: "https://github.com/HoseaCodes/ReadMe-Teamplate",
    language: null,
    kind: "original",
    category: "Developer tools",
    description:
      "Provides a standardized README template that helps project maintainers consistently explain purpose, setup, usage, and contribution expectations.",
  },
  {
    name: "WriteBrain",
    url: "https://github.com/HoseaCodes/WriteBrain",
    language: null,
    kind: "original",
    category: "AI & LLM apps",
    description:
      "A project intended to support structured writing or idea development; the public repository currently has no explanatory README.",
  },
  {
    name: "Luminary",
    url: "https://github.com/HoseaCodes/Luminary",
    language: null,
    kind: "original",
    category: "Products & experiments",
    description:
      "Explores online payment-processing and commerce workflows in a reusable application codebase.",
  },
  {
    name: "Woodsman",
    url: "https://github.com/HoseaCodes/Woodsman",
    language: "TypeScript",
    kind: "original",
    category: "Observability",
    description:
      "Provides a TypeScript interface for viewing and investigating application logs.",
  },
  {
    name: "Kid",
    url: "https://github.com/HoseaCodes/Kid",
    language: "JavaScript",
    kind: "original",
    category: "Products & experiments",
    description:
      "Creates a child-focused online environment for safe educational activities and age-appropriate entertainment.",
  },
  {
    name: "Log-Pruner",
    url: "https://github.com/HoseaCodes/Log-Pruner",
    language: "JavaScript",
    kind: "original",
    category: "DevOps & Platform",
    description:
      "Implements a scheduled GitHub Action that removes database documents older than seven days, automating retention and reducing stale storage.",
  },
  {
    name: "Ecommerce-Site",
    url: "https://github.com/HoseaCodes/Ecommerce-Site",
    language: "JavaScript",
    kind: "original",
    category: "Frontend & UI",
    description:
      "Provides a full-stack JavaScript e-commerce and content experience for presenting products and supporting online shopping workflows.",
  },
  {
    name: "Calorie-Kitchen",
    url: "https://github.com/HoseaCodes/Calorie-Kitchen",
    language: "HTML",
    kind: "original",
    category: "Backend & APIs",
    description:
      "Aggregates recipes, cooking videos, and food-related content in a Node.js application with RESTful routes and server-rendered EJS views.",
  },
  {
    name: "Sneaker-Api",
    url: "https://github.com/HoseaCodes/Sneaker-Api",
    language: "EJS",
    kind: "original",
    category: "Backend & APIs",
    description:
      "Provides accessible JSON sneaker data — including descriptions, images, prices, and release dates — through a Node.js, Express, and MongoDB REST API.",
  },
  {
    name: "DSA",
    url: "https://github.com/HoseaCodes/DSA",
    language: "JavaScript",
    kind: "original",
    category: "Learning & CS",
    description:
      "Serves as a hands-on playground for practicing data structures, algorithms, and interview-style problem solving across programming languages.",
  },
  {
    name: "Application-Monitoring",
    url: "https://github.com/HoseaCodes/Application-Monitoring",
    language: null,
    kind: "original",
    category: "Observability",
    description:
      "Maintains an operational inventory of applications and tracks their CI/CD, testing, logging, alerting, environments, API documentation, and deployment readiness.",
  },
  {
    name: "Leetcode",
    url: "https://github.com/HoseaCodes/Leetcode",
    language: "HTML",
    kind: "original",
    category: "Learning & CS",
    description:
      "Organizes LeetCode study material and provides a locally runnable and publishable site for reviewing problem-solving practice.",
  },
  {
    name: "Bash-Commands",
    url: "https://github.com/HoseaCodes/Bash-Commands",
    language: null,
    kind: "original",
    category: "Learning & CS",
    description:
      "Provides beginner-friendly Bash notes, examples, and links that make common terminal commands easier to learn and reference.",
  },
  {
    name: "Ecommerce-Backend-Template",
    url: "https://github.com/HoseaCodes/Ecommerce-Backend-Template",
    language: "JavaScript",
    kind: "original",
    category: "Backend & APIs",
    description:
      "Provides a reusable JavaScript e-commerce foundation with MongoDB, token-based authentication, Cloudinary media storage, and PayPal configuration.",
  },

  /* ---------- forks and reference copies ---------- */
  {
    name: "ui-testing-best-practices",
    url: "https://github.com/HoseaCodes/ui-testing-best-practices",
    language: null,
    kind: "fork",
    category: "Testing & best practices",
    description:
      "Reference fork: a comprehensive UI testing best-practices list (last updated May 2021).",
  },
  {
    name: "computer-science-flash-cards",
    url: "https://github.com/HoseaCodes/computer-science-flash-cards",
    language: "HTML",
    kind: "fork",
    category: "Learning & CS",
    description:
      "Reference fork: a mini site for testing general CS knowledge and drilling coding practice and common algorithm and data-structure recall.",
  },
  {
    name: "coding-interview-university",
    url: "https://github.com/HoseaCodes/coding-interview-university",
    language: null,
    kind: "fork",
    category: "Learning & CS",
    description:
      "Reference fork: a complete computer-science study plan for becoming a software engineer.",
  },
  {
    name: "nodejs-integration-tests-best-practices",
    url: "https://github.com/HoseaCodes/nodejs-integration-tests-best-practices",
    language: "JavaScript",
    kind: "fork",
    category: "Testing & best practices",
    description:
      "Reference fork: beyond the basics of Node.js testing, including a best-practices list and an example app (April 2022).",
  },
  {
    name: "javascript-testing-best-practices",
    url: "https://github.com/HoseaCodes/javascript-testing-best-practices",
    language: "JavaScript",
    kind: "fork",
    category: "Testing & best practices",
    description:
      "Reference fork: comprehensive JavaScript and Node.js testing best practices (December 2022).",
  },
  {
    name: "heroku-google-application-credentials-buildpack",
    url: "https://github.com/HoseaCodes/heroku-google-application-credentials-buildpack",
    language: "Shell",
    kind: "fork",
    category: "DevOps & Platform",
    description:
      "Reference fork: generates a Google credential file based on an environment variable.",
  },
  {
    name: "greenbook-app",
    url: "https://github.com/HoseaCodes/greenbook-app",
    language: "JavaScript",
    kind: "fork",
    category: "Mobile",
    description:
      "Reference fork of the Spicy Green Book mobile and responsive web application, which helps users discover and support local Black-owned businesses.",
  },
  {
    name: "merge-immersive",
    url: "https://github.com/HoseaCodes/merge-immersive",
    language: "JavaScript",
    kind: "fork",
    category: "Products & experiments",
    description:
      "A collaborative MERN application that helps coding-bootcamp students discover classmates, view portfolios, and build professional connections.",
  },
  {
    name: "idurar-erp-crm",
    url: "https://github.com/HoseaCodes/idurar-erp-crm",
    language: null,
    kind: "fork",
    category: "Products & experiments",
    description:
      "Reference fork: open-source headless ERP, CRM, e-commerce, and accounting software built with Node.js and React.",
  },
  {
    name: "stitch-skills",
    url: "https://github.com/HoseaCodes/stitch-skills",
    language: null,
    kind: "fork",
    category: "Developer tools",
    description:
      "Reference fork: a library of Agent Skills for the Stitch MCP server, following the Agent Skills open standard for compatibility with coding agents.",
  },
  {
    name: "ui-ux-pro-max-skill",
    url: "https://github.com/HoseaCodes/ui-ux-pro-max-skill",
    language: null,
    kind: "fork",
    category: "Developer tools",
    description:
      "Reference fork: an AI skill that provides design intelligence for building professional UI/UX across multiple platforms.",
  },
  {
    name: "SDE-Interview-and-Prep-Roadmap",
    url: "https://github.com/HoseaCodes/SDE-Interview-and-Prep-Roadmap",
    language: null,
    kind: "fork",
    category: "Learning & CS",
    description:
      "Reference fork: a collaborative software-engineering interview preparation roadmap and checklist.",
  },
  {
    name: "ddia-references",
    url: "https://github.com/HoseaCodes/ddia-references",
    language: null,
    kind: "fork",
    category: "Learning & CS",
    description:
      "Reference fork: literature references for Designing Data-Intensive Applications.",
  },
  {
    name: "airbnbJavascript",
    url: "https://github.com/HoseaCodes/airbnbJavascript",
    language: null,
    kind: "fork",
    category: "Testing & best practices",
    description: "Reference fork: the Airbnb JavaScript style guide.",
  },
  {
    name: "jellyfin-web",
    url: "https://github.com/HoseaCodes/jellyfin-web",
    language: null,
    kind: "fork",
    category: "Products & experiments",
    description:
      "Reference fork: the official web client for the Jellyfin free software media system.",
  },
  {
    name: "jellyfin",
    url: "https://github.com/HoseaCodes/jellyfin",
    language: null,
    kind: "fork",
    category: "Products & experiments",
    description:
      "Reference fork: the Jellyfin free software media system server backend and API.",
  },
  {
    name: "Health-Checker-Dashboard",
    url: "https://github.com/HoseaCodes/Health-Checker-Dashboard",
    language: "JavaScript",
    kind: "fork",
    category: "Observability",
    description:
      "Visualizes the availability of backend services in a single Node.js dashboard so teams can quickly identify unhealthy dependencies.",
  },
  {
    name: "aws-mobile-react-native-starter",
    url: "https://github.com/HoseaCodes/aws-mobile-react-native-starter",
    language: null,
    kind: "fork",
    category: "Mobile",
    description: "Reference fork: the AWS Mobile React Native starter app.",
  },
  {
    name: "DevOps-Projects",
    url: "https://github.com/HoseaCodes/DevOps-Projects",
    language: null,
    kind: "fork",
    category: "DevOps & Platform",
    description:
      "Reference fork: beginner-friendly DevOps projects for automating work using DevOps concepts.",
  },
  {
    name: "Data-Structures-and-Algorithms",
    url: "https://github.com/HoseaCodes/Data-Structures-and-Algorithms",
    language: null,
    kind: "fork",
    category: "Learning & CS",
    description:
      "Reference fork: an open-source collection of data-structure and algorithm concepts, implementations, practice problems, and interview questions.",
  },
  {
    name: "People-You-Should-Follow-on-CodePen",
    url: "https://github.com/HoseaCodes/People-You-Should-Follow-on-CodePen",
    language: null,
    kind: "fork",
    category: "Learning & CS",
    description: "Reference fork: a curated list of people to follow on CodePen.",
  },
  {
    name: "CareerExtract-API",
    url: "https://github.com/HoseaCodes/CareerExtract-API",
    language: "Python",
    kind: "fork",
    category: "Backend & APIs",
    description:
      "Extracts job-description content from a user-supplied LinkedIn job URL, giving other tools structured data for job analysis and application workflows.",
  },
  {
    name: "react-resume",
    url: "https://github.com/HoseaCodes/react-resume",
    language: "JavaScript",
    kind: "fork",
    category: "Frontend & UI",
    description: "Reference fork: a resume builder written in React.",
  },
  {
    name: "health-check",
    url: "https://github.com/HoseaCodes/health-check",
    language: null,
    kind: "fork",
    category: "Observability",
    description: "Reference fork: a health-check single-page application.",
  },
  {
    name: "SwiftUI-Cookbook-2nd-Edition",
    url: "https://github.com/HoseaCodes/SwiftUI-Cookbook-2nd-Edition",
    language: null,
    kind: "fork",
    category: "Learning & CS",
    description:
      "Reference fork: the SwiftUI Cookbook (2nd edition), published by Packt.",
  },
  {
    name: "nodebestpractices",
    url: "https://github.com/HoseaCodes/nodebestpractices",
    language: null,
    kind: "fork",
    category: "Testing & best practices",
    description: "Reference fork: the Node.js best-practices list (November 2022).",
  },
  {
    name: "nodejs-security-best-practices",
    url: "https://github.com/HoseaCodes/nodejs-security-best-practices",
    language: null,
    kind: "fork",
    category: "Testing & best practices",
    description: "Reference fork: how to create a secured Node.js application.",
  },
  {
    name: "javascript-algorithms",
    url: "https://github.com/HoseaCodes/javascript-algorithms",
    language: null,
    kind: "fork",
    category: "Learning & CS",
    description:
      "Reference fork: algorithms and data structures implemented in JavaScript with explanations and links to further reading.",
  },
  {
    name: "Team-Git-Workflow-Practice",
    url: "https://github.com/HoseaCodes/Team-Git-Workflow-Practice",
    language: "HTML",
    kind: "fork",
    category: "Learning & CS",
    description:
      "Reference fork used to practice collaborative Git workflows such as branching, commits, merges, and pull requests.",
  },
];

/*
  Account-wide totals, computed once at module load. Both the /project card and
  the breakdown page read these, so the two can't drift out of sync — the card
  claiming 89 repos while the page counts 90.

  `UNKNOWN_LANGUAGE` is the bucket for repos GitHub reports no primary language
  for. It sorts last regardless of size: it's a catch-all, not a language.
*/
export const UNKNOWN_LANGUAGE = "Other";

export const githubStats = (() => {
  const byLanguage = new Map();

  githubRepos.forEach((repo) => {
    const lang = repo.language || UNKNOWN_LANGUAGE;
    byLanguage.set(lang, (byLanguage.get(lang) || 0) + 1);
  });

  return {
    total: githubRepos.length,
    original: githubRepos.filter((r) => r.kind === "original").length,
    forks: githubRepos.filter((r) => r.kind === "fork").length,
    languages: [...byLanguage.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => {
        if (a.name === UNKNOWN_LANGUAGE) return 1;
        if (b.name === UNKNOWN_LANGUAGE) return -1;
        return b.count - a.count || a.name.localeCompare(b.name);
      }),
  };
})();
