[![Build Status](https://travis-ci.org/BladeRunnerJS/continuable-mocha.png)](https://travis-ci.org/BladeRunnerJS/continuable-mocha)

# Continuable Mocha

A small library that allows one Mocha test to 'continue from' another.

​_continues-from_​ may be considered an anti-pattern by some, since you can use `beforeEach` within nested `define` blocks to get your tests into the correct state, but we find it useful when porting pre-BDD tests.

## Usage

Require the `continuable-mocha` library and call 'install', this will install the necessary global functions.

```
var continuableMocha require('continuable-mocha');
// or
import continuableMocha from 'continuable-mocha';

continuableMocha.install();
```

To continue from a test call `continueFrom` providing either the name of the test in the same suite or the full suite and test name separated by `::` characters.

```
var continuableMocha = require('continuable-mocha');
continuableMocha.install();

describe('my suite', function() {

	it('a test', function() {
		// a test
	});

	it('ignored test', function() {
		// a test
	});

	it('continue from another', function() {
		continueFrom('a test');
	});

	it('continue from ignored test', function() {
		continueFrom('ignored test');
	});

	it('continue from a nested suite test', function() {
		continueFrom('nested suite::nested suite test');
	});

	it('continue from a doubly nested suite test', function() {
		continueFrom('nested suite::doubly nested suite::nested suite test');
	});

	describe('nested suite', function() {

		it('nested suite test', function() {
			// a test
		});

		describe('doubly nested suite', function() {

			it('nested suite test', function() {
				// a test
			});

		});

	});

});
```

## Development

- the source code is in `src`
- tests are in `test`. Run default tests command via `npm test`. `npm run test:node:debug` or `npm run test:browser:debug` can be used to start a persistent test process which watches the director.
