import React from 'react'
import { Link } from "gatsby"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import style from "../../stylesheets/constituency.module.css"

const Constituency = ({ pageContext }) => {
  const regions = pageContext.election.regions.map((region) =>
    <Link to={ `${pageContext.urlPrefix}/regions/${region.name}/constituencies/${region.constituencies[0].name}` }>{ region.name }</Link>
  )
  return(
    <Layout>
      <div>
        <h1>{ pageContext.election.name }</h1>
        <div>{ regions }</div>
        
        <ConstituenciesOfRegion electionSlug={ pageContext.election.name.toLowerCase().replace(/\s/g, '-') }
                                constituencies={ pageContext.constituenciesOfRegion }
                                regionName={ pageContext.regionName } />
        <h1>{ pageContext.constituency.name }</h1>
        
        <CandidateBlocks candidates={ pageContext.constituency.candidates } />
      </div>
    </Layout>
  )
}


export const ConstituenciesOfRegion = ({ electionSlug, constituencies, regionName }) => {
  const constituencyLinks = constituencies.map((constituency) => (
    <Link to={`elections/${electionSlug}/regions/${regionName}/constituencies/${constituency.name}`}>{ constituency.name }</Link>
  ))
  return(
    <ul>
      { constituencyLinks }
    </ul>
  )
}

export const CandidateBlocks = ({ candidates }) => {
  if(candidates === null) { return <div>沒有候選人</div> }

  const cbs = candidates.map((candidate) => (
    <CandidateBlock candidate={candidate} />
  ))
  return(
    <div className={ style.candidateBlocks }>
      {cbs}
    </div>
  )
}

export const CandidateBlock = ({ candidate }) => {
  const isElected = candidate.isElected ? '(當選)' : ''
  return (
    <div className={ style.candidateBlock }>
      <h6 >{ candidate.partyName }</h6>
      <h1 className={ style.candidateName }>{ candidate.name }</h1>
      <h6>得票數:{ candidate.numOfVote } / 得票率: { candidate.rateOfVote }</h6>
      <CandidateFinanceBlock finance={ candidate.finance } />
    </div>
  )
}

export const CandidateFinanceBlock = ({ finance }) => {
  finance = finance || {
    income: {
      total: '無資料',
      items: []
    },
    outcome: {
      total: '無資料',
      items: []
    }
  }
  return (
    <div className={ style.candidateFinanceBlock }>
      <div className={ style.candidateFinanceDetailBlock }>
        <div></div>
        <div>總收入: { finance.income.total }</div>
      </div>
      <div className={ style.candidateFinanceDetailBlock }>
        <div></div>
        <div>總支出: { finance.outcome.total }</div>
      </div>
    </div>
  )
}

export default Constituency
