const xt = require('xtal-test/index');
(async () => {
    const passed = await xt.runTests([
        {
            path: 'test/fly-parse.html',
            expectedNoOfSuccessMarkers: 0,
        }
    ]);
    if (passed) {
        console.log("Tests Passed.  Have a nice day.");
    }
})();
