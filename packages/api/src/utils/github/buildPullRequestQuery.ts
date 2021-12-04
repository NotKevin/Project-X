export const buildPullRequestQuery = (
  projectsString: string,
  dateString: string,
  userString: string,
  cursor: string | null,
) => {
  const queryParamString = `${projectsString} is:pr is:merged merged:${dateString} ${userString}`;

  const pullRequestQuery = JSON.stringify({
    query: `
  query FindPullRequests($queryParams: String!, $cursor: String){
      search (first: 100, after: $cursor, query: $queryParams, type: ISSUE) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          ... on PullRequest {
            id
            title
            permalink
            mergedAt
            permalink
            author {
              login
            }
          }
        }
      }
    }
        `,
    variables: {
      queryParams: queryParamString,
      cursor,
    },
  });

  return pullRequestQuery;
};
