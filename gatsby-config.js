require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `金流百科`,
    description: `將全面公開政治獻金、公投募款專戶金流，並與政府標案連結、視覺化，除了清楚的刻畫權力分配外，也利用簡單易理解的圖像，檢視各公職候選人、公投領銜人間的資源差距。`,
    author: `g0v Money Flow Group`,
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
        icon: `src/images/coin.svg`, // This path is relative to the root of the site.
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
