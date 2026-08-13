import { useState, useEffect } from 'react';
import axios from 'axios'

function ProjectsAPI() {
    const [projects, setProjects] = useState([])
    const [result, setResult] = useState(0)
    const [callback, setCallback] = useState(false)

    useEffect(() => {
        const getProjects = async () => {
            // Guarded so a backend that is down (or a dev-server proxy pointing
            // at the wrong port) leaves `projects` as [] instead of throwing an
            // unhandled rejection and blanking the page.
            try {
                const res = await axios.get(`/api/projects`);
                setProjects(res.data.projects || [])
                setResult(res.data.result || 0)
            } catch (err) {
                console.error("Error fetching projects:", err);
                setProjects([])
                setResult(0)
            }
        }
        getProjects()
    }, [callback])

    return {
        projects: [projects, setProjects],
        result: [result, setResult],
        callback: [callback, setCallback],
    }

}

export default ProjectsAPI;
