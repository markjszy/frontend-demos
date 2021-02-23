# CRUD Library

Demo of a personal library management application

Uses a demo API server.

## Key differences from houses demo

* You host the API locally
* We use very few jQuery DOM method calls to assemble elements -- just one call after assembling ALL markup on each re-render
* Use of data-* properties on elements we end up re-querying for data that needs to be passed to the API

## Installation

* Navigate to `client` and run `npm install`
* Navigate to `server` and run `npm install`

## Running it

* In one terminal window, navigate to `server` and run `node server.js`
* In another terminal, navigate to `client` and run `npx http-server`
* Open Chrome and navigate to http://localhost:8080