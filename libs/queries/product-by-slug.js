import { gql } from "@apollo/client";

export const PRODUCT_BY_SLUG_QUERY = gql` query Product($slug: ID!) {
	product(id: $slug, idType: SLUG) {
	  id
	  productId: databaseId
	  averageRating
      sku
	  slug
	  description
      shortDescription
	  related (first: 4) {
		nodes {
		  image {
			sourceUrl
			srcSet
		  }
		  name
		  id
		  slug
		  ... on VariableProduct {
			price
			regularPrice
		  }
		  ... on SimpleProduct {
			price
			regularPrice
		  }
		}
	  }
      productCategories {
        nodes {
            name
        }
    }
	  galleryImages {
          nodes {
            id
            title
            altText
            mediaItemUrl
          }
      }
	  image {
		id
		uri
		title
		srcSet
		sourceUrl
	  }
	  name
	  ... on SimpleProduct {
		price
		id
		regularPrice
	  }
	  ... on VariableProduct {
		price
		id
		regularPrice
	  }
	  ... on ExternalProduct {
		price
		id
		regularPrice
		externalUrl
	  }
	  ... on GroupProduct {
		products {
		  nodes {
			... on SimpleProduct {
			  id
			  price
			  regularPrice
			}
		  }
		}
		id
	  }
	}
  }
`;

export const PRODUCT_SLUGS = gql` query Products {
  products(first: 5000) {
    nodes {
      id
      slug
    }
  }
}
`;
