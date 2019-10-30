import React from 'react'
import styles from "../stylesheets/constituency.module.sass"
import Chart from 'react-google-charts'
export const incomeColorsSet = ['#70add1', '#fec58c', '#e49ea2', '#8b8181', '#c6e1c2']
export const outcomeColorsSet = ['#70add1', '#b4cedf', '#fc8916', '#fee8d0', '#e49ea2', '#f0cacd', '#8b8181', '#cbcbcb', '#c6e1c2', '#eaf4e9']

export class ReferendumFinanceData {
  constructor(financeData, referendumName) {
    let incomeTitles = financeData.income.items.map((item) => (item.name))
    let incomeAmounts = financeData.income.items.map((item) => (item.amount || 0))
    referendumName = referendumName || ''
    incomeTitles.unshift('收入分佈')
    incomeAmounts.unshift(referendumName)
    this.incomeTitles = incomeTitles
    this.incomeAmounts = incomeAmounts
    let outcomeTitles = financeData.outcome.items.map((item) => (item.name))
    let outcomeAmounts = financeData.outcome.items.map((item) => (item.amount || 0))
    outcomeTitles.unshift('支出分佈')
    outcomeAmounts.unshift(referendumName)
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

export const ReferendumFinanceBlock = ({ finance }) => {
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
  let financeData = new ReferendumFinanceData(finance)
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

export const ReferendumsFinanceCompareChart = ({ referendums }) => {
  const referendumFinanceDatas = referendums.map((referendum) => {
    let finance = referendum.finance || {
      income: {
        total: 0,
        items: [
          { name: "個人捐贈收入", amount: 0 },
          { name: "營利事業捐贈收入", amount: 0 },
          { name: "政黨或人民團體捐贈收入", "amount": 0 },
          { name: "募集活動收入", amount: 0 },
          { name: "其他收入", amount: 0 }
        ]
      },
      outcome: {
        total: 0,
        items: [
          { name: "宣傳類支出", amount: 0 },
          { name: "宣傳車輛類支出", amount: 0 },
          { name: "辦事處類支出", amount: 0 },
          { name: "集會類支出", amount: 0 },
          { name: "交通旅運類支出", amount: 0 },
          { name: "雜支類支出", amount: 0}
        ]
      }
    }
    return new ReferendumFinanceData(finance, referendum.no)
  })
  const incomeTitles = referendumFinanceDatas[0].incomeTitles
  const outcomeTitles = referendumFinanceDatas[0].outcomeTitles
  const incomeDatas = referendumFinanceDatas.map((referendumFinanceData) => (referendumFinanceData.incomeAmounts))
  const outcomeDatas = referendumFinanceDatas.map((referendumFinanceData) => (referendumFinanceData.outcomeAmounts))
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
