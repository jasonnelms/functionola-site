# FunctioNola | Mock Ecommerce Storefront

A complete, mobile-responsive **student business project** storefront inspired by the supplied FunctioNola packaging concept. Built with plain HTML, CSS, and JavaScript. No framework, build step, paid service, payment account, or backend is required.

## What works

- Responsive storefront with the original FunctioNola concept artwork
- Maple Pecan and Peanut Butter Chocolate, offered as bar and pouch mock SKUs
- Shop all / bar / pouch filters, product details, quantity stepper
- Add-to-bag interactions, persistent browser-local cart, subtotals, illustrative shipping offer
- 2-step **mock** checkout with read-only fictional shipping details, review, and simulated order confirmation
- FAQ, brand story, mobile navigation, accessibility labels, keyboard-friendly native dialogs

**Important:** All product prices ($3.49/bar; $12.99/pouch), shipping ($4.95, free over $35), and order details are fabricated for classroom demonstration and should be reviewed with the student before presentation. Packaging image includes nutrition/wellness claims that have not been verified. The site does not state these claims as facts outside the supplied visual. Real sales would require ingredient/allergen validation, legal review, and proper commercial hosting.

## Privacy and mock checkout

- There is **no actual commerce**. No payments, contact with a payment gateway, emails, or order processing.
- Cart quantities are saved in `localStorage` for convenient classroom demonstrations.
- Shipping information is prefilled with fictional, read-only examples (Alex Example, 123 Pretend Lane) and cannot be changed. **No personal data is collected, transmitted, or saved.**
- The confirmation screen makes clear that no real purchase took place.

## Publish using GitHub Pages

1. Create a **public** repository in GitHub, preferably `functionola-site`. Keep it separate from unrelated websites.
2. Upload all files and the `assets` folder to the repository **root**. Do not upload only the ZIP.
3. Go to **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, branch `main`, folder `/(root)`; click Save.
4. The URL should be `https://YOUR-USERNAME.github.io/functionola-site/` after Pages deployment is complete.
5. Open the site on desktop and mobile. Add a bar to the bag, change quantity, open checkout, and complete a fake order.

If GitHub Pages isn't available, check the repository visibility, repository permissions, and account settings.

## Edit the products and prices

Open `app.js` and edit the `products` array near the top of the file. `price` is a number without a dollar sign. The shipping rules are in the `shipping` function, and price display uses `money`.

For more images, replace files in `assets/`, keeping the same filenames (or update `app.js`).

## Files

- `index.html` — home, shop, FAQ, and checkout modal markup
- `styles.css` — responsive design
- `app.js` — product list, shopping bag, demo checkout
- `assets/` — optimized crops from the provided packaging artwork and favicon
- `.nojekyll` — tells GitHub Pages to serve the files as-is

### GitHub Pages note

GitHub Pages is appropriate for a **course-project storefront demonstration**, not for a site primarily hosting a commercial e-commerce business. If FunctioNola becomes a real seller, move to hosting and commerce tools that permit actual transactions.
