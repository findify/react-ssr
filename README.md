> This is a minimal example of how to use Findify` [Agent](https://github.com/findify/findify-js/tree/develop/packages/agent) + [React-connect](https://github.com/findify/findify-js/tree/develop/packages/react-connect) in [Next.js](https://nextjs.org/learn) app.


Findify SDK and Agent already includes server-side request logic. This repo will explain you how to separate Agents on server, make request including cookies and reuse response on client side.

## Setup
```bash
yarn add @findify/react-connect @findify/change-emitter universal-cookie
```

## Create Feature
Example of feature creator could be in `./components/Findify.js`. Feel free to modify the code, but keep in mind - you need to provide same user props on backend and client.

```javascript

// Will prepare closure with Agent and Provider for specific feature
// Analytics instance will be automatically created inside Provider and provided down via React context
const Search = createWidgetCreator('[widget type]', '[API key]')

 // Make request on Server and pick user from req.headers.cookies
export async function getServerSideProps({ req, query }) {
  // Request Body
  const params = undefined || { q: query && query.q || '' };
  // Persistent request params that will be merged with request params on every request
  // `slot` for smart-collections and recommendations should be passed here
  const defaults = undefined || {};
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

All the connectors has analog as hook eq: `connectItems` = `useItems`. Hooks returning the same object as mixed to children props in HOCs.

## How To
### Listen state update
```js
() => {
  const { query } = useQuery();
  useEffect(() => {
    console.log('Query has been changed')
  }, [query])
  return null
}
```
### Update other Agent
```js
const Search = createWidgetCreator('[widget type]', '[API key]')

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
() => {
  const { analytics } = useConfig();
  analytics.sendEvent('view-page', { ... })
}
```

### Update cart event
Should be sent after product has been added to the cart and contain the whole cat content
```javascript
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
  const { items } = useItems();
  return items.map((item) =>
    <a onClick={() => item.sendAnalytics()} key={item.hashCode()}>
      {item.get('title')}
    </a>
  )
```
In case you would like to send analytics manually from out of Provider tree you can create analytics instance by your self:
[Analytics Reference](https://developers.findify.io/page/findify-analytics#setup) 
