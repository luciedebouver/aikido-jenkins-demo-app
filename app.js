// Deliberately vulnerable demo app. Do not deploy.
const express = require('express');
const { exec } = require('child_process');
const _ = require('lodash');
const Handlebars = require('handlebars');

const app = express();

// SAST: command injection (user input passed to a shell)
app.get('/ping', (req, res) => {
  exec('ping -c 1 ' + req.query.host, (err, out) => res.send(out));
});

// Vulnerable dependency paths are actually used (reachable)
app.get('/merge', (req, res) => {
  res.json(_.merge({}, JSON.parse(req.query.data || '{}')));
});

app.get('/hello', (req, res) => {
  const tpl = Handlebars.compile(req.query.tpl || 'Hello {{name}}');
  res.send(tpl({ name: 'demo' }));
});

app.listen(3000);
