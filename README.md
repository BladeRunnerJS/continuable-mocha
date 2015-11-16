# Continuable Mocha

A small library that allows one Mocha test to 'continue from' another.

## Usage

Require the `continueable-mocha` library, this will install the neccessary global functions.

```
require('continueable-mocha');
// or
import 'continueable-mocha';
```

To continue from a test call `continueFrom` providing either the name of the test in the same suite or the full suite and test name separated by `::` characters.

```
require('continuable-mocha');

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
- tests are in `test`. Run default tests command via `npm test`. `npm run test:node:debug` or `npm run test:browser:debug` can be used to start a persistant test process which watches the director.