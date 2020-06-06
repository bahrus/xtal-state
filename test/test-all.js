const xt = require('xtal-test/index');
(async () => {
    const passed = await xt.runTests([
        {
            path: 'test/fly-parse.html',
            expectedNoOfSuccessMarkers: 1,
        },
        {
            path: 'test/fly-update.html',
            expectedNoOfSuccessMarkers: 1,
        },
    ]);
    if (passed) {
        console.log("Tests Passed.  Have a nice day.");
    }
})();
