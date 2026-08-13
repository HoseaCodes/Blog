import React from "react";
import { Redirect, useParams } from "react-router-dom";
import {
  findGroup,
  findCaseStudy,
  caseStudyPath,
} from "./CaseStudiesData";
import CaseStudyGroup from "./CaseStudyGroup/CaseStudyGroup";
import CaseStudy from "./CaseStudy/CaseStudy";

/* ------------------------------------------------------------------
   Dispatcher for the single-segment route `/case-studies/:slug`.

   - A group slug (e.g. "state-farm")  → render the section landing.
   - A standalone study (slug or id)   → render the detail page.
   - A grouped study reached flat (slug or legacy numeric id, e.g.
     "/case-studies/4")                → redirect to its canonical
                                          nested URL (/case-studies/state-farm/…).
   - Anything else                     → CaseStudy renders its NotFound.
------------------------------------------------------------------ */

const CaseStudyEntry = () => {
  const { slug } = useParams();

  if (findGroup(slug)) return <CaseStudyGroup />;

  const study = findCaseStudy(slug);
  if (study && study.group) return <Redirect to={caseStudyPath(study)} />;

  // standalone study (or not found — CaseStudy handles the fallback)
  return <CaseStudy />;
};

export default CaseStudyEntry;
