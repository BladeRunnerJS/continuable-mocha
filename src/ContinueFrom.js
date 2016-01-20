// multiple nested describes

let SUITE_TARGET_SEPARATOR = '::';

import sprintf from 'sprintf';


let ignoredSuiteTests = [];
let mochaXit;
let mochaDescribe;

function highestSuiteAncestor(suite) {
	while(suite.parent && !suite.parent.root) {
		suite = suite.parent;
	}
	return suite;
}

function rootSuite(suite) {
	return highestSuiteAncestor(suite).parent;
}

function locateTest(suite, testName) {
	let matchingTest;
	let fullTitleToMatch = testName.replace(new RegExp(SUITE_TARGET_SEPARATOR, 'g'), ' ');

	if (testName.indexOf(SUITE_TARGET_SEPARATOR) === -1) {
		fullTitleToMatch = suite.fullTitle() + ' ' + fullTitleToMatch;
	}

	rootSuite(suite).eachTest((theTest) => {
		if (matchingTest !== undefined) {
			return;
		}

		if (theTest.fullTitle() === fullTitleToMatch) {
			matchingTest = theTest;
		}
	});
	return matchingTest;
}

function continueFrom(target) {
	let theTest = this;
	let suite = theTest.parent;
	let theHighestSuiteAncestor = highestSuiteAncestor(suite);
	let matchingTest = locateTest(theHighestSuiteAncestor, target);

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


function continuableXit(testName, fn) {
	mochaXit(testName, fn);
	ignoredSuiteTests[0].set(testName, fn);
}

function continuableDescribe(suiteName, fn) {
	ignoredSuiteTests.push(new Map());

	let suite = mochaDescribe(suiteName, fn);

	let thisSuiteIgnoredTests = ignoredSuiteTests.pop();
	thisSuiteIgnoredTests.forEach((testFn, testName) => {
		locateTest(suite, testName).fn = testFn;
	});

	suite.beforeEach(function() {
		let thisContinueFrom = continueFrom.bind(this.test);
		global.continueFrom = thisContinueFrom;
		this.continueFrom = thisContinueFrom;
	});
	suite.afterEach(function() {
		delete this.continueFrom;
		delete global.continueFrom;
	});

	return suite;
}

export default {
	install: () => {
		if(global.xit !== continuableXit){
			mochaXit = global.xit;
			mochaDescribe = global.describe;
			global.xit = continuableXit;
			global.describe = continuableDescribe;
		}
	}
};
