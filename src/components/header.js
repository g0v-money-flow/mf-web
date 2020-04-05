import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Img from "gatsby-image"

const Header = ({ siteTitle, logoImage }) => (
  <header
    style={{
      background: `#fcfcfc`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 1280,
        padding: `1.45rem 1.0875rem`,
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
          <Img fixed={ logoImage } alt={ siteTitle } />
        </Link>
      </h1>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
