/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.createPages = async({ actions: { createPage }, graphql }) => {
  const results = await graphql(`
    {
      allElectionsJsonData(filter: { name: { ne: null } }) {
        nodes {
          name
          regions {
            name
            constituencies {
              name
              candidates {
                isElected
                name
                numOfVote
                partyName
                rateOfVote
                finance {
                  income {
                    total
                  }
                  outcome {
                    total
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  if (results.error) {
    console.error('Oh sh_t!')
    return
  }

  results.data.allElectionsJsonData.nodes.forEach((node) => {
    const election = node
    election.regions.forEach((region) => {
      region.constituencies.forEach((constituency) => {
        const urlPrefix = `elections/${election.name.toLowerCase().replace(/\s/g, '-')}`
        createPage({
          path: `${urlPrefix}/regions/${region.name}/constituencies/${constituency.name}`,
          component: require.resolve('./src/templates/constituencies/show.js'),
          context: {
            urlPrefix: urlPrefix,
            election: election,
            regionName: region.name,
            constituenciesOfRegion: region.constituencies,
            constituency: constituency
          }
        })
      })
    })
  })
}
