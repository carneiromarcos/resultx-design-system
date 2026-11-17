const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { EventEmitter } = require('node:events');
const childProcess = require('node:child_process');

test('compatibilidade aguarda stdout tardio até close antes de interpretar JSON', async () => {
  const output = [], errors = [], executionProcess = { execPath: process.execPath, env: process.env, exitCode: 0 };
  let closed = false;
  const spawn = () => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    // exit can occur while stdio still has data pending; close completes both.
    setImmediate(() => {
      const report = JSON.stringify({ stats: { unexpected: 0, skipped: 20, expected: 110 } });
      const split = Math.floor(report.length / 2);
      child.stdout.emit('data', Buffer.from(report.slice(0, split)));
      child.emit('exit', 0);
      setImmediate(() => {
        child.stdout.emit('data', Buffer.from(report.slice(split)));
        closed = true;
        child.emit('close', 0);
      });
    });
    return child;
  };
  const filename = path.resolve('scripts/check-pilot-compat.cjs');
  await vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    __dirname: path.dirname(filename),
    require: Object.assign(name => name === 'node:child_process' ? { ...childProcess, spawn } : require(name), { resolve: require.resolve }),
    process: executionProcess,
    console: { log: value => output.push(value), error: value => errors.push(value) },
    URL,
  }, { filename: 'check-pilot-compat.cjs' });
  expect(errors).toEqual([]);
  expect(executionProcess.exitCode).toBe(0);
  expect(closed).toBe(true);
  expect(JSON.parse(output.join(''))).toEqual(expect.objectContaining({ passed: 110, failed: 0, skippedNewObligations: 20, latestConformity: false }));
}, 10000);
