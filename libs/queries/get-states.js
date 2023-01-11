import gql from "graphql-tag";
const GET_STATES = gql`
  query GET_STATES($countryCode: String!) {
    wooStates(countryCode: $countryCode) {
      states {
        stateCode
        stateName
      }
    }
  }
`;

export default GET_STATES;
