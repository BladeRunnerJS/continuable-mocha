/* global continueFrom */
import ContinueFrom from '../src/ContinueFrom';
ContinueFrom.install();

import {
	resetTestsExecuted,
	currentTestName,
	recordTest,
	firstTestCalled,
	firstTestCalled as nextTestCalled
} from './Utils';

import chai from 'chai';
let expect = chai.expect;

describe('ContinueFromAnotherFile', function() {

	beforeEach(() => {
		resetTestsExecuted();
	});

	it('can continue from a test in another file using the suite and test name', function() {
		continueFrom('ContinueFrom::dummy test 1');
		recordTest(this);

		expect(firstTestCalled()).to.equal('ContinueFrom dummy test 1');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('can continue from an ignored test in another file', function() {
		continueFrom('ContinueFrom::ignored dummy test 1');
		recordTest(this);

		expect(firstTestCalled()).to.equal('ContinueFrom ignored dummy test 1');
		expect(nextTestCalled()).to.equal(currentTestName(this));
	});

	it('will throw an error if the test in another file cannot be found using the test name only', function() {
		expect(() => {
			continueFrom('dummy test 1');
		}).to.throw('Unable to find the test \'dummy test 1\'');
	});

});
