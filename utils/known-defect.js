const { test } = require('@playwright/test');

function knownDefect(bugId, summary) {
    test.fail(true, `${bugId}: ${summary}`);
    test.info().annotations.push({ type: 'known-defect', description: `${bugId} - ${summary}` });
}

module.exports = { knownDefect };
