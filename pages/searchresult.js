import React from "react";
import client from "../libs/apollo/ApolloClient";
import gql from "graphql-tag";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { makeStyles } from "@material-ui/core/styles";
import Product from "../components/product";
import Divider from "@mui/material/Divider";
import { useRouter } from "next/router";

import Banner from "../assets/img/banner_page.png";

const PRODUCT_QUERY = gql`
  query Product($cat: String!) {
    first: products(first: 12, where: { category: $cat }) {
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
  }
`;

const colorHover = "#40c6ff";
const useStyles_pageShop = makeStyles((theme) => ({
  pageShop: {
    marginBottom: "60px",
    minHeight: "200px",
    backgroundImage: `url(${Banner.src})`,
    backgroundSize: "cover",
  },

  titlePage: {
    display: "flex",
    paddingTop: "75px",
    paddingBottom: "75px",
    "@media (max-width: 768px)": {
      display: "block",
    },
  },

  rightTextPage: {
    float: "right",
    "@media (max-width: 768px)": {
      float: "inherit",
    },
  },
  productCategory: {
    display: "flex",
    "@media (max-width: 768px)": {
      display: "flex",
      flexDirection: "column-reverse",
    },
  },
  productCategoryText: {
    marginRight: "25px",
  },
  textCartegory: {
    padding: "10px 0px",
    borderBottom: "1px solid #ccc",
    color: "#676c77",
    transition: "0.21s",
    "& div.MuiTreeItem-content": {
      padding: "0px!important",
      "&:hover": {
        background: "#fff",
      },
      "&:focus": {
        background: "#fff",
      },
      "& svg": {
        color: "#676c77",
      },
    },
    "&:hover": {
      color: "#000",
    },
  },
  titleCartegory: {
    marginBottom: "10px",
    marginTop: "10px",
  },
  titleSideBarCategory: {
    position: "relative",
    borderBottom: " 1px solid #ccc",
    paddingBottom: "15px",
    marginBottom: "20px",
    fontFamily: "Merriweather,sans-serif",
    fontWeight: "bold",
    fontSize: "24px",
    "&:before": {
      position: "absolute",
      content: '""',
      width: "60px",
      height: "1px",
      bottom: "-1px",
      backgroundColor: `${colorHover}`,
    },
  },
  categoryText: {
    marginLeft: "-15px",
  },
  textTile: {
    color: "white",
    fontFamily: "Merriweather",
    fontSize: "50px",
    fontWeight: 700,
  },
  titleText: {
    color: "white",
    fontFamily: "Muli",
    fontWeight: 400,
    fontSize: "14px",
  },
}));

export default function Shop(props) {
  const classes = useStyles_pageShop();
  const { products } = props;
  const router = useRouter();
  const handleSubmit = (value) => {
    //console.log(value);
    router.push(`?cat=${value}`);
  };

  return (
    <Box>
      <Box className={classes.pageShop}>
        <Container>
          <Box className={classes.titlePage}>
            <Grid container spacing={1}>
              <Grid item lg={6} md={6} xs={12}>
                <Box>
                  <Typography
                    className={classes.textTile}
                    component="h3"
                    variant="h3"
                  >
                    Search
                  </Typography>
                </Box>
              </Grid>
              <Grid item lg={6} md={6} xs={12}>
                <Box className={classes.rightTextPage}>
                  <Breadcrumbs sx={{ color: "white" }} aria-label="breadcrumb">
                    <Typography
                      className={classes.titleText}
                      component="h6"
                      variant="h6"
                    >
                      Home
                    </Typography>
                    <Typography
                      className={classes.titleText}
                      component="h6"
                      variant="h6"
                    >
                      Search
                    </Typography>
                  </Breadcrumbs>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Container>
        <Box className={classes.productCategory}>
          <Grid container spacing={1}>
            <Grid item lg={3}>
              <Box>
                <Typography
                  className={classes.titleSideBarCategory}
                  component="h4"
                  variant="h4"
                >
                  Search Results{" "}
                </Typography>
              </Box>

              {/* <TreeView
              aria-label="file system navigator"
              defaultCollapseIcon={<ExpandMoreIcon />}
              defaultExpandIcon={<ChevronRightIcon />}
            > */}
            </Grid>

            <Grid item lg={9}>
              <Grid
                container
                spacing={{ sm: 2, md: 2, xs: 3, lg: 3 }}
                columns={{ xl: 3, sm: 2, md: 3, lg: 3 }}
              >
                {products.length
                  ? products.map((product) => (
                      <Product key={product.id} product={product} />
                    ))
                  : ""}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

// Shop.getInitialProps = async () => {
//   const result = await client.query({
//     query: PRODUCT_QUERY
//   });

//   return {
//     products: result.data.products.nodes,
//   }
// }
export async function getServerSideProps({ query }) {
  const cat = query.cat ? query.cat : "";
  const result = await client.query({
    query: PRODUCT_QUERY,
    variables: {
      cat,
    },
  });
  return {
    props: {
      products: result.data.first.nodes,
    },
  };
}
