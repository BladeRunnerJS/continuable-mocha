// multiple nested describes

let SUITE_TARGET_SEPARATOR = '::';

import sprintf from 'sprintf';
import getGlobal from 'get-global';
import Mocha from 'mocha';

const GLOBAL = getGlobal();

let ignoredSuiteTests = [];

Mocha.Context.prototype.continueFrom = function(target) {
	let theTest = this;
	let suite = theTest.test.parent;
	let rootSuite = findRootSuite(suite);
	let matchingTest = locateTest(rootSuite, target);

	if (matchingTest === undefined) {
		throw new Error( sprintf('Unable to find the test \'%s\'', target) );
	}

	if (!matchingTest.fn) {
		throw new Error( sprintf( 'Found the test \'%s\', but it was ignored. Used the continues from \'xit\' function instead.', target) );
	}

	let oldContextTest = suite.ctx.test;
	try {
		matchingTest.ctx.test = matchingTest;
		matchingTest.fn.call(matchingTest.ctx);
	} finally {
		matchingTest.ctx.test = oldContextTest;
	}
};

let mochaXit = GLOBAL.xit;
GLOBAL.xit = function xit(testName, fn) {
	mochaXit(testName, fn);
	ignoredSuiteTests[0].set(testName, fn);
};

let mochaDescribe = GLOBAL.describe;
GLOBAL.describe = function describe(suiteName, fn) {
	ignoredSuiteTests.push(new Map());

	let suite = mochaDescribe(suiteName, fn);

	let thisSuiteIgnoredTests = ignoredSuiteTests.pop();
	thisSuiteIgnoredTests.forEach((testFn, testName) => {
		locateTest(suite, testName).fn = testFn;
	});

	return suite;
};


function locateTest(suite, testName) {
	let matchingTest;
	let fullTitleToMatch = testName.replace(new RegExp(SUITE_TARGET_SEPARATOR, 'g'), ' ');

	if (testName.indexOf(SUITE_TARGET_SEPARATOR) === -1) {
		fullTitleToMatch = suite.fullTitle() + ' ' + fullTitleToMatch;
	}

	suite.eachTest((theTest) => {
		if (matchingTest !== undefined) {
			return;
		}

		if (theTest.fullTitle() === fullTitleToMatch) {
			matchingTest = theTest;
		}
	});
	return matchingTest;
}

function findRootSuite(suite) {
	while(suite.parent && !suite.parent.root) {
		suite = suite.parent;
	}
	return suite;
}

