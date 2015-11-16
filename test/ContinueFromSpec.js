/* global continueFrom */
import '../src/ContinueFrom';

import chai from 'chai';

let expect = chai.expect;

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

	it('dummy test using arrow functions', () => {
		// empty test, we cant record it because 'this' isnt the test object with arrow functions
	});

	/* start functionality tests */
	it('can continue from a test by its test name only', function() {
		continueFrom('dummy test 1');
		recordTest(this);

		expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('can continue from a test by using its full suite and test name', function() {
		continueFrom('ContinueFrom::dummy test 1');
		recordTest(this);

		expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('can continue from a test where the continuing test is written using arrow functions', () => {
		expect(() => {
			continueFrom('dummy test 1'); // we cant assert the called tests since 'this' isnt the test object using arrow functions
		}).to.not.error;
	});

	it('can continue from a test where the continued test is written using arrow functions', () => {
		expect(() => {
			continueFrom('dummy test using arrow functions'); // we cant assert the called tests since 'this' isnt the test object using arrow functions
		}).to.not.error;
	});

	it('will throw an error if the test cannot be found using the test name', function() {
		expect(() => {
			continueFrom('thing that does not exist');
		}).to.throw('Unable to find the test \'thing that does not exist\'');
	});

	it('will throw an error if the test cannot be found using the suite and test name', function() {
		expect(() => {
			continueFrom('ContinueFrom::thing that does not exist');
		}).to.throw('Unable to find the test \'ContinueFrom::thing that does not exist\'');
	});

	it('can continue from an ignored test', function() {
		continueFrom('ignored dummy test 1');
		recordTest(this);
		expect(firstTestCalled()).to.equal('ContinueFrom ignored dummy test 1');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('can continue from an ignored test by using the continuesFrom xit function with the absolute test name', function() {
		continueFrom('ContinueFrom::ignored dummy test 1');
		recordTest(this);
		expect(firstTestCalled()).to.equal('ContinueFrom ignored dummy test 1');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	describe('nested suite', function() {

		it('can continue from a test in another suite by its test name only', function() {
			continueFrom('dummy test 1');
			recordTest(this);

			expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});

		it('can continue from a test in another suite by using its full suite and test name', function() {
			continueFrom('ContinueFrom::dummy test 1');
			recordTest(this);

			expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});

		it('will throw an error for an ignored test test in another suite', function() {
			continueFrom('ContinueFrom::ignored dummy test 1');
			recordTest(this);
			expect(firstTestCalled()).to.equal('ContinueFrom ignored dummy test 1');
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});

	});

});
