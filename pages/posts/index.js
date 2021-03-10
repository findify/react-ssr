import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/layout'
import { createWidgetCreator } from '../../components/Findify'
import { useItems } from '@findify/react-connect'
import { Grid, Item } from '../../components/ProductCard';

const Search = createWidgetCreator('search', '680d373d-06b3-442b-bebc-d35a5b0868b3')

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

export async function getServerSideProps({ req }) {
  const state = await Search.request({ req, params: { q: 'white trr trr' }});
  return {
    props: { state },
  }
}
