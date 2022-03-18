import Products  from "../models/product.js";
import {cache} from '../utils/cache.js';



class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }

    filtering() {
        const queryObj = { ...this.queryString } // queryString = req.query
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete (queryObj[el]))

        let queryStr = JSON.stringify(queryObj)
        //gte = greater than or equal
        //lte = lesser than or equal
        //lt = lesser than
        //gt = greater than
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

async function getProducts(req, res) {
    try {
        const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
        const products = await features.query

        res.cookie('products-cache', products.length + "products", {
          maxAge: 1000 * 60 * 60, // would expire after an hour
          httpOnly: true, // The cookie only accessible by the web server
        })

        cache.set( products.length + "products", {
          status: 'success',
          products: products,
          result: products.length,
          location: 'cache',
        });

        res.json({
            status: 'success',
            result: products.length,
            products: products
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

async function createProducts(req, res) {
    try {
        const { product_id, title, price, description, content, images, category } = req.body;
        if (!images) return res.status(400).json({ msg: "No image upload" })

        const product = await Products.findOne({ product_id })
        if (product) return res.status(400).json({ msg: "This product already exists." })

        const newProduct = new Products({
            product_id, title: title.toLowerCase(), price, description, content, images, category
        })

        res.clearCookie('products-cache');
        await newProduct.save()

        res.json({ msg: "Created a new product" })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

async function deleteProducts(req, res) {
    try {
        await Products.findByIdAndDelete(req.params.id);
        res.clearCookie('products-cache');
        res.json({ msg: "Deleted a product" })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

async function updateProducts(req, res) {
    try {
        const { title, price, description, content, images, category } = req.body;
        if (!images) return res.status(400).json({ msg: "No image upload" })

        await Products.findOneAndUpdate({ _id: req.params.id }, {
            title: title, price, description, content, images, category
        })
        res.clearCookie('products-cache');
        res.json({ msg: 'Updated a product' })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}


export {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
 };
