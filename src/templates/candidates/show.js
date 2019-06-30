import React from 'react'
import { Link } from "gatsby"
import { graphql } from "gatsby"
import Layout from "../../components/layout"
import RegionsLinks from "../../components/regions_links"
import styles from "../../stylesheets/constituency.module.css"

const Candidate = ({ pageContext }) => (
  <Layout>
    <h1>{ pageContext.candidate.name }</h1>
    <h3>{ pageContext.candidate.party }</h3>
    <p>得票數:{ pageContext.candidate.num_of_vote } / 得票率:{pageContext.candidate.rate_of_vote } </p>
  </Layout>
)

export default Candidate
