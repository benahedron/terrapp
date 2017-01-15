# terrapp

Terrapp is a tool for managing vegetable pickups, intended to be used by community supported agriculture organizations.

Once you setup the server, you can configure your seasons, pickup options and memberships. Your members can use the website to tell you if they want to delegate a pickup to an other person, can't make pickup a basket or would prefer to get their vegetable basket at a different pickup location.

## Installation
Configure your details in the file "server/config/environement/production.js".

Install the prerequisites as described below, run npm install and build a distribution version using `gulp serve:dist`. Don't forget to password protect your database.

You can run the production version using simply `npm start`. The no users are present upon initialization, a user 'admin@admin.com' with the password 'admin' is created. Once running you should change this as soon as possible.

## Getting Started

This project was generated with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 4.1.1. It has a [Node.js](nodejs.org) backend and an [AngularJS](angularjs.org) based frontend.


### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x
- [Gulp](http://gulpjs.com/) (`npm install --global gulp`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Developing

1. Run `npm install` to install server dependencies.

2. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running

3. Run `gulp serve` to start the development server. It should automatically open the client in your browser when ready.

## Build & development

Run `gulp build` for building and `gulp serve` for preview.

## Testing

Running `npm test` will run the unit tests with karma.
