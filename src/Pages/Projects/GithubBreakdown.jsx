import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  githubRepos,
  githubStats,
  UNKNOWN_LANGUAGE,
} from "../../Constants/githubRepos";

/* ------------------------------------------------------------------
   Language dot colors — GitHub's linguist palette for the handful of
   languages this account actually uses. Anything unmapped (including
   repos GitHub reports no primary language for) falls back to gray.
------------------------------------------------------------------ */

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572a5",
  Java: "#b07219",
  Swift: "#f05138",
  HTML: "#e34c26",
  CSS: "#563d7c",
  EJS: "#a91e50",
  Shell: "#89e051",
};

const langColor = (language) =>
  LANGUAGE_COLORS[language] || "#4d5559";

/* ------------------------------------------------------------------
   Styled components — palette matches Projects.jsx so the breakdown
   reads as one page with the showcase grid above it.
------------------------------------------------------------------ */

const Section = styled.section`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 120px;

  @media (max-width: 720px) {
    padding: 0 18px 72px;
  }
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 32px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Stat = styled.div`
  padding: 18px 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);

  .num {
    display: block;
    font-family: "Lato", sans-serif;
    font-weight: 800;
    font-size: 30px;
    line-height: 1;
    letter-spacing: -0.02em;
    color: #f4f6f8;
  }
  .label {
    display: block;
    margin-top: 8px;
    font-family: "Lato", sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #6b7479;
  }
`;

const LanguageBar = styled.div`
  display: flex;
  width: 100%;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
  margin-bottom: 14px;

  span {
    display: block;
    height: 100%;
  }
`;

const LanguageLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-bottom: 36px;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  color: #a3acb2;

  button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font: inherit;
    color: inherit;
    letter-spacing: 0.01em;
  }
  button:hover {
    color: #f4f6f8;
  }
  button[data-active="true"] {
    color: #5bb39e;
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex: none;
  }
  .count {
    color: #6b7479;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Search = styled.input`
  flex: 1 1 240px;
  min-width: 200px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: "Lato", sans-serif;
  font-size: 13px;
  color: #f4f6f8;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: #6b7479;
  }
  &:focus {
    border-color: rgba(91, 179, 158, 0.45);
  }
`;

const Chip = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) =>
      $active ? "rgba(91, 179, 158, 0.45)" : "rgba(255, 255, 255, 0.08)"};
  background: ${({ $active }) =>
    $active ? "rgba(91, 179, 158, 0.1)" : "rgba(255, 255, 255, 0.025)"};
  color: ${({ $active }) => ($active ? "#5bb39e" : "#a3acb2")};
  font-family: "Lato", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;

  &:hover {
    color: #f4f6f8;
    border-color: rgba(255, 255, 255, 0.18);
  }
`;

const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
`;

const ResultCount = styled.div`
  font-family: "Lato", sans-serif;
  font-size: 12px;
  color: #6b7479;
  letter-spacing: 0.02em;
  margin-bottom: 16px;
`;

const RepoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const RepoCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.28);
    background: rgba(255, 255, 255, 0.035);
    transform: translateY(-2px);
    text-decoration: none;
  }
  &:hover .name {
    color: #5bb39e;
  }
`;

const RepoTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  .name {
    font-family: "Lato", sans-serif;
    font-weight: 700;
    font-size: 15px;
    line-height: 1.3;
    color: #f4f6f8;
    letter-spacing: -0.01em;
    word-break: break-word;
    transition: color 0.2s ease;
  }
`;

const ForkTag = styled.span`
  flex: none;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: "Lato", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7479;
`;

const RepoDesc = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: #a3acb2;
  margin: 0;
`;

const RepoMeta = styled.div`
  margin-top: auto;
  padding-top: 4px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-family: "Lato", sans-serif;
  font-size: 11.5px;
  color: #6b7479;
  letter-spacing: 0.01em;

  .lang {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex: none;
  }
  .cat {
    color: #4d5559;
  }
`;

