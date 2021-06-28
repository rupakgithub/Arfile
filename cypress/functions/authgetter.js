const puppeteer = require("puppeteer");
const fs = require('fs');

exports.getAadToken = async function getAadToken() {
    const creds = puppeteer.launch({ headless: false }).then(async browser => {
        try {
            const page = await browser.newPage();
            await page.goto("https://genesis-qa.dovertech.co.in/");

            await page.waitForSelector("input[id='cred_userid_inputtext']");
            await page.type("input[id='cred_userid_inputtext']", "adasadmin", {
                applyDelay: 50
            });

            await page.waitForSelector("input[id='cred_password_inputtext']");
            await page.type("input[id='cred_password_inputtext']", "Dover@123", {
                applyDelay: 50
            });

            await page.waitForSelector("button[id='cred_sign_in_button']");
            await page.click("button[id='cred_sign_in_button']");

            await applyDelay(16000);

            let tokenValues = await page.evaluate(() => {
                let values = {};
                for (var i = 0, len = localStorage.length; i < len; ++i) {
                    values[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
                }
                return values;
            });

            let sessionValues = await page.evaluate(() => {
                let values = {};
                for (var i = 0, len = sessionStorage.length; i < len; ++i) {
                    values[sessionStorage.key(i)] = sessionStorage.getItem(sessionStorage.key(i));
                }
                return values;
            });

            fs.writeFileSync("cypress/fixtures/savetokenData.json",JSON.stringify(tokenValues));

            fs.writeFileSync("cypress/fixtures/saveSessionData.json",JSON.stringify(sessionValues));

            browser.close();
            return sessionValues;

        } catch (error) {
            console.log(error);
            browser.close();
            return -1;
        }

    });
    return creds;
}

function applyDelay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}