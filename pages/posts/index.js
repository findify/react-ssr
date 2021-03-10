import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'
import { createWidgetCreator } from '../../components/Findify'
import { useItems } from '@findify/react-connect'
import { Grid, Item } from '../../components/ProductCard';

const RenderItems = () => {
  const { items } = useItems();
  return (
    <Grid>
      {
        items
          .map(i => <Item key={i.hashCode()} item={i} />)
          .toArray()
      }
    </Grid>
  )
}

const Search = createWidgetCreator('search', {
  key: '680d373d-06b3-442b-bebc-d35a5b0868b3',
  user: { uid: "IQnXnYbY9f5FDRIn", sid: "A3Y0uoRK5H8S0vv0" }
})

export default function FirstPost({ state }) {
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
      <h1>Second page</h1>
      <Search.Provider cache={state}>
        <RenderItems />
      </Search.Provider>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </Layout>
  )
}

export async function getStaticProps({ preview = false }) {
  const state = await Search.request(undefined, { q: 'white trr trr' });
  return {
    props: { state: state.toJS() },
  }
}
