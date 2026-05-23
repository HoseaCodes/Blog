import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { GlobalState } from '../../GlobalState';
import aiArtAPI from '../../API/AIArtAPI';
import './CreateArt.css';

const PROVIDERS = [
  { key: 'dalle', label: 'DALL-E 3' },
  { key: 'stability', label: 'Stability SDXL' },
];

function CreateArt() {
  const state = useContext(GlobalState);
  const [isLoggedIn] = state?.userAPI?.isLoggedIn || [false];

  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('dalle');
  const [previews, setPreviews] = useState([]);
  const [purchased, setPurchased] = useState({});
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [paypalConfig, setPaypalConfig] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    aiArtAPI
      .getPaypalConfig()
      .then(setPaypalConfig)
      .catch((err) => console.warn('PayPal config unavailable:', err.message));
  }, [isLoggedIn]);

  const paypalProviderOptions = useMemo(
    () =>
      paypalConfig?.clientId
        ? { clientId: paypalConfig.clientId, currency: paypalConfig.currency || 'USD' }
        : null,
    [paypalConfig]
  );

  const handleGenerate = async () => {
    setError('');
    if (prompt.trim().length < 3) {
      setError('Prompt must be at least 3 characters.');
      return;
    }
    setGenerating(true);
    try {
      const product = await aiArtAPI.generatePreview({ prompt, provider });
      setPreviews((prev) => [product, ...prev]);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handlePurchaseSuccess = async (productId, orderId) => {
    try {
      await aiArtAPI.captureOrder(orderId);
      const download = await aiArtAPI.getDownloadUrl(productId);
      setPurchased((prev) => ({
        ...prev,
        [productId]: { downloadUrl: download.downloadUrl, downloadsRemaining: download.downloadsRemaining },
      }));
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Payment capture failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="create-art-page">
        <div className="create-art-login-gate">
          <h2>Sign in to create AI art</h2>
          <p>
            You need an account to generate previews and purchase downloads.{' '}
            <Link to="/login">Log in</Link> or <Link to="/register">register</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-art-page">
      <header className="create-art-header">
        <h1>Create Your Own AI Art</h1>
        <p>
          Describe what you want. Pick a model. Preview is watermarked; pay $5 to download the
          clean PNG.
        </p>
      </header>

      <div className="create-art-form">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A neon koi fish swimming through a misty pine forest at dusk, cinematic lighting"
          maxLength={1000}
          disabled={generating}
        />
        <div className="create-art-controls">
          <div className="provider-toggle" role="tablist" aria-label="Image provider">
            {PROVIDERS.map((p) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                aria-selected={provider === p.key}
                className={provider === p.key ? 'active' : ''}
                onClick={() => setProvider(p.key)}
                disabled={generating}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="generate-btn"
            onClick={handleGenerate}
            disabled={generating || prompt.trim().length < 3}
          >
            {generating ? 'Generating…' : 'Generate Preview'}
          </button>
        </div>
      </div>

      {error && <div className="create-art-error" role="alert">{error}</div>}

      <div className="create-art-cta-row">
        <Link to="/shop/my-art">View your purchased art →</Link>
      </div>

      {previews.length > 0 && (
        <div className="preview-grid" style={{ marginTop: 20 }}>
          {previews.map((p) => {
            const bought = purchased[p._id];
            return (
              <div className="preview-card" key={p._id}>
                <img src={p.previewUrl} alt={p.title} />
                <div className="preview-card-body">
                  <p className="preview-card-title">{p.title}</p>
                  <span className="preview-card-meta">
                    {p.model} · ${Number(p.price).toFixed(2)}
                  </span>
                  {bought ? (
                    <div className="preview-card-purchased">
                      <span>✓ Purchased ({bought.downloadsRemaining} downloads left)</span>
                      <a href={bought.downloadUrl} target="_blank" rel="noopener noreferrer">
                        Download clean PNG
                      </a>
                    </div>
                  ) : paypalProviderOptions ? (
                    <PayPalScriptProvider options={paypalProviderOptions}>
                      <PayPalButtons
                        style={{ layout: 'horizontal', label: 'pay', height: 36 }}
                        createOrder={async () => {
                          return await aiArtAPI.createOrder(p._id);
                        }}
                        onApprove={(data) => handlePurchaseSuccess(p._id, data.orderID)}
                        onError={(err) => {
                          console.error('PayPal error', err);
                          setError('PayPal error: ' + (err?.message || 'unknown'));
                        }}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <p className="preview-card-meta">PayPal is not configured yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CreateArt;
