> This is a minimal example of how to use Findify` [Agent](https://github.com/findify/findify-js/tree/develop/packages/agent) + [React-connect](https://github.com/findify/findify-js/tree/develop/packages/react-connect) in [Next.js](https://nextjs.org/learn) app.


Findify SDK and Agent already include server-side request logic. This repo will explain how to separate Agents on server, make request that include cookies and reuse response on the client side.

## Setup
```bash
yarn add @findify/react-connect @findify/change-emitter universal-cookie
npm i @findify/react-connect @findify/change-emitter universal-cookie
```

## Create Feature
Feature is an instance of Search, Autocomplete, Recommendation or Smart Collection.
An axample of feature creator can be found in `./components/Findify.js`. 
Feel free to modify the code, but keep in mind - you need to provide the **same user props** on the backend and the client.

```javascript

// We are preparing closure with Agent and Provider for specific feature
// Analytics instance will be automatically created inside Provider and provided down via React context
const Search = createWidgetCreator('[widget type]', '[API key]');

 // Make request on Server and pick user from req.headers.cookies
export async function getServerSideProps({ req, query }) {
  // Optional Request Body
  const params = { q: query && query.q || '' };
  
  // Optional persistent request params that will be merged with request params on every request
  // `slot` for smart-collections and recommendations should be passed here
  const defaults = { slot: 'collections/some-collections' };
  
  const state = await Search.request({
    req, // Required if you need to pick user from cookies on server
    params,
    defaults
  });
  
  return {
    props: { state, defaults, params },
  }
}

```

## Component
`createWidgetCreator` returns 'Provider' component which contains logic for state rehydration. [READ MORE](https://developers.findify.io/page/findify-react-connect-reference) about Findify` connections and providers

```javascript
const Search = createWidgetCreator('[widget type]', '[API key]')

return ({ state, defaults }) => {
  return (
    <Search.Provider cache={state} defaults={defaults}>
    { 
      // Children here are able to connect to the feature state
    }
    </Search.Provider>
  )
}
```

You can also add `config` to providers prop. This prop will be available in all connects and hooks.

You can use either HOC or a Hook version of connector as they return the same props (`connectItems` = `useItems`).

## How To

### Listen to state update
```js
import { useQuery } from '@findify/react-connect'

... 

() => {
  const { query } = useQuery();
  useEffect(() => {
    console.log('Query has been changed')
  }, [query])
  return null
}
```
### Update Agent in some component

```js
const Search = createWidgetCreator('[widget type]', '[API key]')

...

() => {
  return (
    <input onChange={(e) => Search.getAgent().set('q', e.target.value)}/>
  )
}
```

---
You can find more information and cases of connectors and hooks in our [react-components](https://github.com/findify/findify-js/tree/develop/packages/react-components) repository.


### Send analytics

Every connector or hook returns `{ analytics }` instance which could be used to send events to Findify

> Basic example
```js
import { useConfig } from '@findify/react-connect'
() => {
  const { analytics } = useConfig();
  analytics.sendEvent('view-page', { ... })
}
```

### Update cart event
Should be sent after product has been added to the cart and contain the whole cat content
```javascript
import { useConfig } from '@findify/react-connect'
const { analytics } = useConfig();
analytics.sendEvent('update-cart', {
    line_items: [ // Array of products
      {
        item_id: "PRODUCT_ID_1",
        quantity: 1,
        unit_price: 22.35,
        variant_item_id: "VARIANT_ID_1"
      }
    ]
 });
```
### Purchase event

```javascript
import { useConfig } from '@findify/react-connect'

const { analytics } = useConfig();
 analytics.sendEvent('purchase', {
    currency: "EUR",
    line_items: [// Array of products
      {
        item_id: "PRODUCT_ID_1",
        quantity: 1,
        unit_price: 288.28,
        variant_item_id: "VARIANT_ID_1"
      },
    ],
    order_id: "ORDER_ID",
    revenue: 288.28
 });
```
### View page event
Should be sent every time user lands on the product page
```javascript
const { analytics } = useConfig();
 analytics.sendEvent('view-page', {
  item_id: "PRODUCT_ID",
  variant_item_id: "PRODUCT_VARIANT_ID"
 })
```
### Product click event
Product Item contains `sendAnalytics` method by calling which all necessary data will be send to Findify
```javascript
import { useItems } from '@findify/react-connect'
  const { items } = useItems();
  return items.map((item) =>
    <a onClick={() => item.sendAnalytics()} key={item.hashCode()}>
      {item.get('title')}
    </a>
  )
```
if you want to send analytics outside of Provider, you can create analytics instance manually.
[Analytics Reference](https://developers.findify.io/page/findify-analytics#setup) 
