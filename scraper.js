const puppeteer = require("puppeteer");

/**
 *scrapes product details from the prod page
 * @param {Page} page - puppeteer page object
 * @returns {Object} - aan object containing the scraped prod details
 */
async function scrapeProductDetails(page) {
    try {
        //evaluate the page to extract prod details
        return await page.evaluate(() => {
            //helper function to safely extract text content
            const getTextContent = (element, selector) => {
                const el = element?.querySelector(selector);
                return el ? el.textContent.trim() : "N/A";
            };

            //extract the product name and line from the title
            const titleElement = document.querySelector("h2.title.background4.color1");
            const productName = titleElement?.childNodes[2]?.textContent.trim() || "N/A";
            const productLine = titleElement?.querySelector("span")?.innerText.trim() || "N/A";

            //extract dimensions(height,length,width)
            const dimensions = { height: "N/A", length: "N/A", width: "N/A" };
            document.querySelectorAll(".caracteristics .row1.color3").forEach(row => {
                const text = row.innerText.trim();
                if (text.includes("Height")) dimensions.height = text.replace("Height :", "").trim();
                if (text.includes("Length")) dimensions.length = text.replace("Length :", "").trim();
                if (text.includes("Width")) dimensions.width = text.replace("Width :", "").trim();
            });

            //extract the prod image URL
            const baseURL = "http://www.purfluxgroupcatalog.com/catalogues/import";
            const imageElement = document.querySelector("figure.figure a.thumbnail.fancybox");
            const imageURL = imageElement?.getAttribute("href")?.replace("../../import", baseURL) || "N/A";

            //extract OE part numbers
            const oePartNumbers = Array.from(document.querySelectorAll(".col-xs-3.txtcenter"))
                .map(el => el.innerText.trim())
                .filter(text => text.length > 0);

            //extract vehicle application details
            const vehicleApplications = Array.from(document.querySelectorAll(".row.margin20.row2.txtcontent"))
                .map(row => {
                    const vehicle = getTextContent(row, ".col-xs-2.txtleft a strong");
                    const engineCodes = getTextContent(row, ".col-xs-2.txtcenter:nth-child(2)");
                    const power = getTextContent(row, ".col-xs-2.txtcenter:nth-child(3)");
                    const dateRange = getTextContent(row, ".col-xs-2.txtcenter:nth-child(4)");
                    const engineCode = getTextContent(row, ".col-xs-2.txtcenter.txtupper")?.replace("Engine Code:", "").trim();

                    return `${vehicle} ${engineCodes} ${power} ${dateRange} Engine Code: ${engineCode}`;
                })
                .filter(text => text !== "N/A N/A N/A N/A Engine Code: N/A");

            //return the scraped product details
            return {
                productName,
                productLine,
                dimensions,
                imageURL,
                oePartNumbers,
                vehicleApplications
            };
        });
    } catch (error) {
        // Log the error and return default values
        console.error("❌ Error extracting product details:", error.message);
        return {
            productName: "N/A",
            productLine: "N/A",
            dimensions: { height: "N/A", length: "N/A", width: "N/A" },
            imageURL: "N/A",
            oePartNumbers: [],
            vehicleApplications: []
        };
    }
}

module.exports = { scrapeProductDetails };