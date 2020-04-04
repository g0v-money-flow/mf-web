import React from 'react'
import { Link } from "gatsby"
import styles from "../stylesheets/candidate_block.module.sass"
import { CandidateFinanceBlock } from "./candidate_finance_data"

export const ElectedLabel = ({ isElected }) => ((isElected ? <h6 className={styles.isElected}>當選</h6> : null))

export const CandidateBlock = ({ candidate}) => {
  return (
    <div className={ styles.candidateBlockWrapper }>
      <div className={ styles.candidateBlock }>
        <div className={ styles.candidateInfo }>
          <div>
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
            <ElectedLabel isElected={ candidate.isElected } />
          </div>
        </div>
        <CandidateFinanceBlock finance={ candidate.finance } />
      </div>
    </div>
  )
}

export default CandidateBlock
