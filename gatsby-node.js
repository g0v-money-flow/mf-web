/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

exports.createPages = async({ actions: { createPage }, graphql }) => {
  const results = await graphql(`
    {
      allElectionJson {
        edges {
          node {
            name
            regions {
              name
              constituencies {
                name
                candidates {
                  name
                  partyName
                  isElected
                  rateOfVote
                  finance {
                    income {
                      total
                      items {
                        name
                        amount
                      }
                    }
                    outcome {
                      total
                      items {
                        name
                        amount
                      }
                    }
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

  results.data.allElectionJson.edges.forEach((edge) => {
    const election = edge.node
    election.regions.forEach((region) => {
      region.constituencies.forEach((constituency) => {
        createPage({
          path: `elections/${election.name.toLowerCase().replace(/\s/g, '-')}/regions/${region.name}/constituencies/${constituency.name}`,
          component: require.resolve('./src/templates/constituencies/show.js'),
          context: {
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
