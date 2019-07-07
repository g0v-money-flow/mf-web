import React from 'react'
import { Link } from "gatsby"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import RegionsLinks from "../../components/regions_links"
import styles from "../../stylesheets/constituency.module.sass"
import Chart from 'react-google-charts'

const Constituency = ({ pageContext }) => {
  const constituenciesOfRegion = pageContext.constituenciesOfRegion
  const CurrentConstituencyName = () => {
    if (constituenciesOfRegion.length < 2) return null
    return(<h2>{ pageContext.constituency.name }</h2>)
  }
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
        <CurrentConstituencyName />
        <CandidateBlocks candidates={ pageContext.constituency.candidates } />
        <CandidatesFinanceCompareChart candidates={ pageContext.constituency.candidates } />
      </div>
    </Layout>
  )
}


export const ConstituenciesOfRegion = ({ electionSlug, constituencies, regionName }) => {
  const constituencyLinks = constituencies.map((constituency) => (
    <ConstituencyLink electionSlug={ electionSlug } regionName={ regionName } constituencyName={ constituency.name} />
  ))
  if (constituencies.length < 2) return null
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
        <div className={ styles.candidateInfo }>
          <div>
            <h6>{ candidate.partyName }</h6>
            <h1>
              <Link to={ `/candidates/${candidate.alternative_id}` } className={ styles.candidateName }>
                { candidate.name }
              </Link>
            </h1>
          </div>
          <div>
            <h6>得票數:{ candidate.numOfVote }</h6>
            <h6> 得票率: { `${candidate.rateOfVote}%` } </h6>
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
      total: 0,
      items: [{ name: '無資料', amount: 0 }]
    },
    outcome: {
      total: 0,
      items: [{ name: '無資料', amount: 0 }]
    }
  }
  let financeData = new CandidateFinanceData(finance)
  return (
    <div className={ styles.candidateFinanceBlock }>
      <div className={ styles.candidateFinanceDetailBlock }>
        <Chart
          height={'100px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={ 
            [financeData.incomeTitles, financeData.incomeAmounts ]
          }
          options={{
            title: null,
            isStacked: 'relative',
            hAxis: {
              textPosition: 'none',
              minValue: 0,
            },
            legend: { position: 'none' },
            series: {
              0: { color: '#A61C35' },
              1: { color: '#CFE4EB' },
              2: { color: '#013A40' },
              3: { color: '#262522' },
              4: { color: '#F2F2F2' }
            },
          }}
        />
        <h6>總收入: { financeData.incomeTotal }</h6>
      </div>
      <div className={ styles.candidateFinanceDetailBlock }>
        <Chart
          height={'100px'}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data = {
            [financeData.outcomeTitles, financeData.outcomeAmounts]
          }
          options={{
            title: null,
            isStacked: 'relative',
            hAxis: {
              textPosition: 'none',
              minValue: 0,
            },
            legend: {
              position: 'none'
            },
            series: {
              0: { color: '#A61C35' },
              1: { color: '#CFE4EB' },
              2: { color: '#013A40' },
              3: { color: '#262522' },
              4: { color: '#F2F2F2' }
            }
          }}
        />
        <h6>總支出: { financeData.outcomeTotal }</h6>
      </div>
    </div>
  )
}

export const CandidatesFinanceCompareChart = ({ candidates }) => {
  const candidateFinanceDatas = candidates.map((candidate) => {
    let finance = candidate.finance || {
      income: {
        total: 0,
        items: [
          { name: "個人捐贈收入", amount: 0 },
          { name: "營利事業捐贈收入", amount: 0 },
          { name: "政黨捐贈收入", "amount": 0 },
          { name: "人民團體捐贈收入", amount: 0 },
          { name: "匿名捐贈", amount: 0 },
          { name: "其他收入", amount: 0 }
        ]
      },
      outcome: {
        total: 0,
        items: [
          { name: "人事費用支出", amount: 0 },
          { name: "宣傳支出", amount: 0 },
          { name: "租用宣傳車輛支出", amount: 0 },
          { name: "集會支出", amount: 0 },
          { name: "交通旅運支出", amount: 0},
          { name: "雜支支出", amount: 0 },
          { name: "返還支出", amount: 0 },
          { name: "繳庫支出",amount: 0 },
          { name: "公共關係費用支出", amount: 0 }
        ]
      }
    }
    return new CandidateFinanceData(finance, candidate.name)
  })
  const incomeTitles = candidateFinanceDatas[1].incomeTitles
  const outcomeTitles = candidateFinanceDatas[1].outcomeTitles
  const incomeDatas = candidateFinanceDatas.map((candidateFinanceData) => (candidateFinanceData.incomeAmounts))
  const outcomeDatas = candidateFinanceDatas.map((candidateFinanceData) => (candidateFinanceData.outcomeAmounts))
  incomeDatas.unshift(incomeTitles)
  outcomeDatas.unshift(outcomeTitles)
  return(
    <div className={ styles.candidatesFinanceCompareChart }>
      <div className={ styles.candidatesFinanceCompareChartWrapper }>
        <Chart
              chartType="ColumnChart"
              height={'600px'}
              loader={<div>Loading Chart</div>}
              data={ incomeDatas }
              options={{
                title: null,
                isStacked: true,
                vAxis: {
                  textPosition: 'none',
                  minValue: 0,
                },
                legend: {
                  position: 'none'
                },
                series: {
                  0: { color: '#A61C35' },
                  1: { color: '#CFE4EB' },
                  2: { color: '#013A40' },
                  3: { color: '#262522' },
                  4: { color: '#F2F2F2' },
                  5: { color: '#F2F2F2' }
                }
              }}
            />

      </div>
      <div className={ styles.candidatesFinanceCompareChartWrapper }>
        <Chart
              chartType="ColumnChart"
              height={'600px'}
              loader={<div>Loading Chart</div>}
              data={ outcomeDatas }
              options={{
                title: null,
                isStacked: true,
                vAxis: {
                  textPosition: 'none',
                  minValue: 0,
                },
                legend: {
                  position: 'none'
                },
                series: {
                  0: { color: '#A61C35' },
                  1: { color: '#CFE4EB' },
                  2: { color: '#013A40' },
                  3: { color: '#262522' },
                  4: { color: '#F2F2F2' },
                  5: { color: '#F2F2F2' },
                  6: { color: '#F2F2F2' },
                  7: { color: '#F2F2F2' }
                }
              }}
            />

      </div>
    </div>
  )
}

class CandidateFinanceData {
  constructor(financeData, candidateName) {
    let incomeTitles = financeData.income.items.map((item) => (item.name))
    let incomeAmounts = financeData.income.items.map((item) => (item.amount))
    candidateName = candidateName || ''
    incomeTitles.unshift('收入分佈')
    incomeAmounts.unshift(`${candidateName}收入分佈`)
    this.incomeTitles = incomeTitles
    this.incomeAmounts = incomeAmounts
    let outcomeTitles = financeData.outcome.items.map((item) => (item.name))
    let outcomeAmounts = financeData.outcome.items.map((item) => (item.amount))
    outcomeTitles.unshift('支出分佈')
    outcomeAmounts.unshift(`${candidateName}支出分佈`)
    this.outcomeTitles = outcomeTitles
    this.outcomeAmounts = outcomeAmounts
    this.incomeTotal = new Intl.NumberFormat('zh-Hans-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(financeData.income.total)
    this.outcomeTotal = new Intl.NumberFormat('zh-Hans-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(financeData.outcome.total)
  }
}

export default Constituency
