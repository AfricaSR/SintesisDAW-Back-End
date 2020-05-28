require('dotenv/config');
describe('test Evenfy.es', () => {
    const TIMEOUT = 1000;
    const {
        Builder,
        By,
        Key,
        until
    } = require('selenium-webdriver');
    var driver;
    jest.setTimeout(60000);
    beforeEach(async() => {
        driver = await new Builder()
            .forBrowser('chrome')
            .build();
    });

    afterEach(() => {
        driver.quit();
    });

    it('Abre la página de inicio y accede con el usuario test@a.com', async() => {
        await driver.get(process.env.SKUID_HOST);
        await driver.wait(until.titleContains("Evenfy"), 10000);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("email")).sendKeys(process.env.SKUID_UN, Key.TAB);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("password")).sendKeys(process.env.SKUID_PW, Key.TAB);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("entrar")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("cerrar")).click();
        await driver.sleep(TIMEOUT)
    });

});