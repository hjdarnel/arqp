# Arkansas QSO Party Scoreboard/Submission Site

<a href="https://arkansasqp.netlify.app">
  <img src="https://arkansasqp.netlify.app/Arkansas-QSO-Party-logo.png" width="200"/>
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
- `docker-compose up -d` to start the database, then `docker-compose exec mongo` then `mongo` then `rs.initiate({_id: "rs0", members: [{_id: 0, host: "127.0.0.1:27017"}] })` to setup replicaset
- `npm install` and `npx netlify-cli dev` to build in dev mode, including backend functions

## Copyright

All Rights Reserved. Copyright © 2022 [Henry Darnell](https://darnell.io/)
