import React from 'react'
import { Link } from "gatsby"
import styles from '../stylesheets/regions_links.module.sass'

class RegionsLinks extends React.Component {
  constructor(props) {
    super(props)
    this.regionsLinks = this.props.regions.map((region) => (
      <RegionLink urlPrefix={ this.props.urlPrefix } regionName={region.name} constituencyName={region.firstConstituency} />
    ))
  }
  render() {
    return (
      <ul className={styles.regionsLinks}>{ this.regionsLinks }</ul>
    )
  }
}

export const RegionLink = ({ urlPrefix, regionName, constituencyName }) => {
  return (
    <li className={styles.regionLink}>
      <Link to={ `/${urlPrefix}/regions/${regionName}/constituencies/${constituencyName}` }>{ regionName }</Link>
    </li>
  )
}

export default RegionsLinks
