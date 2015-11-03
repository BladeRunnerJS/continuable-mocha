/* global describe, xdescribe, beforeEach, afterEach, it, xit */
'use strict';

import continueFrom from '../src/ContinueFrom';

import chai from 'chai';
let expect = chai.expect;

describe("ContinueFrom", function() {
	
	let testsExecuted;
	
	beforeEach(() => {
		testsExecuted = new Array();
	});
	
	it("test 1", function() {
		recordTest(this);
	});
	
	it("test 2", function() {
		recordTest(this);
	});
	
	/* start functionality tests */
	it("can continue from a test by its test name only", function() { 
		continueFrom(this, "test 1");
		recordTest(this);
		
		expect(firstTestCalled()).to.equal("ContinueFrom test 1");
		expect(nextTestCalled()).to.equal(currentTestName(this));
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
