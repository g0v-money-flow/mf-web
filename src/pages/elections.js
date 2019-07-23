import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"
import RegionsLinks from "../components/regions_links"
import SEO from "../components/seo"
import styles from '../stylesheets/elections.module.sass'

export const query = graphql`
  query {
    electionsJsonData(name: { ne: null }) {
      regions {
        name
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

class Election {
  constructor(election, data) {
    this.name = election.name
    this.title = election.title
    this.showCities = election.showCities
    this.regions = data.regions.map((region) => ({
      name: region.name,
      constituencies: [{ 'name': '第01選區' }]
    }))
  }
}

const ElectionsIndexPage = ({ data }) => {
  return (
    <Layout>
      <Link to="/">{'< 返回'}</Link>
      <SEO title="選舉金流" />
      <YearsList data={ data } />
      <ElectionBlocks data={ data } />
    </Layout>

  )
}

export const YearsList = ({ data }) => {
  const yearsList = Years(data.electionsJsonData).map((year) => (
    <li>
      <a href="#">
        { year.year }
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
  const elections = [].concat.apply([], Years(data.electionsJsonData).map((year) => (year.elections)))
  const electionBlocks = elections.map((election) => {
    if (election.showCities === true) {
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
    } else {
      return(
        <div>
          <h3 className={ styles.electionTitle }>
            <Img fixed={ data.flagImage.childImageSharp.fixed } className={ styles.decorationImage } />
            { election.title }
          </h3>
          <ul className={styles.yearsList}>
            <li><Link to={ `elections/${election.name}/regions/全國/constituencies/全國` }>全國</Link></li>
          </ul>
        </div>
      )
    }
  })
  return (
    <div className={styles.electionBlocks}>{ electionBlocks }</div>
  )
}

export const Years = (data) => {
  return ([
  // {
  //   year: '2014',
  //   elections: [{
  //       name: '2014-mayor-election',
  //       title: '縣市長選舉',
  //       showCities: true
  //     },
  //     {
  //       name: '2014-representative-election',
  //       title: '縣市議員選舉',
  //       showCities: true,
  //     },
  //   ].map((election) => (new Election(election, data)))
  // },
  {
    year: '2016',
    elections: [{
        name: '2016-president-election',
        title: '總統選舉',
        showCities: false,
      },
      {
        name: '2016-legislator-election',
        title: '立法委員選舉',
        showCities: true,
      },
    ].map((election) => (new Election(election, data)))
  },
  // {
  //   year: '2018',
  //   elections: [{
  //       name: '2018-mayor-election',
  //       title: '縣市長選舉',
  //       showCities: true,
  //     },
  //     {
  //       name: '2018-representative-election',
  //       title: '縣市議員選舉',
  //       showCities: true,
  //     },
  //   ].map((election) => (new Election(election, data)))
  // },
  // {
  //   year: '2020',
  //   elections: [{
  //       name: '2020-president-election',
  //       title: '總統選舉',
  //       showCities: false,
  //     },
  //     {
  //       name: '2020-legislator-election',
  //       title: '立法委員選舉',
  //       showCities: true,
  //     },
  //   ].map((election) => (new Election(election, data)))
  // },
])}

export default ElectionsIndexPage
