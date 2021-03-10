> This is a minimal example of how to use Findify` [Agent](https://github.com/findify/findify-js/tree/develop/packages/agent) + [React-connect](https://github.com/findify/findify-js/tree/develop/packages/react-connect) in [Next.js](https://nextjs.org/learn) app.

## Setup
```bash
yarn add @findify/react-connect @findify/change-emitter universal-cookie
```

### Create Feature creator
Example could be found in `./components/Findify.js`

### Create feature
```javascript
const Search = createWidgetCreator('[feature type]', '[API key]')
```
### Request data on server
```javascript
export async function getServerSideProps({ req, query }) {
  const state = await Search.request({
    req: req, // Request provides cookies on the server
    params: {
      q: query && query.q || '' // Request parameters eq. query, filters, rules
    }
  });
  return {
    props: { state },
  }
}

```

