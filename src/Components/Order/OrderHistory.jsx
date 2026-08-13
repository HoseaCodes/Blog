import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineFileSearch, AiOutlineArrowRight } from 'react-icons/ai';

import { GlobalState } from '../../GlobalState';
import './OrderHistory.css';

const pickArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.payments)) return data.payments;
    if (Array.isArray(data?.result)) return data.result;
    return [];
};

const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
};

function OrderHistory() {
    const state = useContext(GlobalState);
    const [history, setHistory] = state.userAPI.history;
    const [isAdmin] = state.userAPI.isAdmin;
    const [token] = state.token;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;
        const getHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = isAdmin ? '/api/payment' : '/api/user/history';
                const res = await axios.get(url, { headers: { Authorization: token } });
                if (cancelled) return;
                setHistory(pickArray(res.data));
            } catch (err) {
                if (cancelled) return;
                console.error('Failed to load order history:', err.message);
                setError(err.response?.data?.msg || err.message || 'Failed to load history');
                setHistory([]);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        getHistory();
        return () => { cancelled = true; };
    }, [token, isAdmin, setHistory]);

    const items = Array.isArray(history) ? history : [];
    const subtitle = loading
        ? 'Loading…'
        : `${items.length} ${items.length === 1 ? 'order' : 'orders'}`;

    return (
        <div className="history-page">
            <div className="history-container">
                <header className="history-header-bar">
                    <div>
                        <h1 className="history-title">Order History</h1>
                        <p className="history-subtitle">{subtitle}</p>
                    </div>
                    <Link to="/shop" className="history-secondary-link">
                        Back to shop <AiOutlineArrowRight aria-hidden />
                    </Link>
                </header>

                {error && (
                    <div className="history-state history-state-error">
                        <h3>Couldn't load orders</h3>
                        <p>{error}</p>
                    </div>
                )}

                {!error && items.length > 0 && (
                    <ul className="history-list">
                        {items.map((entry) => (
                            <li key={entry._id || entry.paymentID} className="history-card">
                                <div className="history-card-field">
                                    <span className="history-card-label">Payment ID</span>
                                    <span className="history-card-value" title={entry.paymentID}>
                                        {entry.paymentID || '—'}
                                    </span>
                                </div>
                                <div className="history-card-field">
                                    <span className="history-card-label">Date</span>
                                    <span className="history-card-value">
                                        {entry.createdAt
                                            ? new Date(entry.createdAt).toLocaleDateString('en-US', dateOptions)
                                            : '—'}
                                    </span>
                                </div>
                                <Link
                                    to={`/shop/products/history/${entry._id}`}
                                    className="history-card-cta"
                                >
                                    View <AiOutlineArrowRight aria-hidden />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                {!loading && !error && items.length === 0 && (
                    <div className="history-state history-empty">
                        <AiOutlineFileSearch className="history-empty-icon" aria-hidden />
                        <h3>No orders yet</h3>
                        <p>When you place an order, it will show up here.</p>
                        <Link to="/shop" className="history-cta">
                            Browse the shop
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistory;
