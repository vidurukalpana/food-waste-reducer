# User Stories

All dates and times use Sri Lanka time (`Asia/Colombo`, UTC+05:30). "Today" means today in Sri Lanka.

| Feature | Stories |
| --- | --- |
| 1. Register, log in | US-01, US-02 |
| 2. Add, edit, delete items | US-03, US-04 |
| 3. Barcode lookup | US-05 |
| 4. Use soon dashboard | US-06 |
| 5. Mark used or wasted | US-07 |
| 6. Recipe ideas | US-08 |
| 7. Daily email reminder | US-09 |
| 8. Monthly summary | US-10 |

---

## US-01 Register

As a new visitor, I want to create an account with my email and a password, so that I can keep my own food list.

**Acceptance criteria**

1. **Given** I am on the register page, **when** I enter a valid email and a password of at least 8 characters, **then** my account is created and I am taken to the login page.
2. **Given** an account already exists for `amal@example.com`, **when** I register with `Amal@Example.com`, **then** I see "Email is already registered" and no new account is created.
3. **Given** I am on the register page, **when** I enter an invalid email or a password shorter than 8 characters, **then** I see an error under that field and the form is not sent.

## US-02 Log in

As a registered user, I want to log in, so that I can see my items from any device.

**Acceptance criteria**

1. **Given** I have an account, **when** I log in with the correct email and password, **then** I am taken to the dashboard.
2. **Given** I have an account, **when** I enter a wrong email or a wrong password, **then** I see "Invalid email or password" without being told which one was wrong.
3. **Given** I am logged in, **when** I refresh the page, **then** I stay logged in.
4. **Given** I am logged in, **when** I click **Log out**, **then** I am taken to the login page and protected pages redirect me to login.

## US-03 Add an item

As a user, I want to add a food item with its expiry date, so that the app can remind me before it expires.

**Acceptance criteria**

1. **Given** I am on the new item form, **when** I enter a name, category, quantity, unit and expiry date and click **Save**, **then** the item appears in my item list.
2. **Given** I am on the new item form, **when** I leave the name empty or the expiry date empty, **then** I see an error under that field and the item is not saved.
3. **Given** I am on the new item form, **when** I enter a quantity of 0 or less, **then** I see "Quantity must be greater than 0".
4. **Given** another user has added items, **when** I open my item list, **then** I see only my own items.

## US-04 Edit or delete an item

As a user, I want to edit or delete an item, so that my list stays correct.

**Acceptance criteria**

1. **Given** I have an item, **when** I change its expiry date and click **Save**, **then** the list shows the new date.
2. **Given** I have an item, **when** I click **Delete** and confirm, **then** the item is removed from my list.
3. **Given** an item belongs to another user, **when** I open its URL, **then** I see "Item not found".

## US-05 Look up a product by barcode

As a user, I want the product name filled in from its barcode, so that adding items is quick.

**Acceptance criteria**

1. **Given** I am on the item form, **when** I type barcode `3017620422003` and click **Look up**, **then** the name and category fields are filled in.
2. **Given** I am on the item form on my phone, **when** I click **Scan** and point the back camera at a barcode, **then** the barcode field is filled, the lookup runs, and the camera turns off.
3. **Given** the barcode is unknown, **when** I click **Look up**, **then** I see "Not found, enter manually" and can type the name myself.
4. **Given** the name was filled from a barcode, **when** I edit any field, **then** my changes are kept.

## US-06 See what to use soon

As a user, I want a dashboard that shows which items expire first, so that I eat them in time.

**Acceptance criteria**

1. **Given** I have active items, **when** I open the dashboard, **then** I see items expiring within 7 days, including expired ones, sorted by expiry date.
2. **Given** today is 2026-11-10 and I have items expiring on 2026-11-09, 2026-11-10 and 2026-11-15, **when** I open the dashboard, **then** they are shown as red "Expired 1 day ago", orange "Expires today" and yellow "5 days left".
3. **Given** today is 2026-11-10 and I have an item expiring on 2026-11-20, **when** I open the dashboard, **then** it is not in the use-soon list but counts as green.
4. **Given** I have active items, **when** I open the dashboard, **then** I see a count of items for each colour.
5. **Given** I open the dashboard on a phone, **when** the page loads, **then** cards fit the screen without sideways scrolling.

## US-07 Mark an item as used or wasted

As a user, I want to mark an item as used or wasted, so that my list shows only food I still have.

**Acceptance criteria**

1. **Given** I have an active item, **when** I click **Used**, **then** it leaves my active list and is counted as used in this month's summary.
2. **Given** I have an active item, **when** I click **Wasted**, **then** it leaves my active list and is counted as wasted in this month's summary.
3. **Given** an item is already marked used or wasted, **when** I try to mark it again, **then** I see "Item is already closed" and nothing changes.

## US-08 Get recipe ideas

As a user, I want recipe ideas for an expiring item, so that I can cook it before it goes bad.

**Acceptance criteria**

1. **Given** I have an item named "chicken", **when** I click **Recipe ideas**, **then** I see up to 6 recipes, each with a photo, name and link.
2. **Given** I see a recipe, **when** I click its link, **then** the recipe opens in a new tab.
3. **Given** I have an item with an unusual name, **when** I click **Recipe ideas**, **then** I see "No recipes found".
4. **Given** an item is orange or red on the dashboard, **when** I look at its card, **then** it has a **Recipe ideas** button.

## US-09 Receive a daily reminder email

As a user, I want an email each morning listing food about to expire, so that I remember to use it without opening the app.

**Acceptance criteria**

1. **Given** reminders are on and I have items that expired or expire within 2 days, **when** it is 7:00 AM, **then** I receive one email listing each item's name, expiry date and status.
2. **Given** I have no items expiring within 2 days, **when** it is 7:00 AM, **then** I receive no email.
3. **Given** I already received today's email, **when** the reminder job runs again the same day, **then** I do not receive a second email.
4. **Given** I switch off **Daily email reminder** in settings, **when** it is 7:00 AM, **then** I receive no email.

## US-10 See a monthly summary

As a user, I want to see how much food I used versus wasted each month, so that I can track my progress.

**Acceptance criteria**

1. **Given** I open the summary page, **when** it loads, **then** it shows the current month by default.
2. **Given** in November I marked 6 items used and 2 wasted, **when** I view November, **then** I see used 6, wasted 2 and a waste rate of 25%.
3. **Given** I marked items in different categories, **when** I view the month, **then** I see the used and wasted counts per category.
4. **Given** I marked an item wasted at 11:30 PM on 30 November Sri Lanka time, **when** I view November, **then** it is counted in November, not December.
5. **Given** I pick a different month, **when** the page updates, **then** the numbers change to that month.
