# Continuable Mocha

A small library that allows one Mocha test to 'continue from' another.

## Usage

Require the `continueFrom` function:

```
var continueFrom = require('continuable-mocha');
// or
import continueFrom from 'continuable-mocha';
```

To continue from a test call `continueFrom` passing in the `this` object and either the name of the test in the same suite or the full suite and test name separated by `::` characters. The `this` object is required to access the active test and it's containing suite.

**Note** Arrow functions won't work with `continueFrom` since the `this` object must point to the active test.

```
var continueFrom = require('continuable-mocha');
// or import continueFrom from 'continuable-mocha';

describe('my suite', function() {

	it('a test', function() {
		// a test
	});

	it('continue from another', function() {
		continueFrom(this, 'a test');
	});

	it('continue from a nested suite test', function() {
		continueFrom(this, 'nested suite::nested suite test');
	});

	it('continue from a doubly nested suite test', function() {
		continueFrom(this, 'nested suite::doubly nested suite::nested suite test');
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

To continue from a test that has been ignored using Mocha's `xit` function the ignored test must be defined using the `xit` function provided by the contiuable mocha library. This allows storing the ignored test function which Mocha does not do by default.

```
var continueFrom = require('continuable-mocha');
var _xit = continueFrom.xit;
// or import continueFrom, {xit as _xit} from '../src/ContinueFrom';

describe('my suite', function() {

	_xit('ignored test', function() {
		// a test
	});

	it('continue from another', function() {
		continueFrom(this, 'ignored test');
	});

});
```

## Development

- the source code is in `src`
- tests are in `test`. Run default tests command via `npm test`. `npm run test:node:debug` or `npm run test:browser:debug` can be used to start a persistant test process which watches the director.