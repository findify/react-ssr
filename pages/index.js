import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import { createWidgetCreator } from '../components/Findify'
import { useItems, useQuery } from '@findify/react-connect'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Grid, Item } from '../components/ProductCard';
import { Autocomplete } from '../components/Autocomplete';

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

const HandleMeta = () => {
  const { update } = useQuery();
  const router = useRouter();
  const initial = useRef(true);

  useEffect(() => {
    // Avoid first time search rerendering
    if (initial.current) return initial.current = false;
    update('q', router.query.q);
  }, [router.query.q])
  return null;
}

export default function Home({ state }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Link href='/posts'>[Go to second page]</Link>
      <div>
        <Autocomplete />
      </div>
      <Search.Provider cache={state}>
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

export async function getServerSideProps({ req, query }) {
  const state = await Search.request({
    req: req,
    params: {
      q: query && query.q || ''
    }
  });
  return {
    props: { state: state },
  }
}
