import React from 'react'
import { Link } from "gatsby"
import Layout from "../../components/layout"
import RegionsLinks from "../../components/regions_links"
import styles from "../../stylesheets/constituency.module.sass"
import { CandidateFinanceBlock, CandidatesFinanceCompareChart } from "../../components/candidate_finance_data"
import { CandidateBlock } from '../../components/candidate_block'

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
        <RegionsLinks regions={ pageContext.election.regions }
                      urlPrefix={ pageContext.urlPrefix } />
        <h1>{ pageContext.election.title } - { pageContext.regionName }</h1>
        <ConstituenciesOfRegion electionSlug={ pageContext.election.name.toLowerCase().replace(/\s/g, '-') }
                                constituencies={ pageContext.constituenciesOfRegion }
                                regionName={ pageContext.regionName } />
        <CurrentConstituencyName />
        <CandidateBlocks candidates={ pageContext.constituency.candidates } />
        <hr />
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
    <Link to={`/elections/${electionSlug}/regions/${regionName}/constituencies/${constituencyName}`}>{ constituencyName }</Link>
  </li>
)

export const CandidateBlocks = ({ candidates }) => {
  if(candidates === null) { return <div>沒有候選人</div> }

  const cbs = candidates.map((candidate) => (
    <CandidateBlock candidate={ candidate } />
  ))
  return(
    <div className={ styles.candidateBlocks }>
      { cbs }
    </div>
  )
}

export default Constituency
