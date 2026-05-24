import React, { useState, useContext, useEffect, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import moment from "moment-timezone";
import {
  FiUpload,
  FiTrash2,
  FiCopy,
  FiSearch,
  FiArrowLeft,
  FiX,
  FiImage,
} from "react-icons/fi";
import { GlobalState } from "../../GlobalState";

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const Page = styled.section`
  background: #0f1216;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 96px 24px 48px;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      55% 50% at 50% 0%,
      rgba(32, 106, 93, 0.16),
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(
      ellipse 70% 60% at 50% 30%,
      #000 30%,
      transparent 100%
    );
    -webkit-mask-image: radial-gradient(
      ellipse 70% 60% at 50% 30%,
      #000 30%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 720px) {
    padding: 64px 18px 32px;
  }
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #6b7479;
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.15s ease;

  &:hover {
    color: #d2d8da;
    text-decoration: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 28px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Kicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;

  &::before {
    content: "";
    width: 24px;
    height: 1px;
    background: #5bb39e;
    opacity: 0.6;
  }
`;

const Heading = styled.h1`
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.022em;
  color: #f4f6f8;
  margin: 0;
`;

const Tagline = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: #a3acb2;
  margin: 0;
`;

const UploadBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 10px;
  background: #206a5d;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(32, 106, 93, 0.28);
  transition: background 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: #267a6b;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(32, 106, 93, 0.4);
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 240px;
  max-width: 420px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7479;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 11px 14px 11px 38px;
  border-radius: 10px;
  background: rgba(15, 18, 22, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &::placeholder {
    color: #6b7479;
  }
  &:focus {
    border-color: rgba(91, 179, 158, 0.45);
    box-shadow: 0 0 0 3px rgba(91, 179, 158, 0.15);
  }
`;

const Count = styled.span`
  font-size: 13px;
  color: #6b7479;
  letter-spacing: 0.01em;

  strong {
    color: #f4f6f8;
    font-weight: 600;
  }
`;

const Grid = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 120px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    padding: 0 18px 80px;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
`;

const Tile = styled.article`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: border-color 0.22s ease, transform 0.22s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.22);
    transform: translateY(-2px);
  }
`;

const Thumb = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #14191e center / cover no-repeat;
  background-image: url(${({ bg }) => bg});
`;

const Body = styled.div`
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Filename = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #f4f6f8;
  letter-spacing: -0.005em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #6b7479;
  letter-spacing: 0.01em;
`;

const SourcePill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: ${({ tone }) =>
    tone === "product"
      ? "rgba(91, 179, 158, 0.1)"
      : "rgba(255, 255, 255, 0.04)"};
  border: 1px solid
    ${({ tone }) =>
      tone === "product"
        ? "rgba(91, 179, 158, 0.28)"
        : "rgba(255, 255, 255, 0.08)"};
  color: ${({ tone }) => (tone === "product" ? "#5bb39e" : "#c5cbcf")};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  padding: 0 14px 14px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex: 1;
  padding: 7px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    border-color: ${({ tone }) =>
      tone === "danger"
        ? "rgba(248, 113, 113, 0.35)"
        : "rgba(91, 179, 158, 0.3)"};
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 64px 24px;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: #6b7479;
  font-size: 14px;
`;

/* ---- Modal ---- */

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 50;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 460px;
  padding: 28px;
  border-radius: 18px;
  background: #14191e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);

  h3 {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 700;
    color: #f4f6f8;
    letter-spacing: -0.012em;
  }
  p {
    margin: 0 0 18px;
    font-size: 13px;
    color: #a3acb2;
    line-height: 1.5;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;

  button {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: transparent;
    color: #6b7479;
    border: 1px solid rgba(255, 255, 255, 0.06);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease, border-color 0.15s ease;
    &:hover {
      color: #f4f6f8;
      border-color: rgba(255, 255, 255, 0.18);
    }
  }
`;

const Dropzone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  border-radius: 14px;
  border: 1.5px dashed rgba(91, 179, 158, 0.3);
  background: rgba(91, 179, 158, 0.04);
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.5);
    background: rgba(91, 179, 158, 0.07);
  }

  svg {
    color: #5bb39e;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #f4f6f8;
  }
  .hint {
    font-size: 12px;
    color: #6b7479;
  }

  input[type="file"] {
    display: none;
  }
