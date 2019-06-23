module.exports = {
  siteMetadata: {
    title: `金流百科`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/data`,
      },
    },
    `gatsby-transformer-json`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: "gatsby-source-apiserver",
      options: {
        typePrefix: `elections`,
        enableDevRefresh: true,
        url: `http://35.184.76.205/api/v1/graphql`,
        data: {},
        method: `get`,
        headers: {
          "Content-Type": "application/json"
        },
        auth: false,
        entitiesArray: [
          {
            name: `JsonData`,
            entityLevel: `data.all`,
            params: {
              query: `{ all{ name, regions{ name, constituencies{ name, candidates{ name, partyName, isElected, numOfVote, rateOfVote, finance{ income{ total, items{ name, amount } }, outcome{ total, items{ name, amount } } } } } } } }`
            },
          },
          // {
          //   url: `http://35.184.76.205/api/v1/graphql`,
          //   name: `President2016`,
          //   entityLevel: `data.election`,
          //   params: {
          //     query: `{ election(etype: "president", year: 2016){ name, regions{ name, constituencies{ name, candidates{ name, partyName, isElected, numOfVote, rateOfVote, finance{ income{ total, items{ name, amount } }, outcome{ total, items{ name, amount } } } } } } } }`
          //   },
          // },
        ]
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
