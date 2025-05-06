# Arkansas QSO Party Scoreboard/Submission Site

<a href="https://arkansasqp.netlify.app">
  <img src="https://arkansasqp.netlify.app/Arkansas-QSO-Party-logo.png" width="200"/>
</a>

## Purpose

A Next.js to allow uploading amateur radio log files in a standardized format, parse the score and relevant details, and display results for any past or current contest. Special attention is given to reusability, displaying past results, and allowing analytics of results by category.

## Site

View the site at https://arkansasqp.netlify.app

View the contest rules/more information at https://arkqp.com

## Developing

- Copy `.env.example` to `.env` and replace database username/password (using replicaset or direct connection to a testing db)
- `rs.initiate({_id: "rs0", members: [{_id: 0, host: "127.0.0.1:27017"}] })` to setup replicaset if brand-new
- `npm install` and `npm run dev` to build in dev mode.

## Copyright

All Rights Reserved. Copyright © 2022 [Henry Darnell](https://darnell.io/)
