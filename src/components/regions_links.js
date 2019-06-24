import React from 'react'
import { Link } from "gatsby"

class RegionsLinks extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.regionsLinks = this.props.regions.map((region) => (
      <li>
        <Link to={ `${this.props.urlPrefix}/regions/${region.name}/constituencies/${region.constituencies[0].name}` }>{ region.name }</Link>
      </li>
    ))
  }
  render() {
    return (<ul>{ this.regionsLinks }</ul>)
  }
}

export default RegionsLinks
