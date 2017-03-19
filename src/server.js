'use strict';

import fs from 'fs';
import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import bodyParser from 'body-parser';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';
import NotFoundPage from './components/NotFoundPage';
import _ from 'lodash';

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// define the folder that will be used for static assets
app.use(Express.static(path.join(__dirname, 'static')));

// Middleware!! :)
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

function getData(filename, callback) {
  fs.readFile(filename, (err, buffer) => {
    if (err) {
      return callback(err);
    }
    let data;
    try {
      data = JSON.parse(buffer.toString());
    } catch (err) {
      return callback(err);
    }
    callback(null, data);
  });
}

function editData(filename, transformer, callback) {
  getData(filename, (err, data) => {
    if (err) {
      return callback(err);
    }
    data = transformer(data) || data;
    const outputBuffer = Buffer.from(JSON.stringify(data));
    fs.writeFile('./src/data/people.json', outputBuffer, (err) => {
      if (err) {
        return callback(err);
      }
      callback(null, data);
    });
  });
}

app.get('/api/people', (req, res) => {
  getData('./src/data/people.json', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(404, 'Not Found').end();
    }
    res.json(data);
  });
});

app.get('/api/people/:id', (req, res) => {
  getData('./src/data/people.json', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(404, 'Not Found').end();
    }
    res.json(_.find(data, {id: req.params.id}));
  });
});

app.patch('/api/people/:id', (req, res) => {
  const transformer = (data) => {
    const entry = _.find(data, {id: req.params.id});
    _.forOwn(req.body, (value, key) => {
      entry[key] = value;
    });
  };
  editData('./src/data/people.json', transformer, (err) => {
    if (err) {
      return res.status(404, err.message).end();
    }
    res.status(204).end();
  });
});

app.delete('/api/people/:id', (req, res) => {
  const transformer = (data) => {
    const entryIndex = _.findIndex(data, {id: req.params.id});
    data.splice(entryIndex, 1);
  };
  editData('./src/data/people.json', transformer, (err) => {
    if (err) {
      return res.status(404, err.message).end();
    }
    res.status(204).end();
  });
});

app.post('/api/people', (req, res) => {
  let newEntry = req.body;
  newEntry.id = String(Date.now()) + (Math.random().toFixed(9) * 1e9);
  const transformer = (data) => { data.push(newEntry); };
  editData('./src/data/people.json', transformer, (err) => {
    if (err) {
      return res.status(404, err.message).end();
    }
    res.status(201).json({ id: newEntry.id });
  });
});

// universal routing and rendering
app.get('*', (req, res) => {
  match(
    { routes, location: req.url },
    (err, redirectLocation, renderProps) => {

      // in case of error display the error message
      if (err) {
        return res.status(500).send(err.message);
      }

      // in case of redirect propagate the redirect to the browser
      if (redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      // generate the React markup for the current route
      let markup;
      if (renderProps) {
        // if the current route matched we have renderProps
        markup = renderToString(<RouterContext {...renderProps}/>);
      } else {
        // otherwise we can render a 404 page
        markup = renderToString(<NotFoundPage/>);
        res.status(404);
      }

      // render the index template with the embedded React markup
      return res.render('index', { markup });
    }
  );
});

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
server.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  console.info(`Server running on http://localhost:${port} [${env}]`);
});
