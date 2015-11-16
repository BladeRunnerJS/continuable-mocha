
let testsExecuted = [];

export function resetTestsExecuted(that) {
	testsExecuted = [];
}

export function currentTestName(that) {
	return that.test.fullTitle();
}

export function recordTest(that) {
	testsExecuted.push( currentTestName(that) );
}

export function firstTestCalled() {
	return testsExecuted.shift();
}



