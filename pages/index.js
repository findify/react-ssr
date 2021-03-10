import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { createWidgetCreator } from '../components/Findify'
import { useItems, useQuery } from '@findify/react-connect'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Grid, Item } from '../components/ProductCard';
import { Autocomplete } from '../components/Autocomplete';

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

const HandleMeta = () => {
  const { query, update } = useQuery();
  const router = useRouter();
  useEffect(() => {
    update('q', router.query.q);
  }, [router.query.q])
  return null;
}

export default function Home({ state }) {
  const [q, setQ] = useState('');
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Link href='/posts'>[Go to second page]</Link>
      <div>
        <Autocomplete />
      </div>
      <Search.Provider cache={state} query={{ q }}>
        <HandleMeta />
        <RenderItems />
      </Search.Provider>
      <section className={utilStyles.headingMd}>
        <p>
          (This is a sample website - you’ll be building a site like this in{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
    </Layout>
  )
}


export async function getStaticProps() {
  const state = await Search.request(undefined, { q: '' });
  return {
    props: { state: state.toJS() },
  }
}
