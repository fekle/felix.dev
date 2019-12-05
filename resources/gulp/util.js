const cp = require('child_process');
const through = require('through2');

const exec = (args, stdin) => {
  return new Promise((res, rej) => {
    try {
      const proc = cp.execFile('bash', ['-c', args], e => (e ? rej(e) : res()));
      proc.stdout.on('data', data => process.stdout.write(data.toString()));
      proc.stderr.on('data', data => process.stderr.write(data.toString()));
      if (stdin) {
        proc.stdin.write(stdin);
        proc.stdin.end();
      }
      return proc;
    } catch (e) {
      rej(e);
    }
  });
};

const forEachFile = fn => {
  const buf = [];
  return through.obj(
    (c, _, cb) => {
      if (!c.isDirectory()) {
        buf.push(fn(c.path));
      }
      cb();
    },
    cb =>
      Promise.all(buf.map(x => Promise.resolve(x)))
        .then(x => cb(x))
        .catch(e => cb(e)),
  );
};

const withAllFiles = fn => {
  const buf = [];
  return through.obj(
    (c, _, cb) => {
      if (!c.isDirectory()) {
        buf.push(c.path);
      }
      cb();
    },
    cb =>
      Promise.resolve(fn(buf))
        .then(x => cb(x))
        .catch(e => cb(e)),
  );
};

const execAllFilesStdin = cmd => withAllFiles(f => exec(cmd, f.join('\u0000')));
const execForEachFile = fn => forEachFile(f => exec(fn(f)));

module.exports = { exec, forEachFile, withAllFiles, execAllFilesStdin, execForEachFile };
