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

    it('Trata de meterse en un evento que no existe y recibe el error', async() => {
        await driver.get('http://localhost:4200');
        await driver.wait(until.titleContains("Evenfy"), 10000);

        await driver.findElement(By.name("email")).sendKeys("test@a.com", Key.TAB);

        await driver.findElement(By.name("password")).sendKeys("1234", Key.TAB);

        await driver.findElement(By.name("entrar")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("cerrar")).click();

        await driver.findElement(By.name("exchange")).click();
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("evento")).sendKeys("vjgvse", Key.TAB);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("invitacion")).sendKeys("fvvddf", Key.TAB);
        await driver.sleep(TIMEOUT)
        await driver.findElement(By.name("enviar")).click();
        await driver.sleep(TIMEOUT * 3)
        let tag = await driver.findElement(By.className("modal-title")).getText();
        await driver.sleep(TIMEOUT * 3)
        if (tag == "ERROR") {
            console.log('No existe efectivamente este evento')
            await driver.findElement(By.name("cerrar")).click();
            await driver.sleep(TIMEOUT)
        } else {
            await driver.findElement(By.name("cerrar")).click();
            await driver.sleep(TIMEOUT)
        }



    });

});