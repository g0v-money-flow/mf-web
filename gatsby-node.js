/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const axios = require(`axios`)

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
                alternative_id
                isElected
                name
                numOfVote
                partyName
                rateOfVote
                detailLink
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
  `);
  let candidatesQuery = []
  if (results.error) {
    console.error('Oh sh_t!')
    return
  }

  results.data.allElectionsJsonData.nodes.forEach((node) => {
    const election = node
    switch(election.name) {
      case '2016 Legislator Election':
        election.title = '2016 立法委員選舉'
        break;
      case '2016 President Election':
        election.title = '2016 總統選舉'
        break;
      default:
        election.title = election.name
    }

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
        constituency.candidates.forEach((candidate) => {
          candidatesQuery.push({
            prevPath: `${urlPrefix}/regions/${region.name}/constituencies/${constituency.name}`,
            data: candidate
          })
        })
      })
    })
  })
  await Promise.all(candidatesQuery.map(async (candidate) => {
    const candidateDetail = await axios.get(`${process.env.API_ENDPOINT}/${candidate.data.detailLink}`)
      createPage({
        path: `candidates/${candidate.data.alternative_id}`,
        component: require.resolve('./src/templates/candidates/show.js'),
        context: {
          candidate: candidateDetail.data.data,
          prevPath: candidate.prevPath
        }
      })
  }))
}
