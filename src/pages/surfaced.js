import { graphql, Link } from "gatsby";
import { object, shape } from "prop-types";
import React, { Component, Fragment } from "react";

import PATHS from "../../config/paths";

export default class MentionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const mentions = this.props.data.allMarkdownRemark.edges;
    const prefix = PATHS.press;
    return (
      <Fragment>
        <h1>All Mentions</h1>
        {mentions.map(({ node }) => {
          const { id, excerpt, frontmatter } = node;
          const { title, date, authorLink, author, uid } = frontmatter;
          return (
            <Fragment key={id}>
              <Link to={`/${prefix}/${uid}`}>
                <h2>{title}</h2>
              </Link>
              <span>{date}</span>
              <p>{excerpt}</p>
              <p>
                by{" "}
                <a href={authorLink} rel="author" target="_blank">
                  {author}
                </a>
              </p>
            </Fragment>
          );
        })}
      </Fragment>
    );
  }
}

MentionsPage.propTypes = {
  data: shape({
    allMarkdownRemark: object.isRequired
  }).isRequired
};

export const pageQuery = graphql`
  query AllMentionsQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//pages/press/*/.*/*.md/" } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            uid
            author
            authorLink
            date(formatString: "MMMM YYYY")
            title
          }
        }
      }
    }
  }
`;
