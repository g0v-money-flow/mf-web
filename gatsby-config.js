require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

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
        path: `${__dirname}/src/images`,
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
        localSave: false,
        path: `${__dirname}/src/data/`,
        typePrefix: `elections`,
        enableDevRefresh: true,
        url: `${process.env.API_ENDPOINT}/api/v1/graphql`,
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
              query: `{ all { name, year, eType, regions { name, constituencies{ name, candidates { id, name, partyName, isElected, numOfVote, rateOfVote, detailLink, finance{ income{ total, items{ name, amount } }, outcome{ total, items{ name, amount } } } } } } } }`
            },
          },
        ]
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
