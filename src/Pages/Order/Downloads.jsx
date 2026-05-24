import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';
import aiArtAPI from '../../API/AIArtAPI';
import './Downloads.css';

function Downloads() {
  const state = useContext(GlobalState);
  const [isLoggedIn] = state?.userAPI?.isLoggedIn || [false];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [perItemError, setPerItemError] = useState({});

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    setLoading(true);
    aiArtAPI
      .listMyPurchases()
      .then((data) => {
        if (cancelled) return;
        setItems(data.items || []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.msg || err.message || 'Failed to load purchases');
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleDownload = async (productId) => {
    setDownloadingId(productId);
    setPerItemError((prev) => ({ ...prev, [productId]: null }));
    try {
      const data = await aiArtAPI.getDownloadUrl(productId);
      window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
      setItems((prev) =>
        prev.map((it) =>
          String(it.productId) === String(productId)
            ? { ...it, downloadsRemaining: data.downloadsRemaining }
            : it
        )
      );
    } catch (err) {
      setPerItemError((prev) => ({
        ...prev,
        [productId]: err.response?.data?.msg || err.message || 'Download failed',
      }));
    } finally {
      setDownloadingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="downloads-page-wrap">
        <div className="downloads-page">
          <div className="downloads-empty">
            <p>
              Please <Link to="/login">log in</Link> to view your downloads.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="downloads-page-wrap">
    <div className="downloads-page">
      <header className="downloads-header">
        <h1>Your AI Art</h1>
        <p>
          Each purchase includes 5 downloads, valid for 30 days from purchase.{' '}
          <Link to="/shop/create-art">Create more →</Link>
        </p>
      </header>

      {error && <div className="downloads-empty" role="alert">{error}</div>}

      {loading ? (
        <p>Loading your purchases…</p>
      ) : items.length === 0 ? (
        <div className="downloads-empty">
          <p>
            No purchased art yet. <Link to="/shop/create-art">Create your first piece →</Link>
          </p>
        </div>
      ) : (
        <div className="downloads-grid">
          {items.map((item) => (
            <div className="download-card" key={item.purchaseId}>
              {item.thumbUrl && <img src={item.thumbUrl} alt={item.title} />}
              <div className="download-card-body">
                <p className="download-card-title">{item.title}</p>
                <span className="download-card-meta">
                  {item.aiModel} · {new Date(item.purchasedAt).toLocaleDateString()}
                </span>
                <span className="download-card-meta">
                  {item.downloadsRemaining} downloads remaining
                </span>
                <button
                  type="button"
                  className="download-card-btn"
                  onClick={() => handleDownload(item.productId)}
                  disabled={downloadingId === item.productId || item.downloadsRemaining <= 0}
                >
                  {downloadingId === item.productId ? 'Preparing…' : 'Download PNG'}
                </button>
                {perItemError[item.productId] && (
                  <p className="download-card-error">{perItemError[item.productId]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default Downloads;
