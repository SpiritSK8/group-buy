import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import json
import re

async def scrape_fairprice_promotions():
    MAX_SCROLL_ATTEMPTS = 10
    DELAY_BEFORE_SCROLLING = 2 # In seconds.

    async with async_playwright() as p:
#################### Begin opening FairPrice website, scrolling it, and saving the HTML content ####################
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("https://www.fairprice.com.sg/promotions", timeout=180000)
        
        # Dynamic scrolling to load all content.
        previous_height = -1
        scroll_attempts = 0
        while True:
            await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await page.wait_for_load_state("domcontentloaded") # Wait for DOM to be loaded after scroll.
            await asyncio.sleep(DELAY_BEFORE_SCROLLING) # Add a short delay to allow page to re-render.

            scroll_attempts += 1
            if scroll_attempts > MAX_SCROLL_ATTEMPTS: # Limit scroll attempts to prevent scrolling infinitely.
                print("Max scroll attempts reached.")
                break

        html_content = await page.content()
        await browser.close()

        # Save HTML content to a file for debugging
        # with open("fairprice_promotions_scrolled.html", "w", encoding="utf-8") as f:
        #     f.write(html_content)
        # print("Saved scrolled HTML to fairprice_promotions_scrolled_html.html.")

#################### Begin filtering HTML for promotion data ####################
        soup = BeautifulSoup(html_content, "html.parser")

        promotions = []

        # Find all product links that contain promotion information
        # Each product is wrapped in an <a> tag.
        product_links = soup.find_all("a", href=lambda href: href and "/product/" in href)
        print(f"Found {len(product_links)} product links.")

        for link in product_links:
            product_name = "N/A"
            product_link = "N/A"
            amount_to_buy = "N/A"
            discounted_price = "N/A"
            original_price = "N/A"
            image_url = "N/A"

            # Extract product name.
            name_element = link.find("span", class_="sc-ab6170a9-1 gpnjpI")
            if name_element:
                product_name = name_element.get_text(strip=True)

            # Extract link to product.
            product_link = "https://www.fairprice.com.sg" + link["href"]

            # Extract purchase quantity and total price from the orange label at the top of each product card.
            promotion_element = link.find("div", class_="sc-cc97bfa8-0 jLNtCe inline")
            if not promotion_element:
                continue

            '''
            Example of a promotion label:

            <div class="sc-cc97bfa8-0 jLNtCe inline">
                <span></span>
                <strong>Any 2</strong>   <--- quantity
                <span> At $1.80</span>   <--- total price
            </div>

            Hence the quantity is at index 1, while total discounted price is at index 2.
            '''
            # Extract amount to buy.
            amount_to_buy_element = promotion_element.contents[1]
            if amount_to_buy_element:
                amount_to_buy_text = amount_to_buy_element.get_text(strip=True)
                amount_to_buy_match = re.search(r"\b(?:Any|Buy) (\d+)", amount_to_buy_text) # Remove "Any " or "Buy " from the front.
                if not amount_to_buy_match:
                    continue
                amount_to_buy = int(amount_to_buy_match.group(1))
                if amount_to_buy < 2:
                    continue # This item is sold in single quantities, not a bulk promotion.

            # Extract discounted price.
            discounted_price_element = promotion_element.contents[2]
            if discounted_price_element:
                discounted_price_text = discounted_price_element.get_text(strip=True)
                discounted_price_match = re.search(r"\bAt \$(\d+(?:\.\d+)?)", discounted_price_text) # Remove "At $" from the front.
                if not discounted_price_match:
                    continue
                discounted_price = float(discounted_price_match.group(1)) / amount_to_buy # Get discounted price of individual item.

            # Extract original price.
            original_price_element = link.find("span", class_="sc-ab6170a9-1 sc-65bf849-1 gDJNWQ cXCGWM")
            if original_price_element:
                original_price = original_price_element.get_text(strip=True)
                original_price = float(original_price[1:]) # Remove the $ sign at the beginning.

            # Extract size of one item (e.g. 500g, 600mL, 12 packs).
            size_of_one_element = link.find("span", class_="sc-ab6170a9-1 jkDBep")
            if size_of_one_element:
                size_of_one = size_of_one_element.get_text(strip=True)

            # Extract image URL.
            image_element = link.find("img", class_="sc-aca6d870-0 janHcI")
            if image_element and "src" in image_element.attrs:
                image_url = image_element["src"]

            promotions.append({
                "productName": product_name,
                "productLink": product_link,
                "amountToBuy": amount_to_buy,
                "discountedPrice": discounted_price,
                "originalPrice": original_price,
                "sizeOfOne": size_of_one,
                "imageUrl": image_url
            })
            
        return promotions

if __name__ == "__main__":
    promos = asyncio.run(scrape_fairprice_promotions())
    print("Found", len(promos), "product links with bulk buy promotions.")
    with open("promotions.json", "w", encoding="utf-8") as f:
        f.write(json.dumps(promos, indent=2))
    print("Saved scraped promotions in promotions.json.")
