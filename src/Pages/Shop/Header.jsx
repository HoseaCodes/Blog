import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
	AiOutlineShoppingCart as Cart,
	AiOutlinePlus,
	AiOutlineAppstore,
	AiOutlineHistory,
	AiOutlineBulb,
	AiOutlineDownload,
} from "react-icons/ai";
import { GlobalState } from "../../GlobalState";
import "./Header.css";

const Header = () => {
	const state = useContext(GlobalState);
	const [isLoggedIn] = state.userAPI.isLoggedIn;
	const [isAdmin] = state.userAPI.isAdmin;
	const [cart] = state.userAPI.cart;

	return (
		<nav className="shop-sidebar-card" aria-label="Shop navigation">
			{!isAdmin && (
				<Link to="/shop/cart" className="shop-cart-pill">
					<Cart className="shop-cart-icon" />
					<span>Cart</span>
					{cart.length > 0 && (
						<span className="shop-cart-badge">{cart.length}</span>
					)}
				</Link>
			)}

			<div className="shop-sidebar-section">
				<h6 className="shop-sidebar-label">Browse</h6>
				<ul className="shop-sidebar-list">
					<li>
						<Link to="/shop/products">
							<AiOutlineAppstore aria-hidden /> <span>All Products</span>
						</Link>
					</li>
					{isLoggedIn && (
						<li>
							<Link to="/shop/products/history">
								<AiOutlineHistory aria-hidden /> <span>Order History</span>
							</Link>
						</li>
					)}
				</ul>
			</div>

			{isLoggedIn && (
				<div className="shop-sidebar-section">
					<h6 className="shop-sidebar-label">AI Art</h6>
					<ul className="shop-sidebar-list">
						<li>
							<Link to="/shop/create-art">
								<AiOutlineBulb aria-hidden /> <span>Create AI Art</span>
							</Link>
						</li>
						<li>
							<Link to="/shop/my-art">
								<AiOutlineDownload aria-hidden /> <span>My Downloads</span>
							</Link>
						</li>
					</ul>
				</div>
			)}

			{isAdmin && (
				<div className="shop-sidebar-section">
					<h6 className="shop-sidebar-label">Admin</h6>
					<ul className="shop-sidebar-list">
						<li>
							<Link to="/admin/shop/create_product">
								<AiOutlinePlus aria-hidden /> <span>Create Product</span>
							</Link>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
};

export default Header;
