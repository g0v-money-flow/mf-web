import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"
import RegionsLinks from "../components/regions_links"
import SEO from "../components/seo"
import styles from '../stylesheets/elections.module.sass'

export const query = graphql`
  query {
    allElectionsJsonData(filter: { name: { ne: null } }) {
      nodes {
        year
        name
        regions {
          name
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
    boxImage: file(relativePath: { eq: "box.png" }) {
      childImageSharp {
        fixed(width: 108) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

class Election {
  constructor(data) {
    this.name = data.name.replace(/\s/g, '-').toLowerCase()
    switch(data.name) {
      case '2016 Legislator Election':
        this.title = '2016 立法委員選舉'
        break;
      case '2016 President Election':
        this.title = '2016 總統選舉'
        break;
      case '2014 Council Election':
        this.title = '2014 縣市議員選舉'
        break;
      case '2018 Council Election':
        this.title = '2018 縣市議員選舉'
        break;
      case '2014 Mayor Election':
        this.title = '2014 縣市長選舉'
        break;
      case '2018 Mayor Election':
        this.title = '2018 縣市長選舉'
        break;
      case '2018 Townshipmayor Election':
        this.title = '2018 鄉鎮市長選舉'
        break;
      case '2018 Villagechief Election':
        this.title = '2018 村里長選舉'
        break;
      case '2018 Townshiprepresentative Election':
        this.title = '2018 鄉鎮市民代表選舉'
        break;
      default:
        data.title = data.name
    }
    this.regions = data.regions.map((region) => {
      let firstConstituency = '第01選區'
      if(['全國', '山地立委', '平地立委'].includes(region.name)) {
        firstConstituency = '全國'
      } else if(data.name === '2018 Mayor Election' || data.name === '2014 Mayor Election') {
        firstConstituency = region.name
      }
      return({
        name: region.name,
        firstConstituency: firstConstituency
      })
    })
  }
}

const ElectionsIndexPage = ({ data }) => {
  return (
    <Layout>
      <Link to="/">{'< 返回'}</Link>
      <SEO title="選舉金流" />
      {/* <YearsList data={ data } /> */}
      <ElectionBlocks data={ data } />
      <Img fixed={ data.boxImage.childImageSharp.fixed }
           style={
             { 
               float: `right`
             }
           } />
    </Layout>

  )
}

export const YearsList = ({ data }) => {
  const yearsArray = data.allElectionsJsonData.nodes.map((election) => (election.year))
  const yearsList = [...new Set(yearsArray)].map((year) => (
    <li>
      <a href="#">
        { year }
      </a>
    </li>
  ))
  return (
    <div>
      <ul className={ styles.yearsList }>
        { yearsList }
      </ul>
    </div>
  )
}

export const ElectionBlocks = ({ data }) => {
  const elections = [].concat.apply([], data.allElectionsJsonData.nodes.map((election) => (new Election(election))))
  const electionBlocks = elections.map((election) => {
    return (
      <div>
        <h3 className={ styles.electionTitle }>
          <Img fixed={ data.flagImage.childImageSharp.fixed } className={ styles.decorationImage } />
          { election.title }
        </h3>
        <RegionsLinks regions={ election.regions }
                      urlPrefix={ `elections/${election.name}` } />
      </div>
    )
  })
  return (
    <div className={styles.electionBlocks}>
      { electionBlocks }
    </div>
  )
}


export default ElectionsIndexPage
