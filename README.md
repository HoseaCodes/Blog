# [HoseaCodes-Blog](http://www.hoseacodes.com/)

## Created by: Dominique Hosea

### September 2020

Welcome, to my personal blog and portfolio. Sharing information is vital and especially in the dev commnunity. The blog showcases my latest works, testomines, articles, about me section, and contact me section. It mainly focuses on my current and most recent accomplishments.

[![NPM Version 7.6.3][npm-image]][npm-url]

### Homepage

![Homepage](https://i.imgur.com/5k3N3ex.png)

### Blog Page

![Article Page](https://i.imgur.com/PeDkdtv.png)

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

## Getting Started

The user is brought to the home page where they can navigate to my [portfolio](www.dominiquehosea.com), my blog posts, my about me, or contact page. The home page is an introduction to who I am. The is a brief history of my experience with the option to download my resume. Additionally, I have the technologies that I am currently using, a project showcase, an embbed [Twitter](https://twitter.com/DominiqueRHosea) widget, and testimonies.

## Frontend

### Typography

Fluid font sizes - The body is set to 100% causing the font to adjust the font sizes to the browser defaults.

Best Practices:

- No pixels are used to calculate sizes
- `em` or `rem` are used to calculate font-sizes

### Images

Width - Set max-width to 100% causing the images to grow or shrink depending on the size of the parent column.

Best Practices:

- Have at least 150 ppi at least 300 is recommended

  How to find ppi for Mac users:

  - Open your image in Preview.
  - Up at the top, click "Tools" > "Adjust Size"
  - Uncheck the box labeled "Resample Image"
  - Next, using inches, change the size of your artwork to your desired print size.
  - The resolution should be at least 300 pixels per inch.

- Compress the images
  You can use tools like https://compresspng.com/ to compress the image
  - The browser will optimize the image due to image being so large. They will size the image down to shrink it to the webpage.
- Alterantively, you can look into srcset

## Backend

### Business Logic

### Enpoints

Test enpoints on test server:

Simply visit [Test Server](https://app.swaggerhub.com/apis-docs/HoseaCodes/Hoseacodes/1.0.0#/)

Test endpoints locally by:

```bash
/* Change directories into Swagger Server */

cd swagger-server

/* Run Server */

npm start

/* The server will be live on http://localhost:8080/docs */
```

After completing the instructions to run locally click here: [Local Server](http://localhost:8080/docs)

- /articles
- /articles/:id
- /upload
- /destory
- /register
- /login
- /refresh_token

## Dev Ops

### Process Manager

This project uses PM2 to keep the application alive due to faulty errors, server changes or file changes. Visit https://pm2.io/docs/plus/overview/ for details.

### Logger

This project uses Winston to log events into our log manager. Visit https://github.com/winstonjs/winston for details.

This project uses Morgan to log events inside of the terminal. Visit https://github.com/expressjs/morgan for details.

## Enviornments

[env-cmd](https://www.digitalocean.com/community/tutorials/nodejs-take-command-with-env-cmd)

### Local

### Staging

### Production

### Development

#### Performance

React profiler is used to montior the performance of the application.

How to run:

- Create a production build

```js
npm run build -- --profile
```

- In Chrome dev tools place the throttle on low-end mobile
- In the profiler enable: "Record why wach component rendered while profiling"
- Target orange or darker commits
- Check if it's a state management problem or try to solve it with memoization (i.e. callback or memo)

This project uses EditorConfig to standardize text editor configuration. Visit https://editorconfig.org for details.

This project uses ESLint to detect suspicious code in JavaScript files. Visit https://eslint.org for details.

- Home Screen 618ms
- Portfolio Screen 149 ms
- Portfolio Case Study
- Blogs Screen
- Blog Post Screen
- About Screen
- Contact Screen

### Testing

This project uses Jest for testing. Visit https://jestjs.io for details.

To execute tests:

```bash
npm test
```

## External APIs

- [Send Grid](https://app.sendgrid.com/)
- [Get Form](https://getform.io/)
- [Swagger API](https://support.smartbear.com/swaggerhub/docs/about.html)

## Unsolved Problems

## Future Enhancements

- User login with the ability to add comments and like post.
- Routing for 404
- Add Calorie Kicthen, Sneaker-API, Ecommerce-Site, Ecommerce-Backend-Template, React-Crypto, Cypto-Learn, CareerConnect, and Expense-Tracker as project case studies.
- Confgiure multiple env
