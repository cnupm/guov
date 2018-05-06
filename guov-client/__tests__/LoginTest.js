const pups = require('puppeteer');

test('Login', async () => {
    let browser = await pups.launch({headless: false});
    let page = await browser.newPage();

    await page.goto('http://cnupm.ml:7777');
    let loginBtn = await page.waitForSelector('button[type="submit"]');
    let email = await page.waitForSelector('#email');
    let pass = await page.waitForSelector('#password');
    
    console.log('form loaded');

    await email.focus();
    await email.type('xxx')
    loginBtn.click();

    //try to login & find boardsList div
    await page.waitForSelector('#boardsList');
    let boards = await page.$eval('#boardsList', e => e.innerHTML);
    expect(boards).toBeDefined();
}, 10000);