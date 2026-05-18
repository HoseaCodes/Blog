import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ubuntuTheme } from '../styled/tokens';

const ROWS = 15;
const COLS = 25;
const ANIM_MS = 12;

const TOOL = {
  WALL: 'WALL',
  ERASE: 'ERASE',
  START: 'START',
  GOAL: 'GOAL',
  WEIGHT: 'WEIGHT',
};

const ALGO = {
  BFS: 'BFS',
  DFS: 'DFS',
  DIJKSTRA: 'Dijkstra',
};

const key = (r, c) => `${r},${c}`;

function makeGrid(rows, cols) {
  const cells = {};
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells[key(r, c)] = { row: r, col: c, wall: false, weight: 1 };
    }
  }
  return cells;
}

function neighbors(cells, r, c, rows, cols) {
  const out = [];
  const push = (nr, nc) => {
    const n = cells[key(nr, nc)];
    if (n && !n.wall) out.push(n);
  };
  if (r > 0) push(r - 1, c);
  if (c > 0) push(r, c - 1);
  if (r < rows - 1) push(r + 1, c);
  if (c < cols - 1) push(r, c + 1);
  return out;
}

function bfs(cells, start, goal, rows, cols) {
  const visited = [];
  const seen = new Set([key(start.row, start.col)]);
  const parent = new Map();
  const queue = [start];
  let found = false;
  while (queue.length && !found) {
    const cur = queue.shift();
    if (cur.row === goal.row && cur.col === goal.col) {
      found = true;
      break;
    }
    for (const n of neighbors(cells, cur.row, cur.col, rows, cols)) {
      const k = key(n.row, n.col);
      if (seen.has(k)) continue;
      seen.add(k);
      visited.push(n);
      parent.set(k, cur);
      queue.push(n);
    }
  }
  return { visited, path: found ? reconstruct(parent, start, goal) : [] };
}

function dfs(cells, start, goal, rows, cols) {
  const visited = [];
  const seen = new Set();
  const parent = new Map();
  const stack = [start];
  let found = false;
  while (stack.length && !found) {
    const cur = stack.pop();
    const k = key(cur.row, cur.col);
    if (seen.has(k)) continue;
    seen.add(k);
    visited.push(cur);
    if (cur.row === goal.row && cur.col === goal.col) {
      found = true;
      break;
    }
    for (const n of neighbors(cells, cur.row, cur.col, rows, cols)) {
      const nk = key(n.row, n.col);
      if (seen.has(nk)) continue;
      if (!parent.has(nk)) parent.set(nk, cur);
      stack.push(n);
    }
  }
  return { visited, path: found ? reconstruct(parent, start, goal) : [] };
}

function dijkstra(cells, start, goal, rows, cols) {
  const visited = [];
  const dist = new Map();
  const parent = new Map();
  for (const k of Object.keys(cells)) dist.set(k, Infinity);
  dist.set(key(start.row, start.col), 0);
  const pq = [{ node: start, d: 0 }];
  const finalized = new Set();
  let found = false;
  while (pq.length && !found) {
    pq.sort((a, b) => a.d - b.d);
    const { node: cur } = pq.shift();
    const ck = key(cur.row, cur.col);
    if (finalized.has(ck)) continue;
    finalized.add(ck);
    visited.push(cur);
    if (cur.row === goal.row && cur.col === goal.col) {
      found = true;
      break;
    }
    for (const n of neighbors(cells, cur.row, cur.col, rows, cols)) {
      const nk = key(n.row, n.col);
      if (finalized.has(nk)) continue;
      const alt = dist.get(ck) + n.weight;
      if (alt < dist.get(nk)) {
        dist.set(nk, alt);
        parent.set(nk, cur);
        pq.push({ node: n, d: alt });
      }
    }
  }
  return { visited, path: found ? reconstruct(parent, start, goal) : [] };
}

function reconstruct(parent, start, goal) {
  const path = [];
  let cur = goal;
  const startK = key(start.row, start.col);
  while (cur && key(cur.row, cur.col) !== startK) {
    path.push(cur);
    cur = parent.get(key(cur.row, cur.col));
    if (!cur) return [];
  }
  path.push(start);
  return path.reverse();
}

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${ubuntuTheme.bg.coolGrey};
  color: ${ubuntuTheme.text.grey};
  font-family: ${ubuntuTheme.font.base};
  user-select: none;
  overflow: hidden;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${ubuntuTheme.bg.windowTitle};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.8125rem;
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 4px;
  padding: 0 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  &:last-of-type { border-right: 0; }
`;

const Btn = styled.button`
  background: ${(p) => (p.$active ? ubuntuTheme.bg.orange : 'rgba(255,255,255,0.05)')};
  color: #fff;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  padding: 4px 10px;
  font: inherit;
  cursor: pointer;
  transition: background 120ms ease;
  &:hover { background: ${(p) => (p.$active ? ubuntuTheme.bg.orange : 'rgba(255,255,255,0.12)')}; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const Select = styled.select`
  background: rgba(255,255,255,0.08);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  padding: 3px 6px;
  font: inherit;
`;

const Status = styled.div`
  margin-left: auto;
  font-size: 0.8125rem;
  opacity: 0.85;
  white-space: nowrap;
`;

const Stage = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  overflow: auto;
  background: ${ubuntuTheme.bg.drkAbrgn};
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(${COLS}, 1fr);
  grid-template-rows: repeat(${ROWS}, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.06);
  padding: 1px;
  border-radius: 4px;
  width: min(100%, ${COLS * 26}px);
  aspect-ratio: ${COLS} / ${ROWS};
`;

const cellBg = ({ $start, $goal, $wall, $path, $visited, $weighted }) => {
  if ($start) return '#22c55e';
  if ($goal) return '#ef4444';
  if ($wall) return '#1f2937';
  if ($path) return '#facc15';
  if ($visited) return 'rgba(59, 130, 246, 0.55)';
  if ($weighted) return 'rgba(233, 84, 32, 0.35)';
  return 'rgba(255,255,255,0.92)';
};

const Cell = styled.div`
  background: ${cellBg};
  border-radius: 2px;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: ${(p) => (p.$start || p.$goal ? '#fff' : '#000')};
  &:hover { transform: scale(1.06); outline: 1px solid ${ubuntuTheme.bg.orange}; }
`;

const Legend = styled.div`
  display: flex;
  gap: 12px;
  padding: 6px 12px;
  background: ${ubuntuTheme.bg.windowTitle};
  font-size: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.06);
  flex-wrap: wrap;
`;

const Swatch = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${(p) => p.$color};
  margin-right: 6px;
  vertical-align: middle;
`;

const INITIAL_START = { row: Math.floor(ROWS / 2), col: 2 };
const INITIAL_GOAL = { row: Math.floor(ROWS / 2), col: COLS - 3 };