`;

const PreviewBox = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 12px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  button {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.6);
    color: #f4f6f8;
    border: 1px solid rgba(255, 255, 255, 0.18);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const LoadingState = styled.div`
  padding: 32px;
  text-align: center;
  color: #a3acb2;
  font-size: 13px;
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const UploadList = () => {
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [token] = state.token;
  const [isAdmin] = state.userAPI.isAdmin;

  const [uploads, setUploads] = useState([]);
  const [active, setActive] = useState(false);
  const [uploadView, setUploadView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const history = useHistory();

  useEffect(() => {
    const getAllUploads = async () => {
      try {
        const res = await axios.post(`/api/allImages`);
        setUploads(res.data?.result?.resources || []);
      } catch (err) {
        console.error("Failed to load uploads:", err);
      }
    };
    getAllUploads();
  }, [active]);

  const deleteUpload = async (publicId) => {
    if (!window.confirm("Delete this upload? This cannot be undone.")) return;
    try {
      await axios.post(
        "/api/destory",
        { public_id: publicId },
        { headers: { Authorization: token } }
      );
      setActive((a) => !a);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete upload");
    }
  };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // noop — fall back if clipboard API is unavailable
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!isAdmin) return alert("You're not an admin");
    const file = e.target.files[0];
    if (!file) return alert("File doesn't exist");
    if (file.size > 1024 * 1024) return alert("Size too large (max 1MB)");
    if (file.type !== "image/jpeg" && file.type !== "image/png")
      return alert("File must be JPEG or PNG");

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    try {
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });
      setPreview({
        url: res.data.result.secure_url,
        id: res.data.result.public_id,
      });
      setActive((a) => !a);
    } catch (err) {
      alert(err.response?.data?.msg || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setUploadView(false);
    setPreview(null);
  };

  /* ------------------------------------------------------------------
     Build the combined list (products + raw uploads) once, then filter
  ------------------------------------------------------------------ */

  const items = useMemo(() => {
    const productItems = (products || []).map((p) => ({
      id: `p-${p._id}`,
      url: p.images?.url || "",
      publicId: p.images?.id || "",
      label: p.title || "Untitled product",
      folder: "Products",
      createdAt: p.createdAt || null,
      source: "product",
    }));
    const rawUploads = (uploads || []).map((u) => ({
      id: `u-${u.asset_id || u.public_id}`,
      url: u.secure_url,
      publicId: u.public_id,
      label: u.public_id?.split("/").pop() || u.public_id || "Untitled",
      folder: u.folder || "Root",
      createdAt: u.created_at || null,
      source: "upload",
    }));
    return [...productItems, ...rawUploads].sort((a, b) => {
      const aT = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bT = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bT - aT;
    });
  }, [products, uploads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label?.toLowerCase().includes(q) ||
        i.folder?.toLowerCase().includes(q) ||
        i.publicId?.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <Page>
      <HeroSection>
        <Shell>
          <BackLink to="/admin">
            <FiArrowLeft size={12} />
            Admin overview
          </BackLink>
          <Header>
            <TitleBlock>
              <Kicker>Admin · Uploads</Kicker>
              <Heading>Media library.</Heading>
              <Tagline>
                Images and assets across the platform. Upload, search, copy
                URLs, or remove what you no longer need.
              </Tagline>
            </TitleBlock>
            <UploadBtn onClick={() => setUploadView(true)}>
              <FiUpload size={16} />
              Upload
            </UploadBtn>
          </Header>

          <ToolbarRow>
            <SearchWrap>
              <FiSearch size={14} />
              <SearchInput
                type="search"
                placeholder="Search by filename, folder, or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchWrap>
            <Count>
              <strong>{filtered.length}</strong> of {items.length}
            </Count>
          </ToolbarRow>
        </Shell>
      </HeroSection>

      <Grid>
        {filtered.length === 0 ? (
          <EmptyState>
            {items.length === 0
              ? "No uploads yet. Click \"Upload\" to add an image."
              : "No uploads match your search."}
          </EmptyState>
        ) : (
          filtered.map((item) => (
            <Tile key={item.id}>
              <Thumb bg={item.url} />
              <Body>
                <Filename title={item.label}>{item.label}</Filename>
                <Meta>
                  <SourcePill tone={item.source}>
                    {item.source === "product" ? "Product" : "Upload"}
                  </SourcePill>
                  {item.createdAt && (
                    <span>
                      {moment.utc(item.createdAt).format("MMM D, YYYY")}
                    </span>
                  )}
                </Meta>
              </Body>
              <Actions>
                <ActionBtn onClick={() => copyUrl(item.url)}>
                  <FiCopy size={11} />
                  Copy URL
                </ActionBtn>
                <ActionBtn
                  tone="danger"
                  onClick={() => deleteUpload(item.publicId)}
                >
                  <FiTrash2 size={11} />
                  Delete
                </ActionBtn>
              </Actions>
            </Tile>
          ))
        )}
      </Grid>

      {uploadView && (
        <Modal onClick={closeModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>Upload an image</h3>
              <button onClick={closeModal} aria-label="Close">
                <FiX size={14} />
              </button>
            </ModalHeader>
            <p>JPEG or PNG, max 1MB.</p>

            {loading ? (
              <LoadingState>Uploading…</LoadingState>
            ) : preview ? (
              <PreviewBox>
                <img src={preview.url} alt="upload preview" />
                <button
                  onClick={() => {
                    deleteUpload(preview.id);
                    setPreview(null);
                  }}
                  aria-label="Remove preview"
                >
                  <FiX size={12} />
                </button>
              </PreviewBox>
            ) : (
              <Dropzone>
                <FiImage size={28} />
                <span className="title">Click to choose an image</span>
                <span className="hint">JPEG / PNG · 1MB max</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleUpload}
                />
              </Dropzone>
            )}
          </ModalCard>
        </Modal>
      )}
    </Page>
  );
};

export default UploadList;
