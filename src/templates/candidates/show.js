import React from 'react'
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Chart from 'react-google-charts'
import styles from "../../stylesheets/candidate.module.sass"
import { CandidatesFinanceCompareChart } from "../../components/candidate_finance_data"
import { FaAngleDown } from 'react-icons/fa'



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
