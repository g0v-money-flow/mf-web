import React from 'react'
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Chart from 'react-google-charts'


const Candidate = ({ pageContext }) => {
  let outcomeRecords
  if (pageContext.candidate.finance_data !== null) {
    outcomeRecords = pageContext.candidate.finance_data.outcome.top300
  } else {
    outcomeRecords = []
  }
  const outComeData = []
  if (outcomeRecords !== null) {
    outcomeRecords.forEach((record) => {
      outComeData.push([record.type, record.object, record.amount])
    })
  }
    // Object.keys(candidateOutcome).forEach((type) => {
  //   const records = candidateOutcome[type].records
  //   if (records.length !== 0) {
  //     records.forEach((record) => {
  //       outComeData.push([type, record.object, record.amount])
  //     })
  //   } else {
  //     const itemsCount = parseInt(candidateOutcome[type].item_count)
  //     const sum = parseInt(candidateOutcome[type].sum)
  //     const avg = sum / itemsCount
  //     outComeData.push([type, `共 ${ itemsCount } 筆款項，平均每筆 ${avg} 元`, sum])
  //   }
  // })
  outComeData.unshift(['From', 'To', '金額'])
  return(
    <Layout>
      <Link to={pageContext.prevPath}>{'< 返回'}</Link>
      <h1>{ pageContext.candidate.name }</h1>
      <h3>{ pageContext.candidate.party }</h3>
      <p>得票數:{ pageContext.candidate.num_of_vote } / 得票率:{pageContext.candidate.rate_of_vote } </p>
      <Chart
        forceIFrame={true}
        width={300}
        height={'2000px'}
        chartType="Sankey"
        loader={<div>Loading Chart</div>}
        data={outComeData}
        rootProps={{ 'data-testid': '1' }}
      />
    </Layout>
  )
}

export default Candidate
