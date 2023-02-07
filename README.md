# Mini-Online-Shop-Project

## Overview
This is an interactive online shop that I built while learning NodeJS/expressJS :)

## Tech Stacks Used
Front-end developed using EJS templating engine <br/>
Back-end developed using ExpressJS and mongoDB <br/>

## Installation and Setup Instructions
**Step 1:** Clone this repository <br/>
**Step 2:** Navigate to util/database.js and update the following line of code with the relevant parameters:
```
const sequelize = new Sequelize("DB_NAME", "USER_NAME", "PASSWORD", {
  dialect: "DB",
  host: "HOST_NAME",
});
```
**Step 3:** Open 1 terminal and navigate to this repository <br/>
**Step 4:** Insert following commands:
```
npm install
npm start
```

