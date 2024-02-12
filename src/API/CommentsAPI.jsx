import { useState, useEffect } from 'react';
import axios from 'axios'

function CommentsAPI(id) {
    const [comments, setComments] = useState([])
    const [result, setResult] = useState(0)
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        if (id) {
            const getComments = async () => {
                const res = await axios.get(`/api/articles/${id}/comments`)
                setComments(res.data.comments)
                setResult(res.data.result)
            }
            getComments()
        }
    }, [callback, id])

    return {
        comments: [comments, setComments],
        result: [result, setResult],
        callback: [callback, setCallback],
    }
}

export default CommentsAPI;
