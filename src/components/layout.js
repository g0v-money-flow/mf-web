/**
 * Layout component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { StaticQuery, graphql } from "gatsby"
import powerByImage from "../images/poweredby-long-i.svg"
import watchoutLogo from "../images/watchoutLogo.png"

import Header from "./header"
import "../stylesheets/layout.sass"
import styles from '../stylesheets/landing_page.module.sass'

const Layout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query {
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
      <>
        <Header siteTitle={ data.site.siteMetadata.title } logoImage={ data.logoImage.childImageSharp.fixed } />
        <div
          style={{
            margin: `0 auto`,
            maxWidth: 1280,
            padding: `0px 1.0875rem 1.45rem`,
            paddingTop: 0
          }}
        >
          <main>{children}</main>
          <footer className={ styles.footer }>
            <a href="https://g0v.tw" className={ styles.g0vLink} target="_blank">
              <img src={ powerByImage } />
            </a>
            <a href="https://watchout.tw" className={ styles.watchoutLink } target="_blank">
              <img src={ watchoutLogo } />
            </a>
          </footer>
        </div>
      </>
    )}
  />
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
