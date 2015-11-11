/* global describe, xdescribe, beforeEach, afterEach, it, xit */
'use strict';

import continueFrom, {xit as continueFrom_xit} from '../src/ContinueFrom';

import chai from 'chai';
let expect = chai.expect;

describe("ContinueFrom", function() {
	
	let testsExecuted;
	
	beforeEach(() => {
		testsExecuted = new Array();
	});
	
	it("dummy test 1", function() {
		recordTest(this);
	});
	
	xit("ignored dummy test 1", function() {
		recordTest(this);
	});
	
	continueFrom_xit(this, "ignored dummy test 3 using continueFrom_xit", function() {
		recordTest(this);
	});
	
	
	/* start functionality tests */
	it("can continue from a test by its test name only", function() { 
		continueFrom(this, "dummy test 1");
		recordTest(this);
		
		expect(firstTestCalled()).to.equal("ContinueFrom dummy test 1");
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});
	
	it("can continue from a test by using its full suite and test name", function() { 
		continueFrom(this, "ContinueFrom::dummy test 1");
		recordTest(this);
		
		expect(firstTestCalled()).to.equal("ContinueFrom dummy test 1");
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});
	
	it("will throw an error if the test cannot be found using the test name", function() {
		expect(
			continueFrom.bind(undefined, this, "thing that does not exist")
		).to.throw("Unable to find the test 'thing that does not exist'");
	});
	
	it("will throw an error if the test cannot be found using the suite and test name", function() {
		expect(
			continueFrom.bind(undefined, this, "ContinueFrom::thing that does not exist")
		).to.throw("Unable to find the test 'ContinueFrom::thing that does not exist'");
	});
	
	it("will throw an error if a test continues from a test that is ignored", function() {
		expect(
			continueFrom.bind(undefined, this, "ContinueFrom::ignored dummy test 1")
		).to.throw("Found the test 'ContinueFrom::ignored dummy test 1', but it was ignored. Used the continues from 'xit' function instead.");
	});
	
	it("can continue from an ignored test by using the continuesFrom xit function", function() { 
		continueFrom(this, "ignored dummy test 3 using continueFrom_xit");
		recordTest(this);
		expect(firstTestCalled()).to.equal("ContinueFrom ignored dummy test 3 using continueFrom_xit");
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});
	
	it("can continue from an ignored test by using the continuesFrom xit function with the absolute test name", function() {
		continueFrom(this, "ContinueFrom::ignored dummy test 3 using continueFrom_xit");
		recordTest(this);
		expect(firstTestCalled()).to.equal("ContinueFrom ignored dummy test 3 using continueFrom_xit");
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});
	
	describe("nested suite", function() {
		
		it("can continue from a test in another suite by its test name only", function() { 
			continueFrom(this, "dummy test 1");
			recordTest(this);
			
			expect(firstTestCalled()).to.equal("ContinueFrom dummy test 1");
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});
		
		it("can continue from a test in another suite by using its full suite and test name", function() { 
			continueFrom(this, "ContinueFrom::dummy test 1");
			recordTest(this);
			
			expect(firstTestCalled()).to.equal("ContinueFrom dummy test 1");
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});
	
		it("will throw an error for an ignored test test in another suite", function() { 
			expect(
				continueFrom.bind(undefined, this, "ContinueFrom::ignored dummy test 1")
			).to.throw("Found the test 'ContinueFrom::ignored dummy test 1', but it was ignored. Used the continues from 'xit' function instead.");
		});
	
		it("can continue from an ignored test in another suite by using the continuesFrom xit function with the absolute test name", function() {
			continueFrom(this, "ContinueFrom::ignored dummy test 3 using continueFrom_xit");
			recordTest(this);
			expect(firstTestCalled()).to.equal("ContinueFrom ignored dummy test 3 using continueFrom_xit");
			expect(nextTestCalled()).to.equal(currentTestName(this));
		});
		
	});
	
	/* utils */
	function recordTest(that) {
		testsExecuted.push( currentTestName(that) );
	}
	
	function firstTestCalled() {
		return testsExecuted.shift();
	}
	var nextTestCalled = firstTestCalled; /* syntactic sugar */
	
	function currentTestName(that) {
		return that.test.fullTitle();
	}
	
});
