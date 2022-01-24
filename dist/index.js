/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 789:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 259:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(789);
const github = __nccwpck_require__(259);

async function eventHandler() {
    try {
        const commentsMustContain = core.getInput('comments-must-contain').toLocaleLowerCase();
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN);
        const owner = github.context.issue.owner;
        const repo = github.context.issue.repo;
        const pullNumber = github.context.issue.number;
        const data = {
            owner: owner,
            repo: repo,
            pull_number: pullNumber,
        };
        const response = await octokit.request("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", data);

        const hasMessageAboutSecurityReview = (response.data || [])
            .map(review => (review.body || "").toLocaleLowerCase().includes(commentsMustContain))
            .reduce((a, b) => a || b, false);

        if(hasMessageAboutSecurityReview === false) {
            core.setFailed(`Message ${commentsMustContain} wasn't mentioned in Pull Request Review Comments`);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

eventHandler()
    .then(resp => console.log(resp))
    .catch(err => console.log(err));

})();

module.exports = __webpack_exports__;
/******/ })()
;