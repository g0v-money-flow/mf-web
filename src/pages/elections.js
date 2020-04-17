import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"
import Layout from "../components/layout"
import RegionsLinks from "../components/regions_links"
import SEO from "../components/seo"
import Election from "../modules/election"
import styles from '../stylesheets/elections.module.sass'

export const query = graphql`
  query {
    allElectionsJson(filter: { name: { ne: null } }) {
      nodes {
        year
        name
        regions {
          name
          constituencies {
            name
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
    boxImage: file(relativePath: { eq: "box.png" }) {
      childImageSharp {
        fixed(width: 108) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`

const ElectionsIndexPage = ({ data }) => {
  return (
    <Layout>
      <Link to="/">{'< 返回'}</Link>
      <SEO title="選舉金流" />
      {/* <YearsList data={ data } /> */}
      <ElectionBlocks data={ data } />
      
    </Layout>

  )
}

export const YearsList = ({ data }) => {
  const yearsArray = data.allElectionsJson.nodes.map((election) => (election.year))
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
  const elections = [].concat.apply([], data.allElectionsJson.nodes.map((election) => (new Election(election))))
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
