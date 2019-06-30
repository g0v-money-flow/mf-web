import React from 'react'
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Chart from 'react-google-charts'


const Candidate = ({ pageContext }) => {
  if (pageContext.candidate.finance_data != null) {
    const candidateOutcome = pageContext.candidate.finance_data.outcome
  } else {
    const candidateOutcome = {}
  }
  const outComeData = []
  Object.keys(candidateOutcome).forEach((type) => {
    candidateOutcome[type].records.forEach((record) => {
      outComeData.push([type, record.object, record.amount])
    })
  })
  outComeData.unshift(['From', 'To', '金額'])
  return(
    <Layout>
      <Link to={pageContext.prevPath}>{'< 返回'}</Link>
      <h1>{ pageContext.candidate.name }</h1>
      <h3>{ pageContext.candidate.party }</h3>
      <p>得票數:{ pageContext.candidate.num_of_vote } / 得票率:{pageContext.candidate.rate_of_vote } </p>
      <Chart
        width={600}
        height={'1200px'}
        chartType="Sankey"
        loader={<div>Loading Chart</div>}
        data={outComeData}
        rootProps={{ 'data-testid': '1' }}
      />
    </Layout>
  )
}

export default Candidate
