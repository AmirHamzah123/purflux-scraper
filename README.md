# Purflux Scraper 🚀

A **web scraper** built with **Puppeteer** that extracts detailed product information from the **Purflux Group Catalogue**. The extracted data is saved in a structured JSON file (`output.json`) for further analysis.

## **📌 Table of Contents**

- [Project Overview](#project-overview)
- [Installation](#installation)
- [How to Run the Application](#how-to-run-your-application)
- [Project Approach](#project-approach)
- [Output Example](#output-file-structure)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## **📌 Project Overview**

This scraper automates data extraction from the [Purflux Group Catalogue](https://www.purfluxgroupcatalog.com/catalogues/FO/scripts/accueil.php?zone=FR&catalogue=PFX&lang=GB). It performs the following tasks:
✅ Navigates to the **Purflux Catalogue**  
✅ Extracts relevant **product details**, such as:

- **Product Code (IAM_PN)**
- **Product Name**
- **Brand**
- **Dimensions (Height, Length, Width)**
- **OE Part Numbers**
- **Vehicle Application Details**
- **Product Image URL**
  ✅ **Stores the data in a structured JSON format** (`output.json`)

---

## **📥 Installation**

To set up the project on your local machine:

### **Prerequisites**

- **Node.js** (Download from [nodejs.org](https://nodejs.org/))
- **Git** (Download from [git-scm.com](https://git-scm.com/))

### **1️⃣ Clone this Repository**

Open your terminal and run:

```sh
git clone https://github.com/AmirHamzah123/purflux-scraper.git
cd purflux-scraper
```

2️⃣ Install Dependencies
Run the following command to install the required packages:
npm install
This will install:
-puppeteer (for browser automation)
-fs (for file handling)

🚀 How to Run Your Application
Once everything is installed, follow these steps to run the scraper:

1️⃣ Open your terminal and navigate to the project directory:

sh-> cd purflux-scraper

2️⃣ Run the scraper

sh-> node index.js
This will:
-Launch a headless browser.
-Navigate to the Purflux Group Catalogue.
-Extract product references and scrape their details.
-Save the extracted data in a structured JSON format.

3️⃣ View the Extracted Data
After the script completes execution, you can find the extracted product details in:

output.json
This file contains all the scraped product details in JSON format.

---

🔍 Overview of the Approach
1️⃣ Open the Purflux Group Catalogue.
2️⃣ Select the "Reference" tab and extract all available product references.
3️⃣ Navigate to each product’s page and extract:

-IAM_PN
-Product Name
-Product Line
-Dimensions (Height, Length, Width)
-OE Part Numbers
-Vehicle Applications
4️⃣ Store the extracted data in output.json in a structured format.
