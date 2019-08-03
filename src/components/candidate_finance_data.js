import React from 'react'
import styles from "../stylesheets/constituency.module.sass"
import Chart from 'react-google-charts'
export const incomeColorsSet = ['#70add1', '#fec58c', '#e49ea2', '#8b8181', '#c6e1c2']
export const outcomeColorsSet = ['#70add1', '#b4cedf', '#fc8916', '#fee8d0', '#e49ea2', '#f0cacd', '#8b8181', '#cbcbcb', '#c6e1c2', '#eaf4e9']

export class CandidateFinanceData {
  constructor(financeData, candidateName) {
    let incomeTitles = financeData.income.items.map((item) => (item.name))
    let incomeAmounts = financeData.income.items.map((item) => (item.amount))
    candidateName = candidateName || ''
    incomeTitles.unshift('收入分佈')
    incomeAmounts.unshift(candidateName)
    this.incomeTitles = incomeTitles
    this.incomeAmounts = incomeAmounts
    let outcomeTitles = financeData.outcome.items.map((item) => (item.name))
    let outcomeAmounts = financeData.outcome.items.map((item) => (item.amount))
    outcomeTitles.unshift('支出分佈')
    outcomeAmounts.unshift(candidateName)
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
          { name: "租用競選辦事處支", amount: 0 },
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
        <h3>收入比較</h3>
        <Chart
          chartType="ColumnChart"
          height={'600px'}
          loader={<div>Loading Chart</div>}
          data={ incomeDatas }
          options={{
            title: null,
            isStacked: true,
            vAxis: {
              textPosition: 'left',
              minValue: 0,
            },
            legend: {
              position: 'none'
            },
            colors: incomeColorsSet
          }}
        />
      </div>
      <div className={ styles.candidatesFinanceCompareChartWrapper }>
        <h3>支出比較</h3>
        <Chart
          chartType="ColumnChart"
          height={'600px'}
          loader={<div>Loading Chart</div>}
          data={ outcomeDatas }
          options={{
            title: null,
            isStacked: true,
            vAxis: {
              textPosition: 'left',
              minValue: 0,
            },
            legend: {
              position: 'none'
            },
            colors: outcomeColorsSet
          }}
        />
      </div>
    </div>
  )
}
