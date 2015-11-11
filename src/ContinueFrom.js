// multiple nested describes

let SUITE_TARGET_SEPARATOR = "::";

import sprintf from 'sprintf';

export default function(that, target) {
	let suite = that.test.parent;
	let matchingTest = locateTest(suite, target);
	
	console.log(matchingTest);
	
	if (matchingTest == undefined) {
		throw new Error( sprintf("Unable to find the test '%s'", target, suite.fullTitle()) );
	}
	
	let oldContextTest = suite.ctx.test;
	try {
		matchingTest.ctx.test = matchingTest;
		matchingTest.fn.call(matchingTest.ctx);
	} finally {
		matchingTest.ctx.test = oldContextTest;
	}
}

function locateTest(suite, testName) {
	let matchingTest;
	let fullTitleToMatch = testName.replace(new RegExp(SUITE_TARGET_SEPARATOR, 'g'), ' ');
	
	if (testName.indexOf(SUITE_TARGET_SEPARATOR) === -1) {
		fullTitleToMatch = suite.fullTitle() + " " + fullTitleToMatch;
	}
	
	suite.eachTest((theTest) => {
		if (theTest.fullTitle() === fullTitleToMatch) {
			matchingTest = theTest;
		}
	});
	return matchingTest;
}
