import styled from '@emotion/styled'
import Link from 'next/link'

const Container = styled.div`
  width: 25%;
  padding: 0 5px;
`

const Image = styled.img``
const Title = styled.h4``

export const Grid = styled.section`
  display: flex;
  align-items: top;
  flex-wrap: wrap;
`
export const Item = ({ item }) => {
  return (
    <Container>
      <Image src={item.get('image_url')} />
      <Link href={item.get('product_url')} onClick={item.onClick}>
        <Title>{item.get('title')}</Title>
      </Link>
    </Container>
  )
}
