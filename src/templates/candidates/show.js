import React from 'react'
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Chart from 'react-google-charts'
import styles from "../../stylesheets/candidate.module.sass"
import { CandidatesFinanceCompareChart, CandidateFinanceData, incomeColorsSet, outcomeColorsSet } from "../../components/candidate_finance_data"
import { FaAngleDown } from 'react-icons/fa'

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

const Candidate = ({ pageContext }) => {
  let incomeRecords
  let outcomeRecords
  if (pageContext.candidate.finance_data !== null) {
    incomeRecords = pageContext.candidate.finance_data.income.top100
    outcomeRecords = pageContext.candidate.finance_data.outcome.top100
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
      <CandidateBlock candidate={ pageContext.candidate } />
      <div style={{
            display: `flex`,
            margin: `0 auto`,
            maxWidth: 1280,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0,
            justifyContent: `space-around`
          }}>
        { incomeData.length === 1 ? <h6>沒有資料</h6> :(
            <Chart
              forceIFrame={false}
              width={640}
              height={'2000px'}
              chartType="Sankey"
              loader={<div>Loading Chart</div>}
              data={incomeData}
              options = {
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
          ) }
        { outcomeData.length === 1 ? <h6>沒有資料</h6> :(
          <Chart
            forceIFrame={false}
            width={640}
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
        ) }
      </div>
      <h3>標案資料</h3>
      <TendersTablesWrapper tenders={ pageContext.candidate.tenders } />
      <hr />
      <CandidatesFinanceCompareChart candidates={ pageContext.constituency.candidates} />
    </Layout>
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
              <th width={"35%"}>{ this.props.tender.name } </th>
              <th width={"35%"}>總金額: { this.props.totalAmount } 元</th>
              <th width={"15%"}>{ this.props.rowSpan } 件標案</th>
              <th width={"15%"} className={ styles.dropdownToggler } onClick={this.toggleTenderList}><FaAngleDown /></th>
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
          <td>{ item.unit_name }</td>
          <td>{ item.title }</td>
          <td>{ itemAmount }</td>
          <td className={styles.decisionDate}>{ item.decisionDate }</td>
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
