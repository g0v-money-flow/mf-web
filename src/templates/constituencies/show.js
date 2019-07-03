import React from 'react'
import { Link } from "gatsby"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import RegionsLinks from "../../components/regions_links"
import styles from "../../stylesheets/constituency.module.sass"

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
      {cbs}
    </div>
  )
}

export const CandidateBlock = ({ candidate }) => {
  const ElectedLabel = () => (candidate.isElected ? <span className={styles.isElected}>當選</span> : null)
  return (
    <div className={styles.candidateBlockWrapper}>
      <ElectedLabel />
      <h6>{ candidate.partyName }</h6>
      <div className={ styles.candidateBlock }>
        <div>
          <h1>
            <Link to={ `/candidates/${candidate.alternative_id}`} className={ styles.candidateName }>
              { candidate.name }
            </Link>
          </h1>
        </div>
        <div>
          <h6>得票數:{ candidate.numOfVote }</h6>
          <h6> 得票率: { candidate.rateOfVote } </h6>
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
      items: []
    },
    outcome: {
      total: '無資料',
      items: []
    }
  }
  return (
    <div className={ styles.candidateFinanceBlock }>
      <div className={ styles.candidateFinanceDetailBlock }>
        <div></div>
        <div>總收入: { finance.income.total }</div>
      </div>
      <div className={ styles.candidateFinanceDetailBlock }>
        <div></div>
        <div>總支出: { finance.outcome.total }</div>
      </div>
    </div>
  )
}

export default Constituency
