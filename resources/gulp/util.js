const cp = require('child_process');
const through = require('through2');

const exec = args => {
  return new Promise((res, rej) => {
    try {
      const proc = cp.execFile('bash', ['-c', args], () => res());
      proc.stdout.on('data', data => process.stdout.write(data.toString()));
      proc.stderr.on('data', data => process.stderr.write(data.toString()));
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
    cb => {
      Promise.all(buf.map(x => Promise.resolve(x))).then(() => cb());
    },
  );
};

module.exports = { exec, forEachFile };
