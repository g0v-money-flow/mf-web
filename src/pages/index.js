import React from "react"
import { Link, StaticQuery, graphql } from "gatsby"

import Layout from "../components/layout"
import Img from "gatsby-image"
import SEO from "../components/seo"
import styles from "../stylesheets/landing_page.module.sass"

export const query = graphql`
  query {
    desktopImage: file(relativePath: { eq: "mainvisual.png" }) {
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
  }
`

const LandingBgImage = ({ data }) => (
  <Img fluid={data.desktopImage.childImageSharp.fluid} />
)

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="首頁 | 金流百科" />
    <div className={ styles.mainContentWrapper }>
      <Img fluid={data.desktopImage.childImageSharp.fluid} className={styles.landingImgDesktop} />
      <Img fluid={data.mobileImage.childImageSharp.fluid} className={styles.landingImgMobile} />
      {/* <LandingBgImage /> */}
      <div className={ styles.titleBlockWrapper }>
        <div className={ styles.titleWrapper}>
          <h3>台灣為亞洲民主燈塔，選舉決定著我們的未來!</h3>
          <p>將全面公開政治獻金、公投募款專戶金流，並與政府標案連結、視覺化，除了清楚的刻畫權力分配外，也利用簡單易理解的圖像，檢視各公職候選人、公投領銜人間的資源差距。</p>
        </div>
        <div className={ styles.navBtnsWrapper }>
          <Link to="/elections">選舉金流</Link>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
