import { Link } from "gatsby"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import React from "react"
import Img from "gatsby-image"
import RegionsLinks from "./regions_links"
import Election from "../modules/election"
import styles from '../stylesheets/header.module.sass'

const Header = () => (
  <StaticQuery
    query={graphql`
      query {
        allReferendumsJson {
          nodes {
            referendumId
            no
          }
        }
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
        logoImage: file(relativePath: { eq: "logoImage.png"}) {
          childImageSharp {
            fixed(width: 120) {
              ...GatsbyImageSharpFixed
            }
          }
        }
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <header
        style={{
          background: `#fcfcfc`,
          marginBottom: `1.45rem`
        }}
      >
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 1280,
            padding: `1.45rem 1.0875rem`,
            display: `flex`,
            justifyContent: `space-between`
          }}
        >
          <h1 style={{ margin: 0 }}>
            <Link
              to="/"
              style={{
                color: `black`,
                textDecoration: `none`,
                height: `44px`
              }}
            >
              <Img fixed={ data.logoImage.childImageSharp.fixed } alt={ data.site.siteMetadata.title } />
            </Link>
          </h1>
          <div style={{
            display: `flex`
          }}>
            <ReferendumLinksWrapper referendums={ data.allReferendumsJson.nodes } />
            <ElectionLinksWrapper elections={ data.allElectionsJson.nodes } />
          </div>
        </div>
      </header>
    )}
  />
)

class ReferendumLinksWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = { displayLinks: false }
    this.toggleLinks = this.toggleLinks.bind(this)
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  toggleLinks() {
    this.setState(state => ({
      displayLinks: !state.displayLinks
    }))
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState(state => ({
        displayLinks: false
      }))
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  render() {
    return(
      <div ref={ this.setWrapperRef } className={ styles.headerMenu }>
        <a href="#" onClick={ this.toggleLinks }>公民投票</a>
        <ReferendumLinks referendums={ this.props.referendums } display={ this.state.displayLinks } />
      </div>
    )
  }
}

class ReferendumLinks extends React.Component {
  constructor(props) {
    super(props)
    this.referendumLinks = this.props.referendums.map((referendum) => (
      <li>
        <Link to={ `/referendums#${referendum.referendumId} `}>
          { referendum.no }
        </Link>
      </li>
    ))
  }

  render() {
    return(
      <div className={ styles.dropdownMenu } style={{
        display: `${this.props.display ? 'block' : 'none' }`
      }}>
        <h4>2018</h4>
        <ul>{ this.referendumLinks }</ul>
      </div>
    )
  }
}

class ElectionLinksWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = { displayLinks: false }
    this.toggleLinks = this.toggleLinks.bind(this)
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  toggleLinks() {
    this.setState((state) => ({
      displayLinks: !state.displayLinks
    }))
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState(state => ({
        displayLinks: false
      }))
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node
  }

  render() {
    return(
      <div ref={ this.setWrapperRef } className={ styles.headerMenu }>
        <a href="#" onClick={ this.toggleLinks }>政治獻金</a>
        <ElectionLinks elections={ this.props.elections } display={ this.state.displayLinks } />
      </div>
    )
  }
}

class ElectionLinks extends React.Component {
  constructor(props) {
    super(props)
    this.electionsByYear = {}
    this.props.elections.forEach((election) => {
      if(!this.electionsByYear[election.year]) {
        this.electionsByYear[election.year] = []
      }
      this.electionsByYear[election.year].push(new Election(election))
    })
  }
  render() {
    return(
      <div className={ styles.dropdownMenu } style={{
        width: `20rem`,
        display: `${this.props.display ? 'block' : 'none' }`
      }}>
        { Object.keys(this.electionsByYear).map((year) => (
          <ElectionLinksByYearWrapper year={ year } electionsOfYear={ this.electionsByYear[year] } />
        )) }
      </div>
    )
  }
}

class ElectionLinksByYearWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = { displayLinks: false }
    this.toggleLinks = this.toggleLinks.bind(this)
  }

  toggleLinks() {
    this.setState((state) => ({
      displayLinks: !state.displayLinks
    }))
  }

  render() {
    return(
      <div>
        <a href="#" onClick={ this.toggleLinks }>{ this.props.year }</a>
        <ElectionLinksByYear electionsOfYear={ this.props.electionsOfYear } display={ this.state.displayLinks }  />
      </div>
    )
  }
}

const ElectionLinksByYear = ({ electionsOfYear, display }) => {
  const elections = electionsOfYear.map((election) => (
    <div>
      <h4>{ election.title }</h4>
      <div className={ styles.regionsLinksWrapper }>
        <RegionsLinks regions={ election.regions } urlPrefix={ `elections/${election.name}` } />
      </div>
    </div>
  ))
  return(
    <div style={{
      display: `${display ? 'block' : 'none'}`
    }}>
      { elections }
    </div>
  )
}


Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