const Empty = styled.div`
  padding: 48px 20px;
  text-align: center;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  color: #6b7479;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 14px;
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const KIND_FILTERS = [
  { key: "all", label: "All repos" },
  { key: "original", label: "Original & collaborative" },
  { key: "fork", label: "Forks & references" },
];

const GithubBreakdown = () => {
  const [kind, setKind] = useState("all");
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState(null);
  const [query, setQuery] = useState("");

  // The stat tiles and the language bar describe the whole account — they are
  // the breakdown, not a view of it — so they read the shared totals and never
  // react to the filters below them.
  const { total, original: originalCount, forks: forkCount, languages: languageStats } =
    githubStats;

  // Category chips are part of the filter row, so their counts are faceted:
  // they describe what selecting the chip would actually show under the
  // current kind and language. Counting the whole catalog here reads as a bug
  // — "Learning & CS 14" next to a grid showing 9 forks.
  const categories = useMemo(() => {
    const byCategory = new Map();

    githubRepos.forEach((repo) => {
      if (kind !== "all" && repo.kind !== kind) return;
      if (language && (repo.language || UNKNOWN_LANGUAGE) !== language) return;
      byCategory.set(repo.category, (byCategory.get(repo.category) || 0) + 1);
    });

    return [...byCategory.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [kind, language]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return githubRepos.filter((repo) => {
      if (kind !== "all" && repo.kind !== kind) return false;
      if (category !== "All" && repo.category !== category) return false;
      if (language && (repo.language || UNKNOWN_LANGUAGE) !== language)
        return false;
      if (!q) return true;
      return (
        repo.name.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q) ||
        (repo.language || "").toLowerCase().includes(q) ||
        repo.category.toLowerCase().includes(q)
      );
    });
  }, [kind, category, language, query]);

  // A faceted count can drop to zero — pick Forks, then a category only
  // original repos have. Keep the selected chip in the row anyway (showing 0)
  // rather than letting the one control that explains an empty grid vanish
  // from the page.
  const categoryChips =
    category !== "All" && !categories.some((c) => c.name === category)
      ? [...categories, { name: category, count: 0 }]
      : categories;

  const toggleLanguage = (name) =>
    setLanguage((current) => (current === name ? null : name));

  return (
    <Section id="github">
      <Stats>
        <Stat>
          <span className="num">{total}</span>
          <span className="label">Public repos</span>
        </Stat>
        <Stat>
          <span className="num">{originalCount}</span>
          <span className="label">Original</span>
        </Stat>
        <Stat>
          <span className="num">{forkCount}</span>
          <span className="label">Forks &amp; references</span>
        </Stat>
        <Stat>
          <span className="num">
            {languageStats.filter((l) => l.name !== UNKNOWN_LANGUAGE).length}
          </span>
          <span className="label">Languages</span>
        </Stat>
      </Stats>

      <LanguageBar>
        {languageStats.map((lang) => (
          <span
            key={lang.name}
            title={`${lang.name} — ${lang.count}`}
            style={{
              width: `${(lang.count / total) * 100}%`,
              background: langColor(lang.name),
            }}
          />
        ))}
      </LanguageBar>

      <LanguageLegend>
        {languageStats.map((lang) => (
          <button
            key={lang.name}
            type="button"
            data-active={language === lang.name}
            aria-pressed={language === lang.name}
            onClick={() => toggleLanguage(lang.name)}
          >
            <span
              className="dot"
              style={{ background: langColor(lang.name) }}
            />
            {lang.name} <span className="count">{lang.count}</span>
          </button>
        ))}
      </LanguageLegend>

      <Controls>
        {KIND_FILTERS.map((filter) => (
          <Chip
            key={filter.key}
            type="button"
            $active={kind === filter.key}
            aria-pressed={kind === filter.key}
            onClick={() => setKind(filter.key)}
          >
            {filter.label}
          </Chip>
        ))}
        <Search
          type="search"
          value={query}
          placeholder="Search repositories…"
          aria-label="Search repositories"
          onChange={(e) => setQuery(e.target.value)}
        />
      </Controls>

      <CategoryRow>
        <Chip
          type="button"
          $active={category === "All"}
          aria-pressed={category === "All"}
          onClick={() => setCategory("All")}
        >
          All work
        </Chip>
        {categoryChips.map((cat) => (
          <Chip
            key={cat.name}
            type="button"
            $active={category === cat.name}
            aria-pressed={category === cat.name}
            onClick={() => setCategory(cat.name)}
          >
            {cat.name} <span style={{ opacity: 0.6 }}>{cat.count}</span>
          </Chip>
        ))}
      </CategoryRow>

      <ResultCount aria-live="polite">
        Showing {visible.length} of {total} repositories
        {language ? ` · ${language}` : ""}
      </ResultCount>

      {visible.length === 0 ? (
        <Empty>No repositories match those filters.</Empty>
      ) : (
        <RepoGrid>
          {visible.map((repo) => (
            <RepoCard
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RepoTop>
                <span className="name">{repo.name}</span>
                {repo.kind === "fork" && <ForkTag>Fork</ForkTag>}
              </RepoTop>
              <RepoDesc>{repo.description}</RepoDesc>
              <RepoMeta>
                <span className="lang">
                  <span
                    className="dot"
                    style={{
                      background: langColor(repo.language || UNKNOWN_LANGUAGE),
                    }}
                  />
                  {repo.language || "No primary language"}
                </span>
                <span className="cat">{repo.category}</span>
              </RepoMeta>
            </RepoCard>
          ))}
        </RepoGrid>
      )}
    </Section>
  );
};

export default GithubBreakdown;
