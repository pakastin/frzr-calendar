
require('./server.js');

var cp = require('child_process');

exec('npm run watch-css');
exec('npm run watch-js');
exec('npm run watch-uglify-js');

exec('npm run build-css');
exec('npm run build-js', () => {
  exec('npm run uglify-js');
});

function exec (cmd, cb) {
  cmd = cmd.split(' ');
  var child = cp.spawn(cmd[0], cmd.slice(1))
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  cb && child.addListener('exit', cb);
}
