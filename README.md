Temporary/disposable repository for investigating a possible issue
with `level-read-stream`. Reference: https://github.com/Level/read-stream/issues/17

See ./test/EntryStream-test.js

Dependencies (package.json)
```
    "abstract-level": "^2.0.0",
    "level-read-stream": "^1.1.0",
    "memory-level": "^1.0.0",
    ...
```

```
$ node --version
v20.14.0
$ npm --version
10.7.0
```

`npm install` may error out with the following messages:

```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
npm error
npm error While resolving: level-read-stream@1.1.0
npm error Found: abstract-level@2.0.0
npm error node_modules/abstract-level
npm error   abstract-level@"^2.0.0" from the root project
npm error
npm error Could not resolve dependency:
npm error peerOptional abstract-level@"^1.0.0" from level-read-stream@1.1.0
npm error node_modules/level-read-stream
npm error   level-read-stream@"^1.1.0" from the root project
npm error
npm error Conflicting peer dependency: abstract-level@1.0.4
npm error node_modules/abstract-level
npm error   peerOptional abstract-level@"^1.0.0" from level-read-stream@1.1.0
npm error   node_modules/level-read-stream
npm error     level-read-stream@"^1.1.0" from the root project
npm error
npm error Fix the upstream dependency conflict, or retry
npm error this command with --force or --legacy-peer-deps
npm error to accept an incorrect (and potentially broken) dependency resolution.
```

With `npm install --force` dependencies are installed as specified.
`inflight` and `glob` are transitive dependencies of `mocha`.

```
npm warn using --force Recommended protections disabled.
npm warn ERESOLVE overriding peer dependency
npm warn While resolving: level-read-stream@1.1.0
npm warn Found: abstract-level@2.0.0
npm warn node_modules/abstract-level
npm warn   abstract-level@"^2.0.0" from the root project
npm warn
npm warn Could not resolve dependency:
npm warn peerOptional abstract-level@"^1.0.0" from level-read-stream@1.1.0
npm warn node_modules/level-read-stream
npm warn   level-read-stream@"^1.1.0" from the root project
npm warn
npm warn Conflicting peer dependency: abstract-level@1.0.4
npm warn node_modules/abstract-level
npm warn   peerOptional abstract-level@"^1.0.0" from level-read-stream@1.1.0
npm warn   node_modules/level-read-stream
npm warn     level-read-stream@"^1.1.0" from the root project
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@8.1.0: Glob versions prior to v9 are no longer supported
```

System information (for completeness' sake)

```
$ system_profiler SPSoftwareDataType SPHardwareDataType

Software:

    System Software Overview:

      System Version: macOS 14.5 (23F79)
      Kernel Version: Darwin 23.5.0
      Boot Volume: Macintosh HD
      Boot Mode: Normal
      ... (privacy matters)...

Hardware:

    Hardware Overview:

      Model Name: MacBook Air
      Model Identifier: Mac14,2
      Model Number: Z15Z0009AD/A
      Chip: Apple M2
      Total Number of Cores: 8 (4 performance and 4 efficiency)
      Memory: 24 GB
      System Firmware Version: 10151.121.1
      OS Loader Version: 10151.121.1
      ... (privacy matters)...
```