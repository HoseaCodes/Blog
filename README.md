# [HoseaCodes-Blog](http://www.hoseacodes.com/)

## Created by: Dominique Hosea

### September 2020

Welcome, to my personal blog and portfolio. Sharing information is vital and especially in the dev commnunity. The blog showcases my latest works, testomines, articles, about me section, and contact me section. It mainly focuses on my current and most recent accomplishments.

[![NPM Version 7.6.3][npm-image]][npm-url]

### Homepage

![Homepage](https://i.imgur.com/5k3N3ex.png)

### Blog Page

![Article Page](https://i.imgur.com/PeDkdtv.png)

## Getting Started

The user is brought to the home page where they can navigate to my [portfolio](www.dominiquehosea.com), my blog posts, my about me, or contact page. The home page is an introduction to who I am. The is a brief history of my experience with the option to download my resume. Additionally, I have the technologies that I am currently using, a project showcase, an embbed [Twitter](https://twitter.com/DominiqueRHosea) widget, and testimonies.


## Game Zone

What should I display here? The concept I was going for was like a main game center for my technical command center. Something like mini-games but with my own spin. I wanted users to have the ability to sign up and based off playing the high score, unlocks things on the website and allows you to buy things. The scores/points earned are more like crypto tokens. Also, during extended loading times, they have the ability to play the games to collect points.

### Core Mini-Games for Your Technical Command Center

1. Code Runner - Typing Speed Challenge

```jsx
// A coding-themed typing game where users type code snippets
// Points based on WPM + accuracy
// Unlocks: Advanced code templates, faster deployment tools
```
1. Load Balancer - Resource Management

```jsx
// Distribute incoming requests across servers
// Players drag/drop requests to prevent server overload
// Points for efficiency and uptime
// Unlocks: Infrastructure monitoring tools, deployment credits
``` 
1. Memory Leak Hunter - Pattern Matching

```jsx
// Find and fix memory issues in visual code blocks
// Similar to matching games but with technical concepts
// Points for speed and accuracy
// Unlocks: Debugging tools, performance insights
```

1. API Tetris - System Architecture

```jsx
// Stack API components to build microservices
// Different shapes = different services (auth, database, cache)
// Points for clean architecture and completed systems
// Unlocks: Architecture templates, service blueprints
``` 

1. Crypto Miner - Simple Clicker Game

```jsx
// Perfect for loading screens - just click to mine tokens
// Minimal interaction required
// Steady point accumulation
// Unlocks: Token multipliers, auto-mining tools
```
## Terminal Features

The website includes an interactive terminal that you can use to navigate and learn more about me. Here's how to use it:

### Opening the Terminal

- Press Cmd + h to toggle the terminal open/closed
- You can also close it by clicking the × button in the top right corner or pressing Escape

### Available Commands

- help - Lists all available commands
- about - Displays information about me
- cat - Opens a random cat picture in a new tab
- echo <text> - Prints the given text to the console
- twitter - Opens my Twitter profile
- github - Opens my GitHub profile
- linkedin - Opens my LinkedIn profile
- languages - Shows programming languages I know and proficiency levels
- skills - Displays my technical skills and proficiency levels
- projects - Lists notable projects I've worked on
- editor - Shows details about my current code editor setup
- spotify - Displays my currently playing or recently played song on Spotify
- clear - Clears the terminal screen
- cd <directory> - Change directory
- ls - List contents of current directory
- mkdir <name> - Create a new directory

Try typing help first to see all available commands!

## Architecture

This application uses a dual-backend microservices architecture:

```
Frontend (React on :3000)
    ↓ (JWT token)
Blog Backend (Express on localhost:3001 / Fly.io)
    ↓ MongoDB Atlas
    ↓ (validates token, handles blog/media/AI features)
    ↓
Auth Backend (Express on localhost:8080 / AWS Lambda)
    ↓ MongoDB Atlas
    ↓ (issues tokens, handles authentication)
```

**Authentication Flow:**
1. User logs in via Auth Backend (:8080 / AWS)
2. Auth Backend issues JWT token signed with `ACCESS_TOKEN_SECRET`
3. Frontend stores token in cookies
4. All blog operations use same token with Blog Backend (:3001 / Fly.io)
5. Both backends share the same `ACCESS_TOKEN_SECRET` for token validation

**Why Dual Backend?**
- **Separation of Concerns**: Auth logic isolated from business logic
- **Scalability**: Each backend can scale independently
- **Security**: Auth backend can have stricter security policies
- **Deployment Flexibility**: Auth on AWS Lambda, Blog on Fly.io

## Technologies Used

This application was developed with a full MERN stack and written in JavaScript. Styling done with Bootstrap, Material UI, SASS/SCSS and CSS.

**M** - MongoDB, NoSQL database (MongoDB Atlas)  
**E** - Express, a back-end framework (dual backends)  
**R** - React, a client side framework  
**N** - NodeJS - to run back end services

### Backend Services

**Blog Backend (localhost:3001 / Fly.io)**
- Article CRUD operations
- Enterprise blog features (drafts, scheduling, versioning)
- Media management (Cloudinary integration)
- AI content assistance (OpenAI integration)
- SEO analysis
- Analytics tracking

**Auth Backend (localhost:8080 / AWS Lambda)**
- User authentication & authorization
- JWT token generation
- User management
- Role-based access control

### Key Dependencies

- Morgan - HTTP request logger middleware for node.js
- Axios - Promise based HTTP client for the browser and node.js
- Bcrypt - A library to hash passwords
- JWT - JSON Web Token for authentication
- Mongoose - for MongoDB validation
- React-Bootstrap - a React library for building pre-styled components
- Material UI - a library for building pre-styled components
- SASS - a preprocessor scripting language that is interpreted or compiled into Cascading Style Sheets
- Cloudinary - Media upload and management
- OpenAI - AI-powered content generation

## Features

✅ Own your content

✅ Write using Markdown On Github Issues

✅ Syntax/Code Highlighting

✅ Fully customizable

✅ Tags - Topics

✅ Links

✅ Reactions

✅ View Comments

✅ Images

✅ Minutes Read

✅ Beautiful UI Like Medium

✅ Easy deployment: Using Github Pages

✅ Instant Effects on Blog when changing github issues

✅ Beautiful blockquote

## Frontend

See [wiki](https://github.com/HoseaCodes/Blog/wiki/Frontend) for details.

## Data

See [wiki](https://github.com/HoseaCodes/Blog/wiki/Data) for details.

## Backend

### Dual Backend Architecture

This project uses two Express backends for separation of concerns:

#### 1. Blog Backend (Port 3001 / Fly.io)
**Responsibilities:**
- Article management (drafts, published, scheduled)
- Enterprise blog features (auto-save, versioning, collaboration)
- Media library (Cloudinary uploads)
- AI content generation (OpenAI integration)
- SEO analysis and optimization
- Analytics tracking
- Comment management

**Endpoints:**
```
/api/blog/*         - Article CRUD operations
/api/media/*        - Media upload and management
/api/ai/*           - AI content assistance
/api/seo/*          - SEO analysis and suggestions
/api/analytics/*    - Performance metrics
/api/collaboration/* - Reviews and team collaboration
```

## API Reference Quick Links

- **BlogAPI**: Draft management, publishing, scheduling
- **MediaAPI**: File uploads, media library
- **AIAPI**: Content generation, improvement, translation
- **SEOAPI**: SEO analysis, keyword research
- **AnalyticsAPI**: Performance tracking, metrics
- **CollaborationAPI**: Reviews, sharing, co-authoring


#### 2. Auth Backend (Port 8080 / AWS Lambda)
**Responsibilities:**
- User authentication (login/register)
- JWT token generation and refresh
- User profile management
- Role-based access control (admin, author, basic)
- User status management (pending, approved)

**Endpoints:**
```
/api/user/login      - User login
/api/user/register   - User registration
/api/user/refresh_token - Refresh JWT token
/api/user/logout     - User logout
/me                  - Get current user info
```

## 🎯 Key Features Implemented

### 1. Draft Management
- Auto-save functionality
- Draft listing and management
- Quick publish/schedule workflows
- Batch operations

### 2. Publishing Workflow
- One-click publishing
- Scheduled publishing with date/time
- Unpublish and archive options
- Version history (structure in place)

### 3. AI-Powered Content Assistance
- Content generation from prompts
- Content improvement (grammar, clarity, engagement)
- Title suggestions (5+ options)
- Outline generation
- Content expansion/summarization
- Translation support
- Social media post generation
- Grammar checking
- Meta tag generation
- Key point extraction

### 4. Media Management
- File upload with progress tracking
- Media library integration
- Cloudinary integration maintained
- Image optimization
- Folder organization
- Search functionality

### 5. SEO Optimization
- Real-time SEO scoring
- Readability analysis (Flesch Reading Ease)
- Keyword density analysis
- Meta description generation
- Title optimization suggestions
- Link structure analysis
- Structured data generation (Schema.org)

### 6. Analytics & Tracking
- View tracking
- Engagement metrics
- Performance dashboard data
- Top articles reporting
- Real-time statistics
- Export functionality

### 7. Collaboration Features (Structure)
- Review request system
- Collaborator management
- Inline commenting (placeholder)
- Activity feed (placeholder)
- Share tracking

---

## 📊 API Methods Available

### BlogAPI (10 methods)
- saveDraft(articleData)
- publishArticle(id, data)
- scheduleArticle(id, data)
- getVersionHistory(id)
- restoreVersion(articleId, versionId)
- duplicateArticle(id)
- archiveArticle(id)
- batchPublish(ids)
- batchDelete(ids)

### MediaAPI (8 methods)
- uploadFile(file, folder)
- uploadMultipleFiles(files, folder)
- deleteMedia(publicId)
- updateMediaMetadata(publicId, metadata)
- searchMedia(query)
- createFolder(name)
- getMediaStats()

### AIAPI (13 methods)
- generateContent(prompt, options)
- improveContent(content, type)
- generateTitles(content, count)
- generateOutline(topic, depth)
- expandContent(content, length)
- summarizeContent(content, length)
- translateContent(content, language)
- generateSocialPosts(content, platforms)
- checkGrammar(content)
- getStyleSuggestions(content, style)
- generateMetaTags(content)
- extractKeyPoints(content, count)
- generateCTA(context, goal)

### SEOAPI (12 methods)
- analyzeSEO(articleData)
- getKeywordSuggestions(topic, lang)
- analyzeKeywordDensity(content, keywords)
- checkReadability(content)
- generateMetaDescription(content, length)
- generateTitleSuggestions(content, keywords)
- checkDuplicateContent(content)
- analyzeCompetitors(keyword, competitors)
- generateStructuredData(articleData)
- analyzeLinkStructure(content)
- getTrendingTopics(category)
- optimizeImageSEO(url, alt, context)

### AnalyticsAPI (10 methods)
- trackView(articleId, metadata)
- trackEngagement(articleId, eventType, data)
- getArticleStats(articleId)
- getTopArticles(limit)
- getReaderDemographics(articleId)
- getTrafficSources(articleId)
- getEngagementMetrics(articleId)
- getConversionMetrics()
- getRealTimeStats()
- exportAnalytics(format)

### CollaborationAPI (10 methods)
- requestReview(articleId, reviewerIds, message)
- submitReview(reviewId, feedback, approved)
- addCollaborator(articleId, userId, role)
- removeCollaborator(articleId, userId)
- getCollaborators(articleId)
- shareArticle(articleId, shareData)
- getShareAnalytics(articleId)
- addInlineComment(articleId, commentData)
- resolveInlineComment(commentId)
- getActivityFeed(articleId)

---


### Security

#### Shared Secret Architecture

Both backends use the **same `ACCESS_TOKEN_SECRET`** to enable single-token authentication:

```javascript
// Auth Backend (AWS) - Issues token
const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '1d' }
);

// Blog Backend (Fly.io) - Validates same token
jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  if (err) return res.status(401).json({ msg: 'Invalid token' });
  req.user = user;
  next();
});
```

#### JWT Authentication Flow

![Security](https://i.imgur.com/ZD1gtVH.png)

![JWT](https://i.imgur.com/lFIJa0b.png)

1. User submits credentials to Auth Backend (:8080)
2. Auth Backend validates and returns JWT token
3. Frontend stores token in httpOnly cookie
4. All subsequent requests include token in `Authorization` header
5. Both backends validate token with shared secret
6. Token expires after 24 hours, refresh token extends session

See [wiki](https://github.com/HoseaCodes/Blog/wiki/Backend) for details.

## Dev Ops

### Pipelines

| Job Name                                              | Use Case    |
| ----------------------------------------------------- | ----------- |
| Static-Scan                                           | Static application security testing (SAST) or static code analysis, analyzes source code to find security vulnerabilities that make the organization's applications susceptible to attack.   |
| Dependency-Scan                                       | Dependency scanning generates an alert for any open-source component, direct or transitive, found to be vulnerable that the code depends upon.   |
| Lint-Scan                                             | Lint scans source code for errors and potential issues that could lead to bugs, vulnerabilities, and other problems.   |
| Build                                                 |   Build and deploying the project.          |

See [wiki](https://github.com/HoseaCodes/Blog/wiki/Dev-Ops) for details.

## 3rd Party Packages

| Name                                                  | Use Case    |
| ----------------------------------------------------- | ----------- |
| [AOS](https://www.markdownguide.org/extended-syntax/) | Animation   |
| [Axios](https://www.npmjs.com/package/axios)          | HTTP client |
| bcrypt                                                |             |
| dompurify                                             |             |
| framer-motion                                         |             |
| imagemin                                              |             |
| markdown                                              |             |
| marked                                                |             |
| moment                                                |             |
| morgan                                                |             |
| node-cache                                            |             |
| node-sass                                             |             |
| react-bootstrap                                       |             |
| react-bootstrap                                       |             |
| react-icons                                           |             |
| react-masonry-css                                     |             |
| react-sticky-state                                    |             |
| react-twitter-widgets                                 |             |
| source-map-explorer                                   |             |
| styled-components                                     |             |
| winston                                               |             |

## External APIs

See [wiki](https://github.com/HoseaCodes/Blog/wiki/External-APIs) for details.

## How To Run App

### Prerequisites

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env
# Edit .env with your:
# - MONGODB_URL
# - ACCESS_TOKEN_SECRET (must match Auth Backend!)
# - CLOUDINARY credentials
# - OPENAI_API_KEY
```

### Development (Local)

**Terminal 1 - Blog Backend:**
```bash
# Runs on localhost:3001
nodemon ./server.js
```

**Terminal 2 - Frontend:**
```bash
# Runs on localhost:3000
npm start
```

**Terminal 3 - Auth Backend (if running locally):**
```bash
# Runs on localhost:8080
cd /path/to/auth-backend
nodemon server.js
```

**Note:** Auth backend can also run on AWS Lambda. Set `REACT_APP_API_BASE_URL` in `.env` to point to AWS endpoint in production.

### Docker

Build image locally:

```bash
docker build -t hoseacodes-blog .  
```

Run local image in container:

```bash
docker run --name hoseacodes-blog-c -p 3001:3001 \
  -e MONGODB_URL="your_mongodb_url" \
  -e ACCESS_TOKEN_SECRET="your_secret" \
  -d hoseacodes-blog
```

Tag Image for push:

```bash
docker tag ${imageID} hoseacodes/hoseacodes-blog:latest
```

Push Docker Image:

```bash
docker push hoseacodes/hoseacodes-blog:latest    
```

## How To Deploy App

### Deploy Blog Backend to Fly.io

```bash
# First time setup
fly launch

# Set secrets (IMPORTANT: Use same ACCESS_TOKEN_SECRET as Auth Backend!)
fly secrets set ACCESS_TOKEN_SECRET=your_secret
fly secrets set MONGODB_URL=your_mongodb_url
fly secrets set CLOUDINARY_CLOUD_NAME=your_cloudinary_name
fly secrets set CLOUDINARY_API_KEY=your_cloudinary_key
fly secrets set CLOUDINARY_API_SECRET=your_cloudinary_secret
fly secrets set OPENAI_API_KEY=your_openai_key

# Deploy
fly deploy

# Check status
fly status

# View logs
fly logs
```

### Deploy Auth Backend to AWS Lambda

Auth backend is deployed separately to AWS Lambda via API Gateway. Ensure Lambda environment variables match:

```bash
ACCESS_TOKEN_SECRET=<same_as_flyio_backend>
MONGODB_URL=<your_mongodb_atlas_url>
```

## How To Restart App

**Fly.io:**
```bash
fly restart -a hoseacodes-blog
```

**Check health:**
```bash
fly checks list
fly logs
```

## Unsolved Problems

- [ ] Fix Docker Image

## Future Enhancements

- User login with the ability to add comments and like post.
- Routing for 404
- Case Studies
  - Add Calorie Kicthen, Sneaker-API, Ecommerce-Site, Ecommerce-Backend-Template, React-Crypto, Cypto-Learn, CareerConnect, and Expense-Tracker as project case studies.
  - Create a template for all case studies 
- Confgiure multiple env
  - [x] Staging - Dev
  - [ ] Pass in env to map to env
- Syntax/Code Highlighting
- Tags - Topics
- Reactions
- [x] ~~View Comment~~
- [x] ~~Minutes Read~~

  https://github.com/saadpasta/react-blog-github

- Add [unsplash](https://unsplash.com/documentation)
  - When adding a blog image a user should be able to use an unsplash image.
- Sign up to newletter on blog page.
  - with Brevo
- Article Updates
  - [ ] Save a blog post to favorites
  - [x] Save blog post as a draft
  - [ ] Schedule blog post
  - [ ] Track views to blog post
  - [ ] Like a comment
  - [ ] Handle notifications button on blog post
  - [ ] Allow signed in user the ability to edit post.
- User Updates
  - Save user to favorite authors
  - Follow the author
  - Update your profile page
  - View your profile page
- DevOps
  - Add Github Actions
  - Static Scan
  - Dependency Scan
  - Lint Errors (ES Lint, Prettier)
  - Testing (Unit, Integration, E2E)
  - Upload to EOT
  - Handle Release
  - Handle version
- Games 
  - Create Game Page
- Shop 
  - Create Shop Page
  - Link shop page with etsy shop
  - Allow ability to put in cart
  - Allow ability to checkout
  - Allow the Ability to see orders
- Projects
  - Hightlight projects
    - Pure CSS
    - Update Social Ring
    - Update Kidvercity
    - LeadGen
    - SneakerAPI
    - CareerConnect - When finished
    - UIHeat - When Finished
    - Analytics - When finished
    - AI Quiz - When finished
    - Writemind
    - CareerCompose
    - Budget App - When finished
  - Landing Page
    - Cloud Portfolio
      - https://cassanellicarlo.com/
      - https://djomegni.com/
    - AI Portfolio
      - https://kozodoi.me/portfolio/
      - http://www.ericwadkins.com/
      - https://github.com/thavlik/machine-learning-portfolio?tab=readme-ov-file
      - https://aksh-ai.com/
      - https://medium.com/muthoni-wanyoike/building-a-strong-ai-portfolio-showcase-your-skills-to-employers-d6be0c999f0a
      - https://www.projectpro.io/article/ml-projects-ideas-with-source-code/474
      - https://github.com/nitsuga1986/machine-learning-nd-portfolio
    - DevOps Portfolio
      - https://dev.to/softwaresennin/build-a-stellar-devops-portfolio-with-no-prior-experience-jp8
      - https://medium.com/@AnnAfame/how-to-build-your-projects-portfolio-as-a-junior-devops-engineer-252b554f2291
      - https://troyingram.net/
      - https://adityacprtm.dev/portfolio
      - https://adityagundecha.com/
      - https://www.mayankdevops.com/
      - https://www.jodywan.com/
      - https://www.projectpro.io/article/real-time-devops-projects-for-practice/585
      - https://www.surajdhakre.xyz/projects
      - https://www.knowledgehut.com/blog/devops/devops-projects#devops%C2%A0project-ideas
    - FrontEnd Porfolio
      - https://itssharl.ee/fr
      - https://www.behance.net/gallery/186671031/Portfolio-for-Frontend-Developer?tracking_source=search_projects|frontend+portfolio&l=7 or https://www.behance.net/gallery/186671031/Portfolio-for-Frontend-Developer
      - https://tamalsen.dev/
      - https://dunks1980.com/
      - https://bepatrickdavid.com/
      - https://www.lauren-waller.com/
      - https://vanholtz.co/
      - https://resn.co.nz/
      - https://www.seyi.dev/?ref=catalins.tech
      - https://cydstumpel.nl/
    - Backend Dev
      - https://blog.hubspot.com/website/backend-projects
      - https://blog.devgenius.io/designing-a-backend-developer-portfolio-website-a-ux-case-study-5881236ec36b
      - https://www.youtube.com/watch?v=nIracKeqsFk
    - Game Dev
      - https://bruno-simon.com/
      - http://www.rleonardi.com/interactive-resume/?ref=hackernoon.com
      - https://caferati.me/
      - https://jesse-zhou.com/
    - Mechnical Engineer
      - https://mitcommlab.mit.edu/meche/commkit/portfolio/
      - https://www.freelance.pizza/post/build-a-stunning-engineering-portfolio
      - https://thanhvtran.com/
      - https://static1.squarespace.com/static/5605c610e4b06b221b9e1b52/t/5a9b0a1c0d9297b125485029/1520110148892/Sienna+Magee+Portfolio+v2.pdf
      - https://www.hannahgazdus.com/
      - https://www.tjwatson.net/
      - https://www.williamsadowski.com/Portfolio/DesignPortfolio_Sadowski.pdf
      - https://mjaspeg.wixsite.com/mjaspe
      - https://www.hardwareishard.net/portfolio-database
      - https://fwachter.github.io/
      - https://sites.google.com/view/sethschafferportfolio/home
      - https://www.colinkeil.com/
      - https://evangrant.wordpress.ncsu.edu/
    - Electrical Engineer
      - https://www.jeremyblum.com/portfolio/
      - https://priswidjaja.wixsite.com/portfolio
      - https://slidesgo.com/theme/electrical-engineer-portfolio
      - https://twcarobotics.com/engineering-notebook/
      - https://ftcbrowncoats.org/wp-content/uploads/2021/05/Engineering-Portfolio.pdf
    - Robotics Engineer
      - https://www.mccormick.northwestern.edu/robotics/curriculum/featured-project-portfolios.html
      - https://www.kuriosityrobotics.com/_files/ugd/065d5b_84b3c96fc00c4ac7bedb8852eeddec67.pdf?index=true
      - https://ethanholand.com/
      - https://www.jesseweisberg.com/
      - https://campussuite-storage.s3.amazonaws.com/prod/1558774/0fe95a24-a31d-11e9-aabe-12253009c2da/2378222/297345ce-9355-11ec-981c-0e9cb3837b5b/file/RoboClovers%20FTC%202021-2022%20Engineering%20Portfolio%20(rev%201.10.21).pdf
    - Architect 
      - https://www.schabell.org/2022/05/portfolio-architecture-examples-application-development-collection.html
      - https://spetrescu.ro/