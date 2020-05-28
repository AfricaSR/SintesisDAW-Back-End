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

    it('Abre la página de Bienestar y edita el registro', async() => {
        await driver.get('http://localhost:4200');
        await driver.wait(until.titleContains("Evenfy"), 10000);

        await driver.findElement(By.name("email")).sendKeys("test@a.com", Key.TAB);

        await driver.findElement(By.name("password")).sendKeys("1234", Key.TAB);

        await driver.findElement(By.name("entrar")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("cerrar")).click();

        await driver.findElement(By.name("wellness")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("editar")).click();
        await driver.sleep(TIMEOUT)
        if (driver.findElement(By.id("a6")).getAttribute("checked") != null) {
            driver.findElement(By.name("Soja")).click();
        }
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("guardar")).click();
        await driver.sleep(TIMEOUT)

    });

});