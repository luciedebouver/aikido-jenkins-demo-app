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

// NEW in this branch: restore user preferences from a cookie with node-serialize 0.0.4 (critical RCE CVE)
const serialize = require('node-serialize');
app.get('/prefs', (req, res) => {
  const prefs = serialize.unserialize(Buffer.from(req.query.p || 'e30=', 'base64').toString());
  res.json(prefs);
});