export function PathFinder() {
  const [cells, setCells] = useState(() => makeGrid(ROWS, COLS));
  const [start, setStart] = useState(INITIAL_START);
  const [goal, setGoal] = useState(INITIAL_GOAL);
  const [tool, setTool] = useState(TOOL.WALL);
  const [algo, setAlgo] = useState(ALGO.BFS);
  const [visitedSet, setVisitedSet] = useState(() => new Set());
  const [pathSet, setPathSet] = useState(() => new Set());
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('Idle');

  const mouseDown = useRef(false);
  const timeoutsRef = useRef([]);

  const clearTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const isStart = (r, c) => r === start.row && c === start.col;
  const isGoal = (r, c) => r === goal.row && c === goal.col;

  const applyTool = useCallback((r, c) => {
    if (running) return;
    if (tool === TOOL.START) {
      if (!cells[key(r, c)].wall) setStart({ row: r, col: c });
      return;
    }
    if (tool === TOOL.GOAL) {
      if (!cells[key(r, c)].wall) setGoal({ row: r, col: c });
      return;
    }
    if (isStart(r, c) || isGoal(r, c)) return;
    setCells((prev) => {
      const next = { ...prev };
      const cell = { ...next[key(r, c)] };
      if (tool === TOOL.WALL) { cell.wall = true; cell.weight = 1; }
      else if (tool === TOOL.ERASE) { cell.wall = false; cell.weight = 1; }
      else if (tool === TOOL.WEIGHT) { cell.wall = false; cell.weight = 5; }
      next[key(r, c)] = cell;
      return next;
    });
  }, [tool, cells, running, start, goal]);

  const resetVisualization = useCallback(() => {
    clearTimers();
    setVisitedSet(new Set());
    setPathSet(new Set());
    setRunning(false);
    setStatus('Idle');
  }, []);

  const clearAll = useCallback(() => {
    clearTimers();
    setCells(makeGrid(ROWS, COLS));
    setStart(INITIAL_START);
    setGoal(INITIAL_GOAL);
    setVisitedSet(new Set());
    setPathSet(new Set());
    setRunning(false);
    setStatus('Idle');
  }, []);

  const run = useCallback(() => {
    if (running) return;
    clearTimers();
    setVisitedSet(new Set());
    setPathSet(new Set());
    setRunning(true);
    setStatus(`Running ${algo}…`);

    const startNode = cells[key(start.row, start.col)];
    const goalNode = cells[key(goal.row, goal.col)];
    const algoFn = algo === ALGO.DFS ? dfs : algo === ALGO.DIJKSTRA ? dijkstra : bfs;
    const { visited, path } = algoFn(cells, startNode, goalNode, ROWS, COLS);

    const visitedAcc = new Set();
    visited.forEach((node, i) => {
      const t = setTimeout(() => {
        visitedAcc.add(key(node.row, node.col));
        setVisitedSet(new Set(visitedAcc));
      }, i * ANIM_MS);
      timeoutsRef.current.push(t);
    });

    if (!path.length) {
      const t = setTimeout(() => {
        setRunning(false);
        setStatus('No path found');
      }, visited.length * ANIM_MS + 50);
      timeoutsRef.current.push(t);
      return;
    }

    const pathAcc = new Set();
    const baseDelay = visited.length * ANIM_MS;
    path.forEach((node, i) => {
      const t = setTimeout(() => {
        pathAcc.add(key(node.row, node.col));
        setPathSet(new Set(pathAcc));
        if (i === path.length - 1) {
          setRunning(false);
          setStatus(`Found path — ${path.length} steps, ${visited.length} visited`);
        }
      }, baseDelay + i * 30);
      timeoutsRef.current.push(t);
    });
  }, [algo, cells, start, goal, running]);

  const grid = useMemo(() => {
    const out = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const k = key(r, c);
        const cell = cells[k];
        out.push(
          <Cell
            key={k}
            $start={isStart(r, c)}
            $goal={isGoal(r, c)}
            $wall={cell.wall}
            $visited={visitedSet.has(k)}
            $path={pathSet.has(k)}
            $weighted={!cell.wall && cell.weight > 1}
            onMouseDown={(e) => { e.preventDefault(); mouseDown.current = true; applyTool(r, c); }}
            onMouseEnter={() => { if (mouseDown.current) applyTool(r, c); }}
            onMouseUp={() => { mouseDown.current = false; }}
          >
            {!cell.wall && cell.weight > 1 ? cell.weight : ''}
          </Cell>
        );
      }
    }
    return out;
  }, [cells, visitedSet, pathSet, start, goal]);

  useEffect(() => {
    const up = () => { mouseDown.current = false; };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  return (
    <Wrap>
      <Toolbar>
        <ToolGroup>
          <Btn $active={tool === TOOL.WALL} onClick={() => setTool(TOOL.WALL)} title="Draw walls">Wall</Btn>
          <Btn $active={tool === TOOL.WEIGHT} onClick={() => setTool(TOOL.WEIGHT)} title="Weighted cell (cost 5)">Weight</Btn>
          <Btn $active={tool === TOOL.ERASE} onClick={() => setTool(TOOL.ERASE)} title="Erase">Erase</Btn>
          <Btn $active={tool === TOOL.START} onClick={() => setTool(TOOL.START)} title="Move start">Start</Btn>
          <Btn $active={tool === TOOL.GOAL} onClick={() => setTool(TOOL.GOAL)} title="Move goal">Goal</Btn>
        </ToolGroup>
        <ToolGroup>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Algo
            <Select value={algo} onChange={(e) => setAlgo(e.target.value)} disabled={running}>
              <option value={ALGO.BFS}>BFS</option>
              <option value={ALGO.DFS}>DFS</option>
              <option value={ALGO.DIJKSTRA}>Dijkstra</option>
            </Select>
          </label>
        </ToolGroup>
        <ToolGroup>
          <Btn onClick={run} disabled={running}>Visualize</Btn>
          <Btn onClick={resetVisualization} disabled={running}>Reset</Btn>
          <Btn onClick={clearAll} disabled={running}>Clear</Btn>
        </ToolGroup>
        <Status>{status}</Status>
      </Toolbar>
      <Stage onMouseLeave={() => { mouseDown.current = false; }}>
        <Board>{grid}</Board>
      </Stage>
      <Legend>
        <span><Swatch $color="#22c55e" />Start</span>
        <span><Swatch $color="#ef4444" />Goal</span>
        <span><Swatch $color="#1f2937" />Wall</span>
        <span><Swatch $color="rgba(233, 84, 32, 0.6)" />Weight (cost 5, Dijkstra only)</span>
        <span><Swatch $color="rgba(59, 130, 246, 0.55)" />Visited</span>
        <span><Swatch $color="#facc15" />Path</span>
      </Legend>
    </Wrap>
  );
}

export default PathFinder;

export const displayPathFinder = () => <PathFinder />;
