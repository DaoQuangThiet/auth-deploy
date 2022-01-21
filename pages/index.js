import React from 'react'
import { Container, Grid } from '@mui/material';
// slider
import SwipeableTextMobileStepper from '../components/slider';
// end slider

// product
import Product from '../components/product';
// end product tabs

// newlistimg
import NewImageList from '../components/newlistimg';
// end newlistimg

// imglist
import SellerImageList from '../components/imglist';
// end imglist

// form Email
import NameForm from '../components/formEmail';
// end  form Email

//import request data
import client from '../libs/apollo/ApolloClient';
import gql from 'graphql-tag';
import { AppContext } from '../libs/context/AppContext';
import { AppProvider } from '../libs/context/AppContext';
import DealsOfDay from '../components/DealsOfDay';
import Tab from '../components/tab';
import TabSeller from '../components/tabSeller';
import Logo from '../components/tabsLogo';

const PRODUCT_QUERY = gql`query Product($cat:String!, $cat1:String! ){
  first:products(first: 8,where: {category: $cat}) {
    nodes {
      id
      databaseId
      name
      description
      slug
      image {
        uri
        srcSet
        sourceUrl
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        variations {
          nodes {
            price
          }
        }
      }
    }
  }
  second:products(where:  {category: $cat1 orderby: {field: TOTAL_SALES, order: DESC}}, first: 8) {
    nodes {
      id
      image {
        sourceUrl
        title
      }
      name
      slug
      ... on SimpleProduct{
        price
        regularPrice
      }
      ... on VariableProduct {
        price
        regularPrice
      }
    }
  }
}`;


const Home = (props) => {
  const { products, productseller } = props;
  return (
    <AppProvider>
      <div>
        <SwipeableTextMobileStepper />
        <DealsOfDay />
        <Container>
          <Tab />
          <Grid container spacing={{ sm: 2, md: 2, xs: 4, lg: 3 }} columns={{ xs: 4, sm: 6, md: 4, lg: 4 }}>
            {products.length ? (
              products.map(product => <Product key={product.id} product={product} />)
            ) : ''}
          </Grid>
        </Container>

        <NewImageList />
        <Container>
          <TabSeller />
          <Grid container spacing={{ sm: 2, md: 2, xs: 4, lg: 3 }} columns={{ xs: 4, sm: 6, md: 4, lg: 4 }}>
            {productseller.length ? (
              productseller.map(product => <Product key={product.id} product={product} />)
            ) : ''}
          </Grid>
        </Container>
        <SellerImageList />
        <Logo/>
        <NameForm/>
      </div>
    </AppProvider>
  )
}

export default Home;
// Home.getServerSideProps = async (context) => {
//   console.log(context);
//   const result = await client.query({
//     query: PRODUCT_QUERY
//   });

//   return {
//     products: result.data.first.nodes,
//     productseller: result.data.second.nodes,
//   }
// }
export async function getServerSideProps({ query }) {
  const cat = query.cat ? query.cat : "";
  const cat1 = query.cat1 ? query.cat1 : "";
  const result = await client.query({
    query: PRODUCT_QUERY,
    variables: {
      cat, cat1
    },
  });
  return {
    props: {
      products: result.data.first.nodes,
      productseller: result.data.second.nodes,
    },
  };
}