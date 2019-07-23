import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Img from "gatsby-image"
import SEO from "../components/seo"
import styles from "../stylesheets/landing_page.module.sass"

export const query = graphql`
  query {
    desktopImage: file(relativePath: { eq: "mainvisual@3x.png" }) {
      childImageSharp {
        fluid(maxWidth: 1440) {
          ...GatsbyImageSharpFluid
        }
      }
    }

    mobileImage: file(relativePath: { eq: "mainvisual-mobile.png" }) {
      childImageSharp {
        fluid(maxWidth: 1440) {
          ...GatsbyImageSharpFluid
        }
      }
    }

    coinImage: file(relativePath: { eq: "index-coin.png" }) {
      childImageSharp {
        fixed(width: 36) {
          ...GatsbyImageSharpFixed
        }
      }
    }

    totalElectionsFinanceAmount: allElectionsJsonData(filter: { name: { ne: null } }) {
      nodes {
        regions {
          constituencies {
            candidates {
              finance {
                income {
                  total
                }
                outcome {
                  total
                }
              }
            }
          }
        }
      }
    }
  }
`

const IndexPage = ({ data }) => {
  let totalElectionFinanceAmount = 0
  data.totalElectionsFinanceAmount.nodes.forEach((election) => {
    election.regions.forEach((region) => {
      region.constituencies.forEach((constituency) => {
        constituency.candidates.forEach((candidate) => {
          let financeData = candidate.finance
          if (financeData !== null) {
            totalElectionFinanceAmount += financeData.income.total
            totalElectionFinanceAmount += financeData.outcome.total
          }
        })
      })
    })
  })
  totalElectionFinanceAmount = new Intl.NumberFormat('zh-Hans-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(totalElectionFinanceAmount);
  return (
    <Layout>
      <SEO title="首頁 | 金流百科" />
      <div className={ styles.mainContentWrapper }>
        <Img fluid={data.desktopImage.childImageSharp.fluid} className={styles.landingImgDesktop} />
        <Img fluid={data.mobileImage.childImageSharp.fluid} className={styles.landingImgMobile} />
        <div className={ styles.titleBlockWrapper }>
          <div className={ styles.titleWrapper}>
            <h3>台灣為亞洲民主燈塔，選舉決定著我們的未來!</h3>
            <p>將全面公開政治獻金、公投募款專戶金流，並與政府標案連結、視覺化，除了清楚的刻畫權力分配外，也利用簡單易理解的圖像，檢視各公職候選人、公投領銜人間的資源差距。</p>
          </div>
          <div className={ styles.navBtnsWrapper }>
            <span className={ styles.subtitle } >選舉政治獻金累積資料</span>
            <Link to="/elections">
              <Img fixed={ data.coinImage.childImageSharp.fixed} className={ styles.coinImage } />
              { totalElectionFinanceAmount } 元
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
