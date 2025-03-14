const puppeteer = require("puppeteer");
const fs = require("fs");
const { scrapeProductDetails } = require("./scraper");

//main page
const CATALOGUE_URL = "http://www.purfluxgroupcatalog.com/catalogues/FO/scripts/accueil.php?zone=FR&catalogue=PFX&lang=GB";

//utility function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 *main function to scrape the catalogue and save product details
 */
async function scrapeCatalogue() {
    //launch browser and open a new page
    console.log("🚀 Launching browser...");
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    try {
        //navigate to the main catalogue page
        console.log("🌐 Navigating to the catalogue page...");
        await page.goto(CATALOGUE_URL, { waitUntil: "networkidle2" });

        //click Reference tab to reveal the dropdown
        await page.waitForSelector('a[href="#menu4"]', { visible: true, timeout: 60000 });
        await page.click('a[href="#menu4"]');
        await page.waitForSelector('#menu4.active.in', { visible: true, timeout: 10000 });

        //wait for the dropdown to load and ensure it has options
        const dropdownSelector = 'select[name="ref_filtre"]';
        await page.waitForFunction(
            (selector) => {
                const dropdown = document.querySelector(selector);
                return dropdown && dropdown.options.length > 1;//ensure dropdown has items
            },
            { timeout: 60000 },
            dropdownSelector
        );

        //extract prod references from the dropdown
        console.log("📦 Extracting product references...");
        const productReferences = await page.evaluate((selector) => {
            const options = Array.from(document.querySelector(selector).options);
            return options.map(option => option.value).filter(value => value !== "");
        }, dropdownSelector);

        if (productReferences.length === 0) {
            console.error("❌ No product references found. Exiting...");
            await browser.close();
            return;
        }

        //extract the first 110 items from the dropdown
        const itemsToScrape = productReferences.slice(0, 110);
        const allProductDetails = [];

        //loop through the items and scrape their details
        for (let i = 0; i < itemsToScrape.length; i++) {
            const selectedItem = itemsToScrape[i];

            console.log(`\n🧐 Extracting IAM_PN for: ${selectedItem}...`); // Log the item being extracted

           
            const productUrl = `https://www.purfluxgroupcatalog.com/catalogues/FO/scripts/cat_fich_filtre.php?zone=FR&catalogue=PFX&lang=GB&ref_filtre=${selectedItem}&searchref=&old_marque=`;

            // Navigate to the prod page
            await page.goto(productUrl, { waitUntil: "networkidle2" });

            //scrape prod details
            console.log("🔍 Scraping product details...");
            const productDetails = await scrapeProductDetails(page);

            //add prod details to the array with a label
            allProductDetails.push({
                label: i + 1, // Add label starting from 1
                ...productDetails // Spread the product details
            });

            console.log(`👍 Completed extraction for IAM_PN: ${selectedItem}`);

            //go back to the main catalogue page for the next prod
            await page.goto(CATALOGUE_URL, { waitUntil: "networkidle2" });

            //re-click Reference tab to reset state
            await page.waitForSelector('a[href="#menu4"]', { visible: true, timeout: 60000 });
            await page.click('a[href="#menu4"]');

            //wait for Reference tab to become active again
            await page.waitForSelector('#menu4.active.in', { visible: true, timeout: 10000 });

            //wait for dropdown to load again
            await page.waitForFunction(
                (selector) => {
                    const dropdown = document.querySelector(selector);
                    return dropdown && dropdown.options.length > 1; // Ensure dropdown has items
                },
                { timeout: 60000 },
                dropdownSelector
            );
        }

        // Save all product details --> output.json
        console.log("\n💾 Saving data to output.json...");
        fs.writeFileSync("output.json", JSON.stringify(allProductDetails, null, 2));

        console.log("✅ Data has been saved to output.json!");

        console.log("🚪 Closing the browser...");
        await browser.close();
    } catch (error) {
        console.error("❌ An error occurred:", error.message);
        await browser.close();
    }
}

// Run the script
scrapeCatalogue();