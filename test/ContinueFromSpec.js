import continueFrom, {xit as continueFromXit} from '../src/ContinueFrom';

import chai from 'chai';

let expect = chai.expect;

import getGlobal from 'get-global';

describe('ContinueFrom', function() {

	let testsExecuted;

	/* utils */

    function currentTestName(that) {
		return that.test.fullTitle();
	}

	function recordTest(that) {
		testsExecuted.push( currentTestName(that) );
	}

	function firstTestCalled() {
		return testsExecuted.shift();
	}
	var nextTestCalled = firstTestCalled; /* syntactic sugar */

	beforeEach(() => {
		testsExecuted = [];
	});

	it('dummy test 1', function() {
		recordTest(this);
	});

	xit('ignored dummy test 1', function() {
		recordTest(this);
	});

	continueFromXit(this, 'ignored dummy test 3 using continueFromXit', function() {
		recordTest(this);
	});

	/*eslint-env node */
	var requiredContinueFromXit = require('../src/ContinueFrom').xit;
	/*eslint-env es6, mocha */
	requiredContinueFromXit(this, 'ignored dummy test 3 using requiredContinueFromXit', function() {
		recordTest(this);
	});

	/* start functionality tests */
	it('can continue from a test by its test name only', function() {
		this.continueFrom('dummy test 1');
		recordTest(this);

		expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('can continue from a test by using its full suite and test name', function() {
		this.continueFrom('ContinueFrom::dummy test 1');
		recordTest(this);

		expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('will throw an error if the test cannot be found using the test name', function() {
		expect(() => {
			this.continueFrom('thing that does not exist');
		}).to.throw('Unable to find the test \'thing that does not exist\'');
	});

	it('will throw an error if the test cannot be found using the suite and test name', function() {
		expect(() => {
			this.continueFrom('ContinueFrom::thing that does not exist')
		}).to.throw('Unable to find the test \'ContinueFrom::thing that does not exist\'');
	});

	it('will throw an error if a test continues from a test that is ignored', function() {
		expect(() => {
			this.continueFrom('ContinueFrom::ignored dummy test 1')
		}).to.throw('Found the test \'ContinueFrom::ignored dummy test 1\', but it was ignored. Used the continues from \'xit\' function instead.');
	});

	it('can continue from an ignored test by using the continuesFrom xit function', function() {
		this.continueFrom('ignored dummy test 3 using continueFromXit');
		recordTest(this);
		expect(firstTestCalled()).to.equal('ContinueFrom ignored dummy test 3 using continueFromXit');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('can continue from an ignored test by using the continuesFrom xit function with the absolute test name', function() {
		this.continueFrom('ContinueFrom::ignored dummy test 3 using continueFromXit');
		recordTest(this);
		expect(firstTestCalled()).to.equal('ContinueFrom ignored dummy test 3 using continueFromXit');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('can continue from an ignored test by using the required version of continuesFrom xit function', function() {
		this.continueFrom('ContinueFrom::ignored dummy test 3 using requiredContinueFromXit');
		recordTest(this);
		expect(firstTestCalled()).to.equal('ContinueFrom ignored dummy test 3 using requiredContinueFromXit');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	describe('nested suite', function() {

		it('can continue from a test in another suite by its test name only', function() {
			this.continueFrom('dummy test 1');
			recordTest(this);

			expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});

		it('can continue from a test in another suite by using its full suite and test name', function() {
			this.continueFrom('ContinueFrom::dummy test 1');
			recordTest(this);

			expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});

		it('will throw an error for an ignored test test in another suite', function() {
			expect(() => {
				this.continueFrom('ContinueFrom::ignored dummy test 1')
			}).to.throw('Found the test \'ContinueFrom::ignored dummy test 1\', but it was ignored. Used the continues from \'xit\' function instead.');
		});

		it('can continue from an ignored test in another suite by using the continuesFrom xit function with the absolute test name', function() {
			this.continueFrom('ContinueFrom::ignored dummy test 3 using continueFromXit');
			recordTest(this);
			expect(firstTestCalled()).to.equal('ContinueFrom ignored dummy test 3 using continueFromXit');
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});

	});

});
