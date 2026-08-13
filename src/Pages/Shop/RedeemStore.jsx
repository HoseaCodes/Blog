import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import storeAPI from '../../API/StoreAPI';
import { GlobalState } from '../../GlobalState';
import { useGameScore } from '../../Context/GameScoreContext';
import './RedeemStore.css';

const RedeemStore = () => {
  const state = useContext(GlobalState);
  const [isLoggedIn] = state?.userAPI?.isLoggedIn || [false];
  const { pointsBalance, openBuyPoints, refreshBalance } = useGameScore();

  const [items, setItems] = useState([]);
  const [owned, setOwned] = useState({}); // productId → { downloadsRemaining }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redeeming, setRedeeming] = useState(null); // productId
  const [downloading, setDownloading] = useState(null);
  const [perItemError, setPerItemError] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    Promise.all([
      storeAPI.listItems().catch((err) => {
        setError(err.response?.data?.msg || err.message || 'Failed to load store');
        return [];
      }),
      isLoggedIn
        ? storeAPI.listMyRedemptions().catch(() => [])
        : Promise.resolve([]),
    ])
      .then(([catalog, mine]) => {
        if (cancelled) return;
        setItems(catalog);
        const ownedMap = {};
        mine.forEach((r) => {
          ownedMap[String(r.productId)] = { downloadsRemaining: r.downloadsRemaining };
        });
        setOwned(ownedMap);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const handleRedeem = async (item) => {
    setRedeeming(item._id);
    setPerItemError((prev) => ({ ...prev, [item._id]: null }));
    try {
      const result = await storeAPI.redeem(item._id);
      setOwned((prev) => ({
        ...prev,
        [item._id]: { downloadsRemaining: result.downloadsRemaining },
      }));
      refreshBalance();
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 402 && data) {
        setPerItemError((prev) => ({
          ...prev,
          [item._id]: `Need ${data.required.toLocaleString()} pts (you have ${data.balance.toLocaleString()})`,
        }));
      } else {
        setPerItemError((prev) => ({
          ...prev,
          [item._id]: data?.msg || err.message || 'Redeem failed',
        }));
      }
    } finally {
      setRedeeming(null);
    }
  };

  const handleDownload = async (item) => {
    setDownloading(item._id);
    setPerItemError((prev) => ({ ...prev, [item._id]: null }));
    try {
      const data = await storeAPI.getDownloadUrl(item._id);
      window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
      setOwned((prev) => ({
        ...prev,
        [item._id]: { downloadsRemaining: data.downloadsRemaining },
      }));
    } catch (err) {
      setPerItemError((prev) => ({
        ...prev,
        [item._id]: err.response?.data?.msg || err.message || 'Download failed',
      }));
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="redeem-page-wrap">
      <div className="redeem-page">
        <header className="redeem-header">
          <div className="redeem-header-left">
            <span className="redeem-kicker">── Redeem Store ──</span>
            <h1>Spend points on digital items</h1>
            <p>
              Earned in the <Link to="/gamecorner">Game Corner</Link>. Spend here. Items
              never expire and live in <Link to="/shop/my-art">your library</Link>.
            </p>
          </div>
          <div className="redeem-balance-card">
            <span className="redeem-balance-label">Balance</span>
            <span className="redeem-balance-value">
              {pointsBalance.toLocaleString()} pts
            </span>
            <button
              type="button"
              className="redeem-buy-btn"
              onClick={openBuyPoints}
            >
              Buy more
            </button>
          </div>
        </header>

        {error && (
          <div className="redeem-error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <p className="redeem-muted">Loading the catalog…</p>
        ) : items.length === 0 ? (
          <div className="redeem-empty">
            <p>No redeemable items yet. Check back soon.</p>
            <p className="redeem-muted">
              Admin: create one at{' '}
              <Link to="/admin/shop/create_product">Create product</Link> and set its
              price type to <strong>points</strong>.
            </p>
          </div>
        ) : (
          <div className="redeem-grid">
            {items.map((item) => {
              const isOwned = !!owned[item._id];
              const canAfford = isLoggedIn && pointsBalance >= item.pointsPrice;
              return (
                <article className="redeem-card" key={item._id}>
                  {item.coverUrl && (
                    <div className="redeem-card-cover">
                      <img src={item.coverUrl} alt={item.title} />
                    </div>
                  )}
                  <div className="redeem-card-body">
                    <h3 className="redeem-card-title">{item.title}</h3>
                    <p className="redeem-card-desc">{item.description}</p>
                    <div className="redeem-card-price-row">
                      <span className="redeem-card-price">
                        {item.pointsPrice.toLocaleString()} pts
                      </span>
                      {item.category && (
                        <span className="redeem-card-cat">{item.category}</span>
                      )}
                    </div>

                    {isOwned ? (
                      <div className="redeem-card-owned">
                        <span>
                          ✓ Owned ({owned[item._id].downloadsRemaining} downloads left)
                        </span>
                        <button
                          type="button"
                          className="redeem-card-btn"
                          onClick={() => handleDownload(item)}
                          disabled={
                            downloading === item._id ||
                            owned[item._id].downloadsRemaining <= 0
                          }
                        >
                          {downloading === item._id ? 'Preparing…' : 'Download'}
                        </button>
                      </div>
                    ) : !isLoggedIn ? (
                      <Link to="/login" className="redeem-card-btn redeem-card-btn-link">
                        Log in to redeem
                      </Link>
                    ) : (
                      <div className="redeem-card-actions">
                        <button
                          type="button"
                          className="redeem-card-btn"
                          onClick={() => handleRedeem(item)}
                          disabled={!canAfford || redeeming === item._id}
                        >
                          {redeeming === item._id
                            ? 'Redeeming…'
                            : canAfford
                            ? 'Redeem'
                            : 'Not enough pts'}
                        </button>
                        {!canAfford && (
                          <button
                            type="button"
                            className="redeem-buy-more"
                            onClick={openBuyPoints}
                          >
                            Buy more →
                          </button>
                        )}
                      </div>
                    )}

                    {perItemError[item._id] && (
                      <p className="redeem-card-error">{perItemError[item._id]}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemStore;
