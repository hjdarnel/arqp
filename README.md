# Arkansas QSO Party Scoreboard/Submission Site

<a href="https://arkansasqp.netlify.app">
  <img src="https://i0.wp.com/arkqp.com/wp-content/uploads/2020/11/Arkansas-QSO-Party-logo-red-letters.png?resize=768%2C768&ssl=1" width="200"/>
</a>

## Purpose

A React SPA to allow uploading amateur radio log files in a standardized format, parse the score and relevant details, and display results for any past or current contest. Specially attention is paid to reusability, displaying past results, and allowing analytics of results by category.

## Tech

The app is a React/TypeScript frontend, supported with [Netlify Functions](https://www.netlify.com/products/functions/), built with [Vite](https://vitejs.dev/). The backend ORM is [Prisma](https://www.prisma.io/), and the database is a serverless instance of [MongoDB Atlas](https://www.mongodb.com/atlas/database). 

Hosting is entirely free for our load!

## Site

View the site at https://arkansasqp.netlify.app

View the contest rules/more information at https://arkqp.com

## Developing

- Github Codespaces are supported
- Copy `.env.example` to `.env` and replace database username/password (or use a local connection string)
- `npm install` and `npx netlify dev` to build in dev mode, including backend functions

## Copyright

All Rights Reserved. Copyright © 2022 [Henry Darnell](https://darnell.io/)
