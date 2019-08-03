import React from 'react'
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../../components/layout"
import Chart from 'react-google-charts'
import styles from "../../stylesheets/candidate.module.sass"
import { CandidatesFinanceCompareChart, CandidateFinanceData, incomeColorsSet, outcomeColorsSet } from "../../components/candidate_finance_data"
import { FaAngleDown } from 'react-icons/fa'

export const query = graphql `
  query {
    billImage: file(relativePath: { eq: "bill.png" }) {
      childImageSharp {
        fixed(width: 96) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

const Colors = ['#70add1', '#fec58c', '#e49ea2', '#8b8181', '#c6e1c2']

export const ElectedLabel = ({ isElected }) => ((isElected ? <h6 className={styles.isElected}>當選</h6> : null))
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
            colors: incomeColorsSet
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
            colors: outcomeColorsSet            
          }}
        />
        <h6>總支出: { financeData.outcomeTotal }</h6>
      </div>
    </div>
  )
}
export const CandidateBlock = ({ candidate }) => {
  return (
    <div className={styles.candidateBlockWrapper}>
      <div className={ styles.candidateBlock }>
        <div className={ styles.candidateInfo }>
          <div className={ styles.candidateNameWrapper }>
            <h6 className={ styles.partyName }>{ candidate.partyName || candidate.party }</h6>
            <h1 className={ styles.candidateName }>
              <Link to={ `/candidates/${candidate.alternative_id}` } className={ styles.candidateName }>
                { candidate.name }
              </Link>
            </h1>
          </div>
          <div className={ styles.votingData }>
            <h6>得票數:{ candidate.numOfVote || candidate.num_of_vote }</h6>
            <h6>得票率: { `${candidate.rateOfVote || candidate.rate_of_vote }%` } </h6>
            <ElectedLabel isElected={ candidate.is_elected } />
          </div>
        </div>
      </div>
      <CandidateFinanceBlock finance={ candidate.finance_data } />
    </div>
  )
}

const Candidate = ({ pageContext, data }) => {
  let incomeTop100Records
  let outcomeTop100Records
  if (pageContext.candidate.finance_data !== null) {
    incomeTop100Records = pageContext.candidate.finance_data.income.top100
    outcomeTop100Records = pageContext.candidate.finance_data.outcome.top100
  } else {
    incomeTop100Records = []
    outcomeTop100Records = []
  }
  const incomeData = incomeTop100Records.map((record) => (
    [record.type, record.object, record.amount]
  ))
  const outcomeData = outcomeTop100Records.map((record) => (
    [record.object, record.type, record.amount]
  ))
  incomeData.unshift(['From', 'To', '金額'])
  outcomeData.unshift(['To', 'From', '金額'])
  return(
    <Layout>
      <Link to={pageContext.prevPath}>{'< 返回'}</Link>
      <CandidateBlock candidate={ pageContext.candidate } />
      <h3 className={ styles.sankeyChartTitle }>百大收支</h3>
      <div style={{
            display: `flex`,
            flexWrap: `wrap`,
            margin: `0 auto`,
            maxWidth: 1280,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
            justifyContent: `center`
          }}>
        { incomeData.length === 1 ? <h6>沒有資料</h6> :(
          <div className={ styles.sankeyChartWrapper } style={{marginRight: `1rem`}}>
            <Chart
              forceIFrame={false}
              width={360}
              height={'2000px'}
              chartType="Sankey"
              loader={<div>Loading Chart</div>}
              data={incomeData}
              options={
                {
                  sankey: {
                    node: {
                      labelPadding: 0,
                      nodePadding: 5,
                      width: 20,
                      colors: ['#70add1', '#fec58c', '#e49ea2', '#8b8181', '#c6e1c2']
                    },
                    link: {
                      colorMode: 'gradient'
                    }
                  }
                }
              }
            />
            <CandidateFinanceTable financeData={ pageContext.candidate.finance_data.income.items } />
          </div>
          ) }
        { outcomeData.length === 1 ? <h6>沒有資料</h6> :(
          <div className={ styles.sankeyChartWrapper } style={{marginLeft: `1rem`}}>
            <Chart
              forceIFrame={false}
              width={360}
              height={'2000px'}
              chartType="Sankey"
              loader={<div>Loading Chart</div>}
              data={outcomeData}
              options = {
                {
                  sankey: {
                    node: {
                      labelPadding: 0,
                      nodePadding: 5,
                      width: 20,
                      colors: Colors
                    },
                    link: {
                      colorMode: 'gradient',
                    }
                  }
                }
              }
            />
            <CandidateFinanceTable financeData={ pageContext.candidate.finance_data.outcome.items } />
          </div>
        ) }
      </div>
      <h3 className={ styles.tendersTableTitle }>
        <Img fixed={ data.billImage.childImageSharp.fixed } className={ styles.decorationImage } />
        <br />
        標案資料
      </h3>
      <TendersTablesWrapper tenders={ pageContext.candidate.tenders } />
      <hr />
      <CandidatesFinanceCompareChart candidates={ pageContext.constituency.candidates} />
    </Layout>
  )
}

const CandidateFinanceTable = ({ financeData }) => {
  const financeDataCells = financeData.map((financeDataItem) => (
    <td>
      <h6>
        { new Intl.NumberFormat('zh-Hans-TW',
            {
              style: 'currency',
              currency: 'TWD',
              minimumFractionDigits: 0
            }
          ).format(financeDataItem.amount) } 元
      </h6>
      <h6>{ financeDataItem.item_count } 筆資料</h6>
      <h6>平均每筆
        { new Intl.NumberFormat('zh-Hans-TW', {
            style: 'currency',
            currency: 'TWD',
            minimumFractionDigits: 0
          }).format(financeDataItem.amount / financeDataItem.item_count )} 元
      </h6>
      <h4>{ financeDataItem.name }</h4>
    </td>
  ))
  return(
    <div className={ styles.candidateFinanceTableWrapper }>
      <table>
        <tr>
          { financeDataCells }
        </tr>
      </table>
    </div>
  )
}

class TendersTablesWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.tenders = this.props.tenders
    this.tendersTables = this.tenders.map((tender) => {
      let totalAmount = new Intl.NumberFormat('zh-Hans-TW', {
        style: 'currency',
        currency: 'TWD',
        minimumFractionDigits: 0
      }).format(tender.total_amount)

      const rowSpan = tender.item.length
      return(
        <TendersTable tender={tender} rowSpan={rowSpan} totalAmount={totalAmount} />
      )
    })
  }

  render() {
    return(
      <div>
        { this.tenders.length === 0 ? <h6>無標案資料</h6> : this.tendersTables }
      </div>
    )
  }
}

class TendersTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = { displayTenderList: false }
    this.toggleTenderList = this.toggleTenderList.bind(this)
  }

  toggleTenderList () {
    this.setState(state => ({
      displayTenderList: !state.displayTenderList
    }))
  }

  render() {
    return(
      <table className={ styles.tendersTable }>
          <thead>
            <tr>
              <th>
                <h3 className={ styles.tenderCompanyName }>{ this.props.tender.name }</h3>
                <h4>{ this.props.rowSpan } 件標案</h4>
                <h4 className={ styles.tenderTotalAmount }>總金額: { this.props.totalAmount } 元</h4>
                <h4 className={ styles.dropdownToggler } onClick={this.toggleTenderList}><FaAngleDown /></h4>
              </th>
            </tr>
          </thead>
          <TendersList tendersList={ this.props.tender.item } display={ this.state.displayTenderList } />
        </table>
    )
  }
}

class TendersList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { display: this.props.display }
    this.tendersList = this.props.tendersList.map((item) => {
      let itemAmount = new Intl.NumberFormat('zh-Hans-TW', {
          style: 'currency',
          currency: 'TWD',
          minimumFractionDigits: 0
        }).format(item.amount)
      return (
        <tr>
          <td>
            <span className={ styles.decisionDate }>{ item.decisionDate }</span>
            <p>{ item.unit_name }</p>
            <p>{ item.title }</p>
            <p className={ styles.itemAmount }>{ itemAmount } 元</p>
          </td>
        </tr>
      )
    })
  }

  render () {
    return(
      <tbody>
        { this.props.display ? this.tendersList : null }
      </tbody>
    )
  }
}

export default Candidate
