/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const axios = require(`axios`)

exports.createPages = async({ actions, graphql }) => {
  const { createPage } = actions
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
      case '2018 Council Election':
        election.title = '2018 縣市議員選舉'
        break;
      case '2018 Mayor Election':
        election.title = '2018 縣市長選舉'
        break;
      case '2014 Mayor Election':
        election.title = '2014 縣市長選舉'
        break;
      case '2014 Council Election':
        election.title = '2014 縣市議員選舉'
        break;
      case '2018 Townshipmayor Election':
        election.title = '2018 鄉鎮市長選舉'
        break;
      case '2018 Villagechief Election':
        election.title = '2018 村里長選舉'
        break;
      case '2018 Townshiprepresentative Election':
        election.title = '2018 鄉鎮市民代表選舉'
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
            data: candidate,
            constituency: constituency
          })
        })
      })
    })
  })

  const threads = []
  const jobAmountPerThread = 100
  let threadAmounts = candidatesQuery.length / jobAmountPerThread
  if(!threadAmounts % 1 === 0) {
    threadAmounts = parseInt(threadAmounts) + 1
  }
  for(i = 0; i < threadAmounts; i++) {
    threads.push([])
  }
  for(index = 0; index <= candidatesQuery.length; index++) {
    var candidate = candidatesQuery[index];
    let remainder = (index + 1) % jobAmountPerThread
    let groupNo = 0
    if(remainder < (index + 1)) {
      groupNo = parseInt((index + 1 - remainder) / jobAmountPerThread)
    }
    if(candidate && candidate.data) {
      threads[groupNo].push(candidate)
    }
  }

  for(let thread of threads) {
    await Promise.all(thread.map(async (candidate) => {
      const candidateDetail = await axios.get(`${process.env.API_ENDPOINT}/${candidate.data.detailLink}`)
      createPage({
        path: `candidates/${candidate.data.alternative_id}`,
        component: require.resolve('./src/templates/candidates/show.js'),
        context: {
          candidate: candidateDetail.data.data,
          prevPath: candidate.prevPath,
          constituency: candidate.constituency
        }
      })
    }))
  }
}
