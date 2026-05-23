import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import moment from "moment-timezone";
import { useHistory } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { apiLocal } from "../../services/authService";

const initialState = {
  name: "",
  email: "",
  password: "",
  role: 0,
};

const Page = styled.div`
  min-height: 80vh;
  background: #f5f7fb;
  padding: 32px 24px;
`;

const Shell = styled.div`
  max-width: 1180px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleBlock = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #0f172a;
    margin: 0;
    line-height: 1.2;
  }
  p {
    font-size: 14px;
    color: #64748b;
    margin: 4px 0 0;
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  appearance: none;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  color: #0f172a;
  width: 240px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const PrimaryButton = styled.button`
  background: #4f46e5;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 9px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, transform 0.05s;

  &:hover { background: #4338ca; }
  &:active { transform: translateY(1px); }
`;

const GhostButton = styled.button`
  background: transparent;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 14px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover { background: #f1f5f9; }
`;

const DangerLink = styled.button`
  background: transparent;
  color: #dc2626;
  border: 0;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;

  &:hover { text-decoration: underline; }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  overflow: hidden;
`;

const TableWrap = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  thead th {
    text-align: left;
    font-weight: 500;
    color: #64748b;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 14px 18px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }

  tbody td {
    padding: 14px 18px;
    border-bottom: 1px solid #f1f5f9;
    color: #0f172a;
    vertical-align: middle;
  }

  tbody tr:hover {
    background: #fafbff;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const UserCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.span`
  font-size: 13px;
  line-height: 1.3;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ bg }) => bg || "#e0e7ff"};
  color: #4338ca;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  background-image: ${({ src }) => (src ? `url(${src})` : "none")};
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ tone }) =>
    tone === "admin" ? "#ede9fe" : "#ecfdf5"};
  color: ${({ tone }) => (tone === "admin" ? "#5b21b6" : "#047857")};
`;

const EmptyState = styled.div`
  padding: 56px 24px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const ErrorBox = styled.div`
  margin: 0 0 16px;
  padding: 12px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 8px;
  font-size: 13px;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
`;

const ModalCard = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 460px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);

  h3 {
    margin: 0 0 16px;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }

  label {
    display: block;
    font-size: 13px;
    color: #475569;
    margin-bottom: 4px;
  }

  input,
  textarea,
  select {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 14px;
    margin-bottom: 14px;
    background: #fff;
    color: #0f172a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 4px;
  }
`;

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?";

const isAdminRole = (role) => role === 1 || role === "admin";

const formatJoined = (date) => {
  if (!date) return "—";
  const d = moment.utc(date);
  if (!d.isValid()) return "—";
  return d.format("MMM D, YYYY");
};

const UsersList = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(false);
  const [userView, setUserView] = useState(false);
  const [createdUser, setCreatedUser] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId) return;
    if (!isAdminRole(user?.role)) {
      setError("Admin role required to view users.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    const getAllUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiLocal.get(`/api/user/admin/all`);
        if (cancelled) return;
        const list = res.data?.users || res.data?.data || (Array.isArray(res.data) ? res.data : []);
        setUsers(list);
      } catch (err) {
        if (cancelled) return;
        setError(
          err.response?.status
            ? `Request failed (${err.response.status}) — ${err.response?.data?.msg || err.response?.data?.error || err.response?.statusText || "see console"}`
            : err.message
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getAllUsers();
    return () => {
      cancelled = true;
    };
  }, [userId, user?.role, active]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/api/user/${id}`);
      setActive((a) => !a);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete user");
    }
  };

  const addUser = async (e) => {
    e?.preventDefault?.();
    try {
      await api.post(`/register`, { ...createdUser });
      setUserView(false);
      setCreatedUser(initialState);
      setActive((a) => !a);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add user");
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setCreatedUser({ ...createdUser, [name]: value });
  };

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <Page>
      <Shell>
        <Header>
          <TitleBlock>
            <h1>User Management</h1>
            <p>{loading ? "Loading users…" : `${users.length} ${users.length === 1 ? "user" : "users"} total`}</p>
          </TitleBlock>
          <Toolbar>
            <SearchInput
              type="search"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <PrimaryButton onClick={() => setUserView(true)}>+ Add User</PrimaryButton>
          </Toolbar>
        </Header>

        {error && <ErrorBox>{error}</ErrorBox>}

        <Card>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th style={{ width: 1 }}></th>
                </tr>
              </thead>
              <tbody>
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <EmptyState>
                        {users.length === 0
                          ? "No users to show yet."
                          : "No users match your search."}
                      </EmptyState>
                    </td>
                  </tr>
                )}
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <UserCell>
                        <Avatar src={u.avatar}>{!u.avatar && initials(u.name)}</Avatar>
                        <UserMeta>
                          <UserName>{u.name || "Unnamed"}</UserName>
                          <UserEmail>{u.email}</UserEmail>
                        </UserMeta>
                      </UserCell>
                    </td>
                    <td>
                      <Badge tone={isAdminRole(u.role) ? "admin" : "basic"}>
                        {isAdminRole(u.role) ? "Admin" : "Basic"}
                      </Badge>
                    </td>
                    <td style={{ color: "#475569" }}>{formatJoined(u.createdAt)}</td>
                    <td>
                      <DangerLink onClick={() => deleteUser(u._id)}>Delete</DangerLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        </Card>
      </Shell>

      {userView && (
        <Modal onClick={() => setUserView(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <h3>Add User</h3>
            <form onSubmit={addUser}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={createdUser.name}
                onChange={handleChangeInput}
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={createdUser.email}
                onChange={handleChangeInput}
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                required
                value={createdUser.password}
                onChange={handleChangeInput}
              />

              <label htmlFor="role">Role</label>
              <select
                name="role"
                id="role"
                value={createdUser.role}
                onChange={handleChangeInput}
              >
                <option value={0}>Basic</option>
                <option value={1}>Admin</option>
              </select>

              <div className="actions">
                <GhostButton type="button" onClick={() => setUserView(false)}>
                  Cancel
                </GhostButton>
                <PrimaryButton type="submit">Save</PrimaryButton>
              </div>
            </form>
          </ModalCard>
        </Modal>
      )}
    </Page>
  );
};

export default UsersList;
