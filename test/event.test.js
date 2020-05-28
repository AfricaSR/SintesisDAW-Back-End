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

    it('Abre los eventos y hace como que va a crear uno, pero luego lo cierra', async() => {
        await driver.get('http://localhost:4200');
        await driver.wait(until.titleContains("Evenfy"), 10000);

        await driver.findElement(By.name("email")).sendKeys("test@a.com", Key.TAB);

        await driver.findElement(By.name("password")).sendKeys("1234", Key.TAB);

        await driver.findElement(By.name("entrar")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("cerrar")).click();

        await driver.findElement(By.name("events")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("create")).click();
        await driver.sleep(TIMEOUT)
        element = driver.findElement(By.name("cancel"));
        driver.executeScript("arguments[0].scrollIntoView()", element);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("cancel")).click();
        await driver.sleep(TIMEOUT)

    });

});