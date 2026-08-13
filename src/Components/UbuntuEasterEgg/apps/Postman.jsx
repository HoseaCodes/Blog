import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ubuntuTheme } from '../styled/tokens';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const TABS = ['Params', 'Headers', 'Body'];

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${ubuntuTheme.bg.coolGrey};
  color: ${ubuntuTheme.text.grey};
  font-family: ${ubuntuTheme.font.base};
  font-size: 0.875rem;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: ${ubuntuTheme.bg.windowTitle};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const MethodSelect = styled.select`
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px 8px;
  font: inherit;
  width: 100px;
  cursor: pointer;
`;

const UrlInput = styled.input`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 6px 10px;
  font: inherit;
  outline: 0;
  &:focus { border-color: ${ubuntuTheme.bg.orange}; }
`;

const SendBtn = styled.button`
  background: ${ubuntuTheme.bg.orange};
  color: #fff;
  border: 0;
  border-radius: 4px;
  padding: 6px 18px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  &:hover { filter: brightness(1.1); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Tabs = styled.div`
  display: flex;
  background: ${ubuntuTheme.bg.windowTitle};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0 8px;
`;

const Tab = styled.button`
  background: transparent;
  color: ${(p) => (p.$active ? '#fff' : 'rgba(255,255,255,0.6)')};
  border: 0;
  padding: 8px 14px;
  font: inherit;
  cursor: pointer;
  border-bottom: 2px solid ${(p) => (p.$active ? ubuntuTheme.bg.orange : 'transparent')};
  &:hover { color: #fff; }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Pane = styled.div`
  padding: 12px;
  overflow: auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex: 1 1 50%;
  min-height: 120px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 6px 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
`;

const Td = styled.td`
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  vertical-align: middle;
`;

const RowInput = styled.input`
  width: 100%;
  background: transparent;
  border: 0;
  outline: 0;
  color: #fff;
  font: inherit;
  padding: 6px 8px;
  &:focus { background: rgba(255, 255, 255, 0.04); }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin: 0 8px;
  cursor: pointer;
  accent-color: ${ubuntuTheme.bg.orange};
`;

const IconBtn = styled.button`
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px 10px;
  font: inherit;
  &:hover { color: ${ubuntuTheme.bg.orange}; }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  padding: 10px;
  font-family: ${ubuntuTheme.font.mono};
  font-size: 0.8125rem;
  resize: vertical;
  outline: 0;
  &:focus { border-color: ${ubuntuTheme.bg.orange}; }
`;

const Section = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
  margin-bottom: 8px;
`;

const ResponsePane = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  background: ${ubuntuTheme.bg.drkAbrgn};
  overflow: hidden;
`;

const ResponseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 12px;
  background: ${ubuntuTheme.bg.windowTitle};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.8125rem;
`;

const StatusPill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.75rem;
  color: #fff;
  background: ${(p) => {
    if (!p.$status) return 'rgba(255,255,255,0.1)';
    if (p.$status >= 200 && p.$status < 300) return '#16a34a';
    if (p.$status >= 300 && p.$status < 400) return '#0ea5e9';
    if (p.$status >= 400 && p.$status < 500) return '#f59e0b';
    return '#dc2626';
  }};
`;

const ResponseBody = styled.pre`
  flex: 1;
  margin: 0;
  padding: 12px;
  overflow: auto;
  font-family: ${ubuntuTheme.font.mono};
  font-size: 0.8125rem;
  color: #d1d5db;
  white-space: pre-wrap;
  word-break: break-word;
`;

const Toast = styled.div`
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.8125rem;
  border: 1px solid ${ubuntuTheme.bg.orange};
  z-index: 10;
`;

let _id = 0;
const nextId = () => ++_id;
const emptyRow = () => ({ id: nextId(), key: '', value: '', enabled: true });

function KeyValueTable({ rows, setRows, keyLabel = 'Key', valueLabel = 'Value' }) {
  const update = (id, patch) => setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id) => setRows(rows.filter((r) => r.id !== id));
  const ensureTrailing = (id, field, val) => {
    const updated = rows.map((r) => (r.id === id ? { ...r, [field]: val } : r));
    const last = updated[updated.length - 1];
    if (last && (last.key || last.value)) updated.push(emptyRow());
    setRows(updated);
  };

  return (
    <Table>
      <thead>
        <tr>
          <Th style={{ width: 36 }} />
          <Th>{keyLabel}</Th>
          <Th>{valueLabel}</Th>
          <Th style={{ width: 40 }} />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <Td style={{ textAlign: 'center' }}>
              <Checkbox checked={row.enabled} onChange={(e) => update(row.id, { enabled: e.target.checked })} />
            </Td>
            <Td>
              <RowInput
                value={row.key}
                placeholder={keyLabel}
                onChange={(e) => ensureTrailing(row.id, 'key', e.target.value)}
              />
            </Td>
            <Td>
              <RowInput
                value={row.value}
                placeholder={valueLabel}
                onChange={(e) => ensureTrailing(row.id, 'value', e.target.value)}
              />
            </Td>
            <Td style={{ textAlign: 'center' }}>
              {rows.length > 1 && <IconBtn onClick={() => remove(row.id)} title="Remove row">×</IconBtn>}
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

function buildKVObject(rows) {
  const out = {};
  rows.forEach((r) => {
    if (r.enabled && r.key.trim()) out[r.key.trim()] = r.value;
  });
  return out;
}

function prettyJson(value) {
  try {
    if (typeof value === 'string') return JSON.stringify(JSON.parse(value), null, 2);
    return JSON.stringify(value, null, 2);
  } catch {
    return typeof value === 'string' ? value : String(value);
  }
}

export function Postman() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/todos/1');
  const [tab, setTab] = useState('Params');
  const [params, setParams] = useState([emptyRow()]);
  const [headers, setHeaders] = useState([emptyRow()]);
  const [bodyText, setBodyText] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const send = async () => {
    if (!url.trim()) {
      showToast('Request URL is empty');
      return;
    }
    let data;
    if (bodyText.trim() && method !== 'GET') {
      try {
        data = JSON.parse(bodyText);
      } catch (e) {
        showToast('Body is not valid JSON');
        return;
      }
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    const startedAt = performance.now();
    try {
      const res = await axios({
        method: method.toLowerCase(),
        url: url.trim(),
        data,
        headers: buildKVObject(headers),
        params: buildKVObject(params),
        validateStatus: () => true,
      });
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
        data: res.data,
        time: Math.round(performance.now() - startedAt),
        size: JSON.stringify(res.data || '').length,
      });
    } catch (e) {
      setError(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => {
    if (e.key === 'Enter') send();
  };

  const responseText = useMemo(() => {
    if (!response) return '';
    return prettyJson(response.data);
  }, [response]);

  return (
    <Wrap>
      <TopBar>
        <MethodSelect value={method} onChange={(e) => setMethod(e.target.value)}>
          {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
        </MethodSelect>
        <UrlInput
          value={url}
          spellCheck={false}
          autoComplete="off"
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={onKey}
          placeholder="https://api.example.com/resource"
        />
        <SendBtn onClick={send} disabled={loading}>{loading ? 'Sending…' : 'Send'}</SendBtn>
      </TopBar>

      <Tabs>
        {TABS.map((t) => (
          <Tab key={t} $active={tab === t} onClick={() => setTab(t)}>{t}</Tab>
        ))}
      </Tabs>

      <Body>
        <Pane>
          {tab === 'Params' && (
            <>
              <Section>Query Params</Section>
              <KeyValueTable rows={params} setRows={setParams} keyLabel="Key" valueLabel="Value" />
            </>
          )}
          {tab === 'Headers' && (
            <>
              <Section>Headers</Section>
              <KeyValueTable rows={headers} setRows={setHeaders} keyLabel="Header" valueLabel="Value" />
            </>
          )}
          {tab === 'Body' && (
            <>
              <Section>JSON Body{method === 'GET' ? ' (ignored for GET)' : ''}</Section>
              <Textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder={'{\n  "key": "value"\n}'}
                spellCheck={false}
              />
            </>
          )}
        </Pane>

        <ResponsePane>
          <ResponseHeader>
            <span>Response</span>
            {response && (
              <>
                <StatusPill $status={response.status}>
                  {response.status} {response.statusText}
                </StatusPill>
                <span>{response.time} ms</span>
                <span>{response.size} B</span>
              </>
            )}
            {error && <StatusPill $status={500}>Error</StatusPill>}
          </ResponseHeader>
          <ResponseBody>
            {error ? error : responseText || (loading ? 'Sending request…' : 'Send a request to see the response.')}
          </ResponseBody>
        </ResponsePane>
      </Body>

      {toast && <Toast>{toast}</Toast>}
    </Wrap>
  );
}

export default Postman;

export const displayPostman = () => <Postman />;
