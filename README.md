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

## Terminal Features

The website includes an interactive terminal that you can use to navigate and learn more about me. Here's how to use it:

### Opening the Terminal

- Press Ctrl +  (backtick) or Cmd +  (Mac) to toggle the terminal open/closed
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

## Technologies Used

This application was developed with a full MERN stack. and written in JavaScript. Styling done with Bootstrap, Material UI, SASS or SCSS and CSS.

M - MongoDB, NoSQL database  
E - Express, a back-end framework  
R - React, a client side framework  
N - NodeJS - to run back end service

Dependencies used:

- Morgan - HTTP request logger middleware for node.js
- Fetch - Promise based HTTP client for the browser and node.js
- Bcrypt - A library to hash passwords
- Mongoose - for MongoDB validation
- React-Bootstrap - a React library for building pre-styled components
- Material UI - a library for building pre-styled components
- SASS - a preprocessor scripting language that is interpreted or compiled into Cascading Style Sheets

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

### Security

#### Basic Auth & JWT

![Security](https://i.imgur.com/ZD1gtVH.png)

![JWT](https://i.imgur.com/lFIJa0b.png)

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

Build image locally

```docker
docker build -t hoseacodes-blog .  
```
Run local image in container

```docker
docker run --name hoseacodes-blog-c -p 3001:3001 -d hoseacodes-blog
```

Tag Image for push

```docker
docker tag ${imageID} hoseacodes/hoseacodes/hoseacodes-blog:latest
```

Push Docker Image 

```docker
docker push hoseacodes/hoseacodes-blog:latest    
```

## How To Deploy App

```bash
git push heroku-staging HEAD:main  
```

## How To Restart App

```bash
heroku restart -a app_name
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