// Env-gated client: stub by default, calls a proxy when REACT_APP_AI_QUIZ_PROXY is set.
// The proxy must accept POST { topic, n, difficulty } and return { questions: [...] }.

const PROXY_URL = process.env.REACT_APP_AI_QUIZ_PROXY || '';

export const isLive = () => Boolean(PROXY_URL);

export const TOPICS = [
  { id: 'any', label: 'Surprise me' },
  { id: 'js', label: 'JavaScript' },
  { id: 'react', label: 'React' },
  { id: 'css', label: 'CSS' },
  { id: 'git', label: 'Git' },
  { id: 'http', label: 'HTTP' },
];

const CORPUS = {
  js: [
    {
      q: 'What does typeof null return?',
      choices: ['"null"', '"object"', '"undefined"', '"boolean"'],
      answer: 1,
      why: 'Long-standing JS quirk: null reports as "object" due to legacy tagging.',
    },
    {
      q: 'Which method does NOT mutate the array it is called on?',
      choices: ['push', 'splice', 'sort', 'slice'],
      answer: 3,
      why: 'slice returns a new array; the other three modify in place.',
    },
    {
      q: 'What does [] + [] evaluate to?',
      choices: ['0', '[]', '""', 'NaN'],
      answer: 2,
      why: 'Both arrays coerce to empty strings; concatenation yields "".',
    },
    {
      q: 'Which value is truthy?',
      choices: ['0', '""', '"0"', 'null'],
      answer: 2,
      why: 'Any non-empty string is truthy, even the literal "0".',
    },
    {
      q: 'Promise.all([Promise.resolve(1), Promise.reject("x")]) — what happens?',
      choices: [
        'Resolves to [1, "x"]',
        'Rejects with "x"',
        'Resolves to [1]',
        'Hangs forever',
      ],
      answer: 1,
      why: 'Promise.all short-circuits: any rejection rejects the whole thing.',
    },
  ],
  react: [
    {
      q: 'Which hook runs after every render by default?',
      choices: ['useMemo', 'useState', 'useEffect', 'useRef'],
      answer: 2,
      why: 'With no dependency array, useEffect runs after every commit.',
    },
    {
      q: 'What does an empty dependency array [] in useEffect mean?',
      choices: [
        'Never run',
        'Run on every render',
        'Run once after mount',
        'Run on unmount only',
      ],
      answer: 2,
      why: '[] means no dependencies change, so the effect runs only after mount.',
    },
    {
      q: 'Which is NOT a valid way to update React state?',
      choices: [
        'setCount(c => c + 1)',
        'setCount(count + 1)',
        'state.count = state.count + 1',
        'setState({ count: count + 1 })',
      ],
      answer: 2,
      why: 'Direct mutation bypasses React; the component will not re-render.',
    },
    {
      q: 'What does the `key` prop primarily help React do?',
      choices: [
        'Encrypt component output',
        'Reconcile list items efficiently',
        'Skip rendering entirely',
        'Set the DOM id attribute',
      ],
      answer: 1,
      why: 'Keys let React match old and new list items between renders.',
    },
    {
      q: 'Which API avoids prop-drilling across many levels?',
      choices: ['useReducer', 'useRef', 'Context', 'forwardRef'],
      answer: 2,
      why: 'Context broadcasts a value to any descendant that subscribes.',
    },
  ],
  css: [
    {
      q: 'Which value of `display` is the default for a <span>?',
      choices: ['block', 'inline', 'inline-block', 'flex'],
      answer: 1,
      why: '<span> is an inline element by default; it does not break onto a new line.',
    },
    {
      q: 'Which unit is relative to the ROOT font size?',
      choices: ['em', 'rem', '%', 'vh'],
      answer: 1,
      why: 'rem = "root em" — based on the <html> element\'s font-size.',
    },
    {
      q: 'What does the shorthand `flex: 1` expand to?',
      choices: [
        '1 1 auto',
        '1 0 0%',
        '1 1 0%',
        '0 1 100%',
      ],
      answer: 2,
      why: 'flex: 1 means grow 1, shrink 1, basis 0% — fills available space equally.',
    },
    {
      q: 'Which selector has the highest specificity?',
      choices: ['.a .b .c', '#id', 'div span a', 'a:hover'],
      answer: 1,
      why: 'IDs (1-0-0) beat any number of classes (0-3-0) or elements.',
    },
    {
      q: 'Which property does NOT create a new stacking context?',
      choices: [
        'opacity: 0.9',
        'transform: translateZ(0)',
        'color: red',
        'position: fixed',
      ],
      answer: 2,
      why: 'Plain color changes do not create a stacking context; the others do.',
    },
  ],
  git: [
    {
      q: 'Which command replays your commits on top of another branch?',
      choices: ['git merge', 'git rebase', 'git cherry-pick', 'git reset'],
      answer: 1,
      why: 'rebase moves commits to a new base, rewriting their parents.',
    },
    {
      q: 'What does `git reset --hard HEAD~1` do?',
      choices: [
        'Undoes the last commit but keeps changes staged',
        'Discards the last commit AND working changes',
        'Reverts only the index, not the working tree',
        'Creates a new commit that inverts the last one',
      ],
      answer: 1,
      why: '--hard wipes the working tree and index to match the target commit.',
    },
    {
      q: 'What is the difference between `git fetch` and `git pull`?',
      choices: [
        'They are aliases',
        'pull = fetch + merge (or rebase)',
        'fetch updates the working tree, pull does not',
        'pull is read-only, fetch writes',
      ],
      answer: 1,
      why: 'fetch only downloads refs; pull also integrates them into your branch.',
    },
    {
      q: 'Which command shows commits on HEAD not yet on origin/main?',
      choices: [
        'git log origin/main..HEAD',
        'git diff origin/main',
        'git status -ahead',
        'git show origin/main',
      ],
      answer: 0,
      why: 'The A..B range syntax lists commits reachable from B but not A.',
    },
    {
      q: 'What happens to already-tracked files when you add them to .gitignore?',
      choices: [
        'They are deleted from history',
        'They are untracked automatically',
        'Nothing — they remain tracked',
        'Git warns and refuses the commit',
      ],
      answer: 2,
      why: '.gitignore only affects untracked files; you must `git rm --cached` to stop tracking.',
    },
  ],
  http: [
    {
      q: 'Which status code means "understood but refused"?',
      choices: ['401 Unauthorized', '403 Forbidden', '404 Not Found', '418 I\'m a teapot'],
      answer: 1,
      why: '403 = the server understood the request and refuses to authorize it.',
    },
    {
      q: 'Which HTTP method is idempotent?',
      choices: ['POST', 'PATCH', 'PUT', 'CONNECT'],
      answer: 2,
      why: 'PUT sets a resource to a value — repeating it yields the same end state.',
    },
    {
      q: 'What is the standard port for HTTPS?',
      choices: ['80', '443', '8080', '22'],
      answer: 1,
      why: 'HTTPS defaults to 443; plain HTTP uses 80.',
    },
    {
      q: 'Which header allows a specific origin to make cross-origin requests?',
      choices: [
        'Content-Security-Policy',
        'X-Frame-Options',
        'Access-Control-Allow-Origin',
        'Strict-Transport-Security',
      ],
      answer: 2,
      why: 'Access-Control-Allow-Origin is the core CORS response header.',
    },
    {
      q: 'What does a 301 status code indicate?',
      choices: [
        'Temporary redirect',
        'Moved permanently',
        'Use the cached copy',
        'Resource conflict',
      ],
      answer: 1,
      why: '301 = permanent redirect; clients should update bookmarks.',
    },
  ],
};

const shuffle = (arr) => {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const buildStub = (topic, n) => {
  const pool =
    topic === 'any' || !CORPUS[topic]
      ? Object.values(CORPUS).flat()
      : CORPUS[topic];
  return shuffle(pool).slice(0, Math.min(n, pool.length));
};

export async function generateQuiz({ topic = 'any', n = 5, difficulty = 'medium' } = {}) {
  if (!isLive()) {
    return { source: 'stub', questions: buildStub(topic, n) };
  }
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ topic, n, difficulty }),
  });
  if (!res.ok) throw new Error(`Quiz proxy returned ${res.status}`);
  const data = await res.json();
  return { source: 'live', questions: data.questions || [] };
}
