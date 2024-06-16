# Project Overview

## Information

**Bot Name**: Suggestions<br>
**Description**: A bot to create and manage suggestions

## Requirements

### General Requirements

- Must use slash commands, buttons and modals

### Commands

| Name                 | Syntax ([] = Optional, <> = Required) | Description                                                                                                                                                                                                                          |
| -------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| suggest              | /suggest                              | Opens a modal where the user can input the suggestion to submit. Every suggestion has an id that starts from 0 and can be used to approve or deny it. It must be stored in a database and it should be different from the message id |
| suggestion accept    | /suggestion accept \<id\>             | Changes the embed color of the suggestion to green (#CAFFBF) and changes the footer to `Approved by <Username>.`                                                                                                                     |
| suggestion deny      | /suggestion deny \<id\>               | Changes the embed color of the suggestion to red (#FFADAD) and changes the footer to `Denied by <Username>.`                                                                                                                         |
| suggestion implement | /suggestion implement \<id\>          | Changes the embed color of the suggestion to yellow (#FDFFB6) and changes the footer to Implemented. The suggestion must be accepted before it can be marked as implemented                                                          |

# Development overview

## Project Structure

.github/<br>
└── workflows/ `Defines files related to building the project automatically on github`<br>
prisma/<br>
└── schema.prisma `Defines Database Schema`<br>
src/ `Contains all source files`<br>
├── index.ts `Starts the bot, and assigns all event listeners`<br>
├── commands/ `Holds all command files`<br>
├── lib/ `Holds all class definitions`<br>
│ └── Discord/ `Wrapper classes over discord.js`<br>
└── util/ `Holds all utility methods`<br>
│ └── interactionHandlers/ `Holds all handler functions for interactions`<br>
.env `Holds environment variable definitions for local development`<br>
Dockerfile `Contains instructions on building the project via Docker`<br>

## Environment

### Database Setup (local)

If you are trying to develop this project locally it does not make sense to use a production database to test with.

In order to properly host a database, the recommended method is using Docker.

This can be done via the following command: `docker run -d --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret mysql:5`

<hr>

- Create a .env file in the root of the project with the following values set appropriately.
- When you use Docker, you can just populate docker environment variables using `-e <KEY>=<VALUE>` in the run command.

`DATABASE_URL`: Either set to `mysql://root:secret@127.0.0.1/suggestionsbot` if you followed the "Database Setup (local)" step or your database string if hosted externally. **Must be MySQL**<br>
`DISCORD_TOKEN`: Set to the value you get from the discord developer page. Bot must be in the same guild as listed below<br>
`DISCORD_GUILD_ID`: This is the guild that will be used for registering commands.<br>
`DISCORD_CHANNEL_ID`: Channel where suggestion Embeds should be sent.<br>

## Building

There are 2 methods of building the project:

1. with npm using `npm run build`
2. with docker using `docker build . --network="host" -t ss`

## Starting

1. You must run `npm run db` every time you update the db schema
2. run `npm start` to start
