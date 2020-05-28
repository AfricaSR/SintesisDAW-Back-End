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

    it('Cambia la contraseña del usuario (aunque realmente pone la misma)', async() => {
        await driver.get('http://localhost:4200');
        await driver.wait(until.titleContains("Evenfy"), 10000);

        await driver.findElement(By.name("email")).sendKeys("test@a.com", Key.TAB);

        await driver.findElement(By.name("password")).sendKeys("1234", Key.TAB);

        await driver.findElement(By.name("entrar")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("cerrar")).click();

        await driver.findElement(By.name("profile")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("change")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("cp")).sendKeys("1234", Key.TAB);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("np")).sendKeys("1234", Key.TAB);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("rnp")).sendKeys("1234", Key.TAB);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("save")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("cerrar")).click();
        await driver.sleep(TIMEOUT)

    });

});