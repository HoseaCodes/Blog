import GithubBreakdownView from "./GithubBreakdownView";

/*
  Projects whose detail page is a rendered view rather than the standard
  case-study layout.

  A record opts in with `customView: "<key>"`. Nothing here names a slug or a
  URL: which project this applies to, where it sits in the grid, and what it is
  called all come from the document, exactly like every other project. The app
  only supplies the component to render — the one part that cannot live in the
  database.

  Adding another one is a new entry here plus `customView` on the record.
*/
const PROJECT_VIEWS = {
  "github-breakdown": GithubBreakdownView,
};

// Unknown key -> null, so a typo (or a view removed from a later build) falls
// back to the standard detail page instead of blanking the route.
export const getProjectView = (key) =>
  (key && PROJECT_VIEWS[key]) || null;
