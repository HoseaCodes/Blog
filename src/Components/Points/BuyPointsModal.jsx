import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useGameScore } from '../../Context/GameScoreContext';
import pointsAPI from '../../API/PointsAPI';
import aiArtAPI from '../../API/AIArtAPI';

const fade = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const rise = keyframes`
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 6000;
  background: rgba(8, 10, 12, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fade} 0.18s ease;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: #14191e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 24px;
  color: #f4f6f8;
  font-family: "Lato", system-ui, sans-serif;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  animation: ${rise} 0.22s ease;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0 0 4px;
`;

const Sub = styled.div`
  font-size: 13px;
  color: #a3acb2;
`;

const Balance = styled.span`
  color: #5bb39e;
  font-weight: 700;
`;

const Close = styled.button`
  background: transparent;
  border: 0;
  color: #a3acb2;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 8px;
  &:hover { color: #fff; }
`;

const Pack = styled.div`
  border: 1px solid
    ${(p) => (p.$selected ? 'rgba(91, 179, 158, 0.6)' : 'rgba(255, 255, 255, 0.08)')};
  background: ${(p) =>
    p.$selected
      ? 'linear-gradient(180deg, rgba(91, 179, 158, 0.12), rgba(32, 106, 93, 0.08))'
      : 'rgba(255, 255, 255, 0.025)'};
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: border-color 0.15s, background 0.15s;
  &:hover {
    border-color: rgba(91, 179, 158, 0.45);
  }
`;

const PackLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const PackLabel = styled.span`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #a3acb2;
`;

const PackPoints = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #f4f6f8;
`;

const PackBonus = styled.span`
  font-size: 12px;
  color: #5bb39e;
  font-weight: 600;
`;

const PackPrice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const PackUsd = styled.span`
  font-size: 18px;
  font-weight: 700;
`;

const PackUnit = styled.span`
  font-size: 11px;
  color: #6b7479;
`;

const PayArea = styled.div`
  margin-top: 8px;
  min-height: 50px;
`;

const Status = styled.div`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${(p) => (p.$error ? 'rgba(248, 113, 113, 0.1)' : 'rgba(91, 179, 158, 0.1)')};
  color: ${(p) => (p.$error ? '#f8b4b4' : '#9bd4c4')};
  font-size: 14px;
  margin-bottom: 14px;
  border: 1px solid
    ${(p) => (p.$error ? 'rgba(248, 113, 113, 0.25)' : 'rgba(91, 179, 158, 0.25)')};
`;

const Hint = styled.p`
  font-size: 12px;
  color: #6b7479;
  margin: 14px 0 0;
  line-height: 1.5;
`;

const LoginPrompt = styled.p`
  font-size: 13px;
  color: #a3acb2;
  margin: 0;
  text-align: center;
  padding: 24px;
  a {
    color: #5bb39e;
    font-weight: 600;
  }
`;

const BuyPointsModal = () => {
  const {
    buyPointsModalOpen,
    closeBuyPoints,
    isLoggedIn,
    pointsBalance,
    refreshBalance,
  } = useGameScore();

  const [packs, setPacks] = useState([]);
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [status, setStatus] = useState(null); // { kind: 'success' | 'error', msg }
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  useEffect(() => {
    if (!buyPointsModalOpen) return;
    let cancelled = false;
    setStatus(null);
    setLoadingCatalog(true);
    Promise.all([
      pointsAPI.getPacks().catch(() => []),
      aiArtAPI.getPaypalConfig().catch(() => null),
    ])
      .then(([packList, paypal]) => {
        if (cancelled) return;
        setPacks(packList || []);
        setPaypalConfig(paypal || null);
        if (packList && packList.length && !selectedId) {
          // Default to the middle pack (best balance of value + commitment).
          const def = packList[Math.min(1, packList.length - 1)];
          setSelectedId(def.id);
        }
      })
      .finally(() => !cancelled && setLoadingCatalog(false));
    return () => {
      cancelled = true;
    };
  }, [buyPointsModalOpen]);

  if (!buyPointsModalOpen) return null;

  const selectedPack = packs.find((p) => p.id === selectedId) || null;

  const paypalProviderOptions = paypalConfig?.clientId
    ? { clientId: paypalConfig.clientId, currency: paypalConfig.currency || 'USD' }
    : null;

  const handleApprove = async (data, pack) => {
    try {
      const result = await pointsAPI.capturePackOrder({
        orderId: data.orderID,
        packId: pack.id,
      });
      setStatus({
        kind: 'success',
        msg: `+${result.credited.toLocaleString()} pts credited. Balance: ${result.balance.toLocaleString()}.`,
      });
      refreshBalance();
    } catch (err) {
      setStatus({
        kind: 'error',
        msg: err.response?.data?.msg || err.message || 'Capture failed',
      });
    }
  };

  return (
    <Overlay onClick={closeBuyPoints}>
      <Sheet onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Buy points">
        <Header>
          <div>
            <Title>Buy points</Title>
            <Sub>
              Current balance: <Balance>{pointsBalance.toLocaleString()} pts</Balance>
            </Sub>
          </div>
          <Close type="button" onClick={closeBuyPoints} aria-label="Close">
            ×
          </Close>
        </Header>

        {!isLoggedIn ? (
          <LoginPrompt>
            <a href="/login">Log in</a> to purchase point packs. Your purchase is tied to your
            account and persists across devices.
          </LoginPrompt>
        ) : (
          <>
            {status && (
              <Status $error={status.kind === 'error'}>{status.msg}</Status>
            )}

            {loadingCatalog ? (
              <Sub>Loading packs…</Sub>
            ) : packs.length === 0 ? (
              <Sub>No packs available right now.</Sub>
            ) : (
              packs.map((pack) => (
                <Pack
                  key={pack.id}
                  $selected={pack.id === selectedId}
                  onClick={() => {
                    setSelectedId(pack.id);
                    setStatus(null);
                  }}
                >
                  <PackLeft>
                    <PackLabel>{pack.label}</PackLabel>
                    <PackPoints>{pack.points.toLocaleString()} pts</PackPoints>
                    {pack.bonus > 0 && (
                      <PackBonus>+{pack.bonus} bonus</PackBonus>
                    )}
                  </PackLeft>
                  <PackPrice>
                    <PackUsd>${pack.usd}</PackUsd>
                    <PackUnit>
                      {(pack.points / pack.usd).toFixed(0)} pts / $
                    </PackUnit>
                  </PackPrice>
                </Pack>
              ))
            )}

            <PayArea>
              {selectedPack && paypalProviderOptions ? (
                <PayPalScriptProvider options={paypalProviderOptions}>
                  <PayPalButtons
                    key={selectedPack.id}
                    style={{ layout: 'horizontal', label: 'pay', height: 40 }}
                    createOrder={async () => {
                      const res = await pointsAPI.createPackOrder(selectedPack.id);
                      return res.orderId;
                    }}
                    onApprove={(data) => handleApprove(data, selectedPack)}
                    onError={(err) => {
                      console.error('PayPal error', err);
                      setStatus({
                        kind: 'error',
                        msg: 'PayPal error: ' + (err?.message || 'unknown'),
                      });
                    }}
                  />
                </PayPalScriptProvider>
              ) : !paypalProviderOptions ? (
                <Sub>PayPal is not configured.</Sub>
              ) : null}
            </PayArea>

            <Hint>
              Points are credited automatically the moment PayPal completes the transaction.
              They never expire and can be spent on AI art and other digital items.
            </Hint>
          </>
        )}
      </Sheet>
    </Overlay>
  );
};

export default BuyPointsModal;
