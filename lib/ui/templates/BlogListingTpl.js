import { graphql, Link } from "gatsby";
import { object, shape } from "prop-types";
import React, { Component } from "react";
import { GatsbyImage } from "gatsby-plugin-image";
import styled from "styled-components";

import { Icon, Tile } from "ui/components";
import { breakpoint } from "ui/settings";
import { Body, Header, Helmet, Layout } from "ui/partials";
import { setSpace, setType } from "ui/mixins";

const PostList = styled.ol`
  ${breakpoint.tabletUp} {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    margin-left: auto;
    margin-right: auto;
  }
`;

const Post = styled(Tile)`
  ${setType("m")};
  grid-row-end: span 1;
  position: relative;
  ${breakpoint.phone} {
    ${setSpace("mbl")};
  }
`;

const PostCover = styled.div`
  border: 2px solid ${({ theme }) => theme.actionColor};
  ${setSpace("mbm")};
`;

const PostHd = styled.div`
  ${setSpace("mbs")};
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  h2,
  span {
    ${setType("l")};
    color: ${({ theme }) => theme.actionColor};
    font-weight: 800;
  }
  span {
    display: none;
  }
  ${breakpoint.desktopUp} {
    span {
      display: inline-block;
    }
  }
`;

const PostBd = styled.div`
  ${setSpace("mbm")};
  color: ${({ theme }) => theme.titleColor};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const PostFt = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  span {
    ${setType("s")};
    color: ${({ theme }) => theme.color};
  }
`;

export default class BlogListingTpl extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { posts } = this.props.data;
    const { frontmatter } = this.props.data.markdownRemark;
    return <>
      <Helmet {...this.props} title={frontmatter.title} />
      <Layout {...this.props}>
        <Header>
          <h1 className="hero">{frontmatter.heading}</h1>
          <p className="para">{frontmatter.subheading}</p>
        </Header>
        <Body>
          <PostList>
            {posts.edges.map(({ node }) => {
              const { timeToRead } = node;
              const { cover, date, summary, title, uid } = node.frontmatter;
              return (
                <Post key={uid} as="li">
                  <Tile to={`/tldr/${uid}`} as={Link}>
                    {cover ? (
                      <PostCover>
                        <GatsbyImage image={cover.childImageSharp.gatsbyImageData} alt={title} />
                      </PostCover>
                    ) : null}
                    <PostHd>
                      <h2 className="title">{title}</h2>
                      <span>
                        <Icon name="arrow-right" text="Read more…" />
                      </span>
                    </PostHd>
                    <PostBd>
                      <p className="summary">{summary}</p>
                    </PostBd>
                    <PostFt>
                      <span>{date}</span>
                      <span>{timeToRead} min read</span>
                    </PostFt>
                  </Tile>
                </Post>
              );
            })}
          </PostList>
        </Body>
      </Layout>
    </>;
  }
}

BlogListingTpl.propTypes = {
  data: shape({
    markdownRemark: object.isRequired,
    posts: object.isRequired
  }).isRequired
};

export const pageQuery = graphql`query BlogTplQuery($uid: String!) {
  markdownRemark(frontmatter: {uid: {eq: $uid}}) {
    html
    frontmatter {
      uid
      title
      heading
      subheading
    }
  }
  posts: allMarkdownRemark(
    filter: {fileAbsolutePath: {regex: "/pages/tldr/.*post.md/"}}
    sort: {frontmatter: {date: DESC}}
  ) {
    edges {
      node {
        id
        timeToRead
        frontmatter {
          uid
          cover {
            childImageSharp {
              gatsbyImageData(
                height: 240
                quality: 100
                placeholder: DOMINANT_COLOR
                layout: FULL_WIDTH
              )
            }
          }
          date(formatString: "MMMM D, YYYY")
          summary
          title
        }
      }
    }
  }
}`;
