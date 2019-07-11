import React from 'react'
import { Link } from "gatsby"
import styles from "../stylesheets/candidate_block.module.sass"
import { CandidateFinanceBlock } from "./candidate_finance_data"

export const CandidateBlock = ({ candidate }) => {
  const ElectedLabel = () => (candidate.isElected ? <span className={styles.isElected}>當選</span> : null)
  return (
    <div className={styles.candidateBlockWrapper}>
      <ElectedLabel />
      <div className={ styles.candidateBlock }>
        <div className={ styles.candidateInfo }>
          <div>
            <h6 className={ styles.partyName }>{ candidate.partyName }</h6>
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

export default CandidateBlock
