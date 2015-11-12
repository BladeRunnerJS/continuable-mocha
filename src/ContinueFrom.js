// multiple nested describes

let SUITE_TARGET_SEPARATOR = '::';

import sprintf from 'sprintf';
import getGlobal from 'get-global';

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




export default function(theTest, target) {
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
}

export function xit(suite, testName, fn) {
	getGlobal().xit(testName, fn);
	locateTest(suite, testName).fn = fn;
}
