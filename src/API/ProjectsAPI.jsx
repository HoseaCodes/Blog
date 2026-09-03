import { useState, useEffect } from 'react';
import axios from 'axios'

function ProjectsAPI() {
    const [projects, setProjects] = useState([])
    const [result, setResult] = useState(0)
    const [callback, setCallback] = useState(false)
    // Starts true so consumers can tell "still fetching" from "fetched, and the
    // record genuinely isn't there". Without it an unknown slug is
    // indistinguishable from the empty first render.
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        const getProjects = async () => {
            setLoading(true)
            // Guarded so a backend that is down (or a dev-server proxy pointing
            // at the wrong port) leaves `projects` as [] instead of throwing an
            // unhandled rejection and blanking the page.
            try {
                const res = await axios.get(`/api/projects`);
                if (cancelled) return
                setProjects(res.data.projects || [])
                setResult(res.data.result || 0)
            } catch (err) {
                if (cancelled) return
                console.error("Error fetching projects:", err);
                setProjects([])
                setResult(0)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        getProjects()
        return () => { cancelled = true }
    }, [callback])

    return {
        projects: [projects, setProjects],
        result: [result, setResult],
        callback: [callback, setCallback],
        loading: [loading, setLoading],
    }

}

export default ProjectsAPI;
