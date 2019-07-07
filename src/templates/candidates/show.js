import React from 'react'
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Chart from 'react-google-charts'
import { CandidatesFinanceCompareChart } from "../../components/candidate_finance_data"


const Candidate = ({ pageContext }) => {
  let incomeRecords
  let outcomeRecords
  if (pageContext.candidate.finance_data !== null) {
    incomeRecords = pageContext.candidate.finance_data.income.top300
    outcomeRecords = pageContext.candidate.finance_data.outcome.top300
  } else {
    incomeRecords = []
    outcomeRecords = []
  }
  const incomeData = incomeRecords.map((record) => (
    [record.type, record.object, record.amount]
  ))
  const outcomeData = outcomeRecords.map((record) => (
    [record.object, record.type, record.amount]
  ))
  incomeData.unshift(['From', 'To', '金額'])
  outcomeData.unshift(['To', 'From', '金額'])
  return(
    <Layout>
      <Link to={pageContext.prevPath}>{'< 返回'}</Link>
      <h1>{ pageContext.candidate.name }</h1>
      <h3>{ pageContext.candidate.party }</h3>
      <p>得票數:{ pageContext.candidate.num_of_vote } / 得票率:{pageContext.candidate.rate_of_vote } </p>
      <div style={{
            display: `flex`,
            margin: `0 auto`,
            maxWidth: 960,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
          }}>
        <Chart
          forceIFrame={false}
          width={480}
          height={'2000px'}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={incomeData}
          rootProps={{ 'data-testid': '1' }}
        />
        <Chart
          forceIFrame={false}
          width={480}
          height={'2000px'}
          chartType="Sankey"
          loader={<div>Loading Chart</div>}
          data={outcomeData}
          rootProps={{ 'data-testid': '2' }}
        />
      </div>
      <hr />
      <CandidatesFinanceCompareChart candidates={ pageContext.constituency.candidates} />
    </Layout>
  )
}

export default Candidate
