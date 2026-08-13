import { useState, useEffect } from 'react';
import axios from 'axios'

function ProductsAPI() {
    const [products, setProducts] = useState([])
    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.get(`/api/products?limit=${page * 9}&${sort}&title[regex]=${search}`)
                console.log(res.data.products, 'from front-end api products')
                console.log(res.data.location, 'pulled location')
                setProducts(res.data.products)
                setResult(res.data.result)
            } catch (err) {
                console.error('Failed to load products:', err.message)
                setProducts([])
                setResult(0)
                setError(err.message || 'Failed to load products')
            } finally {
                setLoading(false)
            }
        }
        getProducts()
    }, [callback, category, sort, search, page])

    return {
        products: [products, setProducts],
        callback: [callback, setCallback],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult],
        loading: [loading, setLoading],
        error: [error, setError]
    }


}

export default ProductsAPI;
