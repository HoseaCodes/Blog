import Payments from "../models/payment.js";
import Products from "../models/product.js";
import Users  from "../models/user.js";
import {cache} from '../utils/cache.js';


async function getPayments(req, res) {
	try {
		const payments = await Payments.find();
    res.cookie('payments-cache', payments.length + "payments", {
      maxAge: 1000 * 60 * 60, // would expire after an hour
      httpOnly: true, // The cookie only accessible by the web server
    })

    cache.set( payments.length + "payments", {
      status: 'success',
      payments: payments,
      result: payments.length,
      location: 'cache',
    });

		res.json(payments);
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function createPayment(req, res) {
	try {
		const user = await Users.findById(req.user.id);
		if (!user) return res.status(400).json({ msg: "User does not exist" });

		let { cart, paymentID, address } = req.body;
    cart = user.cart

    const { _id, name, email } = user;

		const newPayment = new Payments({
      user_id: _id,
			name,
			email,
			cart,
			paymentID,
			address,
		});

		cart.filter((item) => {
      console.log(item)
			return sold(item.product_id, item.quantity, item.sold);
		});
    res.clearCookie('payments-cache');
		await newPayment.save();
		res.json({ msg: "Payment Success" });
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
}

async function sold(id, quantity, oldSold) {
	await Products.findByIdAndUpdate(
		{ _id: id },
		{
			sold: quantity + oldSold,
		}
	);
}

export {
	getPayments,
	createPayment,
	sold,
 };
