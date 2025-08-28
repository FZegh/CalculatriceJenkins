const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testCalculatrice() {

     let options = new chrome.Options()
        .addArguments('--headless')                   // mode headless
        .addArguments('--no-sandbox')    // utile pour Docker
        .addArguments('--disable-dev-shm-usage');
 
    // Initialiser le driver Chrome
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // --- Accéder au site ---
        await driver.get('http://localhost:8080/index.html');

        // --- Test 1 : Addition ---
        let nombre1 = await driver.findElement(By.id('number1'));
        let nombre2 = await driver.findElement(By.id('number2'));
        let operation = await driver.findElement(By.id('operation'));
        let boutonCalculer = await driver.findElement(By.id('calculate'));
        let resultat = await driver.findElement(By.id('result'));

        // Saisir les valeurs
        await nombre1.sendKeys("2");
        await nombre2.sendKeys("3");
        await operation.sendKeys("Addition");

        // Cliquer sur calculer
        await boutonCalculer.click();

        // Attendre 2 secondes pour voir le résultat
        await driver.sleep(2000);

        // Lire et afficher le résultat
        let valeurResultat = await resultat.getText();
        console.log("Résultat Addition :", valeurResultat);

        // Vider les champs pour le test suivant
        await nombre1.clear();
        await nombre2.clear();

        // --- Test 2 : Division par zéro ---
        await nombre1.sendKeys("3");
        await nombre2.sendKeys("0");
        await operation.sendKeys("Division");
        await boutonCalculer.click();
        await driver.sleep(2000);
        console.log("Résultat Division :", await resultat.getText());

        await nombre1.clear();
        await nombre2.clear();

        // --- Test 3 : Entrée non valide ---
        await nombre1.sendKeys("5");
        await nombre2.sendKeys("3");
        await operation.sendKeys("Adition"); // faute volontaire pour test
        await boutonCalculer.click();
        await driver.sleep(2000);
        console.log("Résultat Entrée non valide :", await resultat.getText());

        await nombre1.clear();
        await nombre2.clear();

        // --- Test 4 : Soustraction ---
        await nombre1.sendKeys("7");
        await nombre2.sendKeys("3");
        await operation.sendKeys("Soustraction");
        await boutonCalculer.click();
        await driver.sleep(2000);
        console.log("Résultat Soustraction :", await resultat.getText());

    } finally {
        // Fermer le navigateur
        await driver.quit();
    }
})();
