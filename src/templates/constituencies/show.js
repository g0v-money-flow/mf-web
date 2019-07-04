import React from 'react'
import { Link } from "gatsby"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import RegionsLinks from "../../components/regions_links"
import styles from "../../stylesheets/constituency.module.sass"
import Chart from 'react-google-charts'

const Constituency = ({ pageContext }) => {
  return(
    <Layout>
      <Link to="/elections/">{'< 返回'}</Link>
      <div>
        <h1>{ pageContext.election.title } - { pageContext.regionName }</h1>
        <RegionsLinks regions={ pageContext.election.regions }
                      urlPrefix={ pageContext.urlPrefix } />
        <ConstituenciesOfRegion electionSlug={ pageContext.election.name.toLowerCase().replace(/\s/g, '-') }
                                constituencies={ pageContext.constituenciesOfRegion }
                                regionName={ pageContext.regionName } />
        <h2>{ pageContext.constituency.name }</h2>
        <CandidateBlocks candidates={ pageContext.constituency.candidates } />
      </div>
    </Layout>
  )
}


export const ConstituenciesOfRegion = ({ electionSlug, constituencies, regionName }) => {
  const constituencyLinks = constituencies.map((constituency) => (
    <ConstituencyLink electionSlug={ electionSlug } regionName={ regionName } constituencyName={ constituency.name} />
  ))
  return(
    <ul className={ styles.constituenciesLinks}>
      { constituencyLinks }
    </ul>
  )
}

export const ConstituencyLink = ({ electionSlug, regionName, constituencyName }) => (
  <li className={ styles.constituencyLink}>
    <Link to={`elections/${electionSlug}/regions/${regionName}/constituencies/${constituencyName}`}>{ constituencyName }</Link>
  </li>
)

export const CandidateBlocks = ({ candidates }) => {
  if(candidates === null) { return <div>沒有候選人</div> }

  const cbs = candidates.map((candidate) => (
    <CandidateBlock candidate={candidate} />
  ))
  return(
    <div className={ styles.candidateBlocks }>
      { cbs }
    </div>
  )
}

export const CandidateBlock = ({ candidate }) => {
  const ElectedLabel = () => (candidate.isElected ? <span className={styles.isElected}>當選</span> : null)
  return (
    <div className={styles.candidateBlockWrapper}>
      <ElectedLabel />
      <div className={ styles.candidateBlock }>
        <div>
          <h6>{ candidate.partyName }</h6>
          <h1>
            <Link to={ `/candidates/${candidate.alternative_id}` } className={ styles.candidateName }>
              { candidate.name }
            </Link>
          </h1>
          <div>
            <h6>得票數:{ candidate.numOfVote }</h6>
            <h6> 得票率: { candidate.rateOfVote } </h6>
          </div>
        </div>
        <CandidateFinanceBlock finance={ candidate.finance } />
      </div>
    </div>
  )
}

export const CandidateFinanceBlock = ({ finance }) => {
  finance = finance || {
    income: {
      total: '無資料',
      items: [{ name: '無資料', amount: 0 }]
    },
    outcome: {
      total: '無資料',
      items: [{ name: '無資料', amount: 0 }]
    }
  }
  let incomeTitles = finance.income.items.map((item) => (item.name))
  let incomeAmounts = finance.income.items.map((item) => (item.amount))
  incomeTitles.unshift('收入分佈')
  incomeAmounts.unshift('收入分佈')
  let outcomeTitles = finance.outcome.items.map((item) => (item.name))
  let outcomeAmounts = finance.outcome.items.map((item) => (item.amount))
  outcomeTitles.unshift('支出分佈')
  outcomeAmounts.unshift('支出分佈')
  return (
    <div className={ styles.candidateFinanceBlock }>
      <div className={ styles.candidateFinanceDetailBlock }>
        <Chart
          width={'360px'}
          height={'100px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={ [incomeTitles, incomeAmounts ]}
          options={{
            title: null,
            chartArea: { width: '100%' },
            isStacked: 'percent',
            hAxis: {
              title: '金額',
              minValue: 0,
            }
          }}
        />
        <div>總收入: { finance.income.total }</div>
      </div>
      <div className={ styles.candidateFinanceDetailBlock }>
        <Chart
          width={'360px'}
          height={'100px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={ [outcomeTitles, outcomeAmounts]}
          options={{
            title: null,
            chartArea: { width: '100%' },
            isStacked: 'percent',
            hAxis: {
              title: '金額',
              minValue: 0,
            }
          }}
        />
        <div>總支出: { finance.outcome.total }</div>
      </div>
    </div>
  )
}

export default Constituency
