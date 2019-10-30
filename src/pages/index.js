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
            <h3 className={ styles.mobileHeading }>專案介紹（About this project）</h3>
            <h3 className={ styles.desktopHeading }>專案介紹（About this project）</h3>
            <p>金流百科(Goldenpedia)將政治獻金、公投募款專戶金流公開並且視覺化。利用簡單易理解的圖像，檢視各民選公職候選人、公投領銜人間的資源差距，並羅列收支詳目、捐贈公司之承接標案情況</p>
          </div>
          <div className={ styles.navBtnsWrapper }>
            <span className={ styles.subtitle } >目前成果</span>
            <Link to="/elections">
              <Img fixed={ data.coinImage.childImageSharp.fixed} className={ styles.coinImage } />
              累積 { totalElectionFinanceAmount } 元政治獻金
            </Link>
            <Link to="/referendums">
              <Img fixed={ data.coinImage.childImageSharp.fixed} className={ styles.coinImage } />
              累積 NT$6,380 元公民投票經費資料
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.informationsWrapper}>
        <div className={ styles.contributionBlock }>
          <h3>如何貢獻</h3>
          <h4>揪討論: <a href="https://hackmd.io/4pyaJBQNSouvvtjdMbiuKQ?both">HACKMD ></a></h4>
          <h4>揪開源: <a href="github.com/g0v-money-flow">GITHUB ></a></h4>
        </div>
        <div className={ styles.newsBlock }>
          <h3>最新消息</h3>
          <ol>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E4%B8%80%E8%A9%B1-2016%E5%B9%B4-%E7%AB%8B%E6%B3%95%E5%A7%94%E5%93%A1-%E6%94%BF%E6%B2%BB%E7%8D%BB%E9%87%91-4830cbc7d487">第一話 -『2016年 立法委員・政治獻金』</a></li>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E4%BA%8C%E8%A9%B1-2016%E5%B9%B4-%E7%B8%BD%E7%B5%B1-%E6%94%BF%E6%B2%BB%E7%8D%BB%E9%87%91-da1b8bdffafd">第二話 -『2016年 總統・政治獻金』</a></li>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E4%B8%89%E8%A9%B1-2014%E5%B9%B4-%E5%9C%B0%E6%96%B9%E9%A6%96%E9%95%B7-%E6%94%BF%E6%B2%BB%E7%8D%BB%E9%87%91-bf250c5c3369">第三話 -『2014年 地方首長・政治獻金』</a></li>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E5%9B%9B%E8%A9%B1-2018%E5%B9%B4-%E5%85%A8%E5%9C%8B%E6%80%A7%E5%85%AC%E6%B0%91%E6%8A%95%E7%A5%A8-%E7%B6%93%E8%B2%BB%E5%8B%9F%E9%9B%86%E5%B0%88%E6%88%B6-2f1241ac903f">第四話 -『2018年 全國性公民投票・經費募集專戶』</a></li>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E4%BA%94%E8%A9%B1-%E6%83%B3%E7%9C%8B%E8%AD%B0%E9%95%B7-%E5%89%AF%E8%AD%B0%E9%95%B7%E8%B2%A1%E7%94%A2%E7%94%B3%E5%A0%B1%E5%97%8E-%E5%9B%9B%E5%A4%A7%E9%99%90%E5%88%B6%E8%AE%93%E4%BD%A0%E6%83%B3%E6%94%BE%E6%A3%84-813923fc9b16">第五話 -『想看議長、副議長財產申報嗎?五大限制讓你想放棄！』</a></li>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E5%85%AD%E8%A9%B1-2014%E5%B9%B4-%E5%9C%B0%E6%96%B9%E8%AD%B0%E5%93%A1-%E6%94%BF%E6%B2%BB%E7%8D%BB%E9%87%91-ed95701138d2">第六話 -『2014年 地方議員・政治獻金』</a></li>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E4%B8%83%E8%A9%B1-%E9%9B%A3%E6%8B%BF%E6%8D%8F-%E6%94%BF%E6%B2%BB%E7%8D%BB%E9%87%91%E6%94%AF%E5%87%BA%E7%9A%84%E5%88%86%E5%AF%B8-cc66b9be688c">第七話 -『沒拿捏好分寸?政治獻金流入親友公司』</a></li>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E5%85%AB%E8%A9%B1-2020-%E6%88%91%E5%80%91%E5%B0%8D%E9%81%B8%E8%88%89%E9%87%91%E6%B5%81%E5%81%9A%E7%9A%844%E4%BB%B6%E4%BA%8B-a70473e95c88">第八話 -『2020！我們對選舉金流做的4件事』</a></li>
            <li><a href="https://medium.com/@jiunyangtian/%E9%87%91%E6%B5%81%E7%99%BE%E7%A7%91-%E7%AC%AC%E4%B9%9D%E8%A9%B1-%E6%94%BF%E6%B2%BB%E7%8D%BB%E9%87%91%E5%81%9C%E7%9C%8B%E8%81%BD-%E9%95%B7%E8%BC%A9%E5%9C%96%E5%A4%9A-d05cf8edd09b">第九話 -『政治獻金停看聽(長輩圖多)』</a></li>
          </ol>
          <a href="https://medium.com/@jiunyangtian" className={ styles.readMore}>更多文章</a>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
