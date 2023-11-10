# Shop Creating and Managing Platform
Platform which allow external user to create his own shops and manage it <u>like in polish the best portals: **Allegro** and **OLX**</u>. Wrote in Svelte gives you the best feelings.
Behaves fully as polish substitiutes like: `Allegro`, `Ceneo`, `OLX`, `Otomoto` but is writed in better, what means simplier and fater way throught ***Svelte*** and it best **Meta-Farmework *SvelteKit***.

## **Tech Stack:**
- Languages:
    * Rust - For height efficient processing datas,
    * JavaScript:
        * TypeScript,
        * Node.js,
        * Svelte,

- Frameworks:
    * JavaScript Frontend:
        * SvelteKit - SSR routing,
    * Node.js backend:
        * Express.js -REST Handling
    * TailwindCSS - For modern layout styles managing,

- Svelte libraries:
    * Skeleton - Svelte Components library,
    * Flowobite - Svelte Component Library

    1. Both are using TailwindCSS for styling
    
- Databases:
    * Cassandra,
    * MongoDB,
    * Redis

- Other Tools:
    - Container's virtaulization:
        - Docker,
    - Message Broker:
        - RabbitMQ with AMQP
    
    
## Data base's cases:
- *MongoDB* is for:
    * Shop creator itself user account data saving in `users` collection,

- *Cassandra* is for:
    - Use keyspace with name `shop_creator` where saves such tables:
        * **`shop`** - which save data about each in app shop,
        * **`items`** - which save data about items from each shop with meta data like ammount

- *Redis* is for:
    - Store and take actions on each logged-in user session under key ``

# Apperance Examples:
<!-- <details>
    <summary>Expandable - Click to look</summary>
</details> -->
- Fashion Shop Create:
    - Step 1/3
    ![Create Shop - Basic data refill](/docs/making-shop-start.png)
    - Step 2/3
    ![Create Shop - Select Shop Aperance](/docs/making-shop-select-layout.png)
    - Step 3/3
    ![Create Shop - Connect With Fin-Tech](/docs/making-shop-connect-stripe-requirement.png)
        - Some side effects:
            1. Checking - User can have already assigned Fin-Tech datas to account (e.g: durning other shop creation)
            ![Create Shop - Checking Fin-Tech Connected](/docs/making-shop-checking-user-stripe-linked.png)
            2. After user clicks on `Connect Stripe` button, will be arriving this, before redirect to Stripe form:
            ![Create Shop - Redirecting to Fin-Tech](/docs/making-shop-redirecting-to-stripe-connect.png)
    - Step Last, Finish Line
    ![Finish of Shop Creationg Process](/docs/making-shop-finishline.png)
- Managing Shop:
    - Shop Panel
    ![Shop Panel Root](/docs/managing-shop-panel.png)
    - Manage Shop Items Panel and Items List Not filled
    ![Manage Shop Items and List](/docs/managing-shop-items-list-and-actions-panel.png)
    - Adding new Item
        1. Not filled
        ![Not filled](/docs/managing-panel-add-new-item.png)
        2. Filled
        ![1/4 Filled](/docs/managing-panel-add-item-filled-1.png)
        ![2/4 Filled](/docs/managing-items-filled-2.png)
        ![3/4 Filled](/docs/managing-items-filled-3.png)
        ![4/4 Filled](/docs/managing-items-filles-4.png)
        3. Information is added
        ![Information Added](/docs/managing-items-item-has-been-added-to-shop.png)
    - Manage Shop Items Panel and Items List filled
    ![Manage Shop Items and List](/docs/managing-items-shop-is-filled.png)
- Created Shop Abreviated Overview
    - Items List (Recently added item is only into shop)
    ![Added Items List](/docs/fashion-shop-itenms-preview.png)
    - Search stripe
    ![Shop Created Search stripe](/docs/fashion-shop-searchstripe.png)
    - Selected Item
        1. First glance
        ![First Glance](/docs/shop-item-apperance-preview-1.png)
        2. Second glance
        ![Seconf Glance](/docs/shop-item-apperaance-preview-2.png)
- Ordering in shop
    1. Select Size of Selected item
    ![Selected Size Previewed item](/docs/shop-item-apperance-preview-3-item-size-selected.png)
    2. Information Item is added to basket
    ![Information item is in basket](/docs/shop-item-added-to-basket-advertisement.png)
    3. Shop Basket with item added prior and marked up as loved
    ![Shop Basket](/docs/shop-order-basket.png)
    4. Order Payment = Order finalization (After such step user will be redirecting to Stripe Fin-Tech page for payment)
        - Not erased
        ![Order Payment Not filled](/docs/order-payment-didn't-erased.png)
        - Erased
        ![Order Payment Erased](/docs/order-payment-did-erased.png)

# Copyrights
MIT
