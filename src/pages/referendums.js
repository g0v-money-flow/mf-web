import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"
import SEO from "../components/seo"
import styles from '../stylesheets/referendum.module.sass'
import { ReferendumFinanceBlock, ReferendumsFinanceCompareChart } from "../components/referendum_finance_data"

export const query = graphql`
  query {
    allReferendumsJson {
      nodes {
        id
        no
        passed
        rate_of_vote
        affirmative
        negative
        content
        finance {
          income {
            total
            items {
              amount
              name
            }
          }
          outcome {
            total
            items {
              amount
              name
            }
          }
        }
      }
    }
    flagImage: file(relativePath: { eq: "flag.png" }) {
      childImageSharp {
        fixed(width: 36) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

const ReferendumsIndexPage = ({ data }) => {
  const referendumblocks = data.allReferendumsJson.nodes.map((referendum) => {
    return(
      <ReferendumBlock referendum={ referendum } />
    )
  })
  return(
    <Layout>
      <SEO title="公投 | 選舉金流" />
      <h1 className={ styles.pageHeading }>
        <Img fixed={ data.flagImage.childImageSharp.fixed } className={ styles.decorationImage } />
        公投
      </h1>
      { referendumblocks }
      <ReferendumsFinanceCompareChart referendums={data.allReferendumsJson.nodes} />
    </Layout>
  )
}

const ReferendumBlock = ({ referendum }) =>{
  return(
    <div className={ styles.referendumBlock}>
      <h3>{ referendum.no }</h3>
      <div className={ styles.referendumInfoWrapper}>
        <p className={ styles.referendumContent }>{ referendum.content }</p>
        <div>
          <h5>{ referendum.passed ? '通過' : '未通過' }</h5>
          <h6>同意票: {referendum.affirmative }</h6>
          <h6>不同意票: { referendum.negative }</h6>
          <h6>投票率: { referendum.rate_of_vote }</h6>
        </div>
      </div>
      <h5>財務資料:</h5>
      <ReferendumFinanceBlock finance={ referendum.finance } />
      <hr/>
    </div>
  )
}

export default ReferendumsIndexPage
