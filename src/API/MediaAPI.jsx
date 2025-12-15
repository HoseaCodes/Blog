import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * MediaAPI - Media library management following existing pattern
 * Integrates with existing Cloudinary upload system
 */
function MediaAPI(token) {
    const [mediaLibrary, setMediaLibrary] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('all');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [callback, setCallback] = useState(false);

    // Get media library
    useEffect(() => {
        const getMedia = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/media/library', {
                    params: { folder: selectedFolder !== 'all' ? selectedFolder : undefined }
                });
                setMediaLibrary(res.data.media);
                setFolders(res.data.folders || []);
            } catch (error) {
                console.error('Error fetching media:', error);
            } finally {
                setLoading(false);
            }
        };
        getMedia();
    }, [callback, selectedFolder]);

    // Upload single file
    const uploadFile = async (file, folder = 'blog') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        console.log('MediaAPI: Uploading file:', {
            name: file.name,
            type: file.type,
            size: file.size,
            folder
        });

        try {
            // Don't set Content-Type header - let axios set it with boundary
            const res = await axios.post('/api/upload', formData, {
                headers: {
                    Authorization: token
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            console.log('MediaAPI: Upload successful:', res.data);
            setCallback(!callback);
            setUploadProgress(0);
            return res.data;
        } catch (error) {
            console.error('MediaAPI: Upload failed:', error.response?.data || error.message);
            setUploadProgress(0);
            throw error;
        }
    };

    // Upload multiple files
    const uploadMultipleFiles = async (files, folder = 'blog') => {
        const uploadPromises = files.map(file => uploadFile(file, folder));
        try {
            const results = await Promise.all(uploadPromises);
            return results;
        } catch (error) {
            throw error;
        }
    };

    // Delete media
    const deleteMedia = async (publicId) => {
        try {
            const res = await axios.delete('/api/upload/destroy', {
                data: { public_id: publicId },
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Update media metadata
    const updateMediaMetadata = async (publicId, metadata) => {
        try {
            const res = await axios.put('/api/media/metadata', {
                public_id: publicId,
                ...metadata
            }, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Search media
    const searchMedia = async (query) => {
        try {
            const res = await axios.get('/api/media/search', {
                params: { query }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Create folder
    const createFolder = async (folderName) => {
        try {
            const res = await axios.post('/api/media/folder', {
                name: folderName
            }, {
                headers: { Authorization: token }
            });
            setCallback(!callback);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Get media stats
    const getMediaStats = async () => {
        try {
            const res = await axios.get('/api/media/stats', {
                headers: { Authorization: token }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    return {
        mediaLibrary: [mediaLibrary, setMediaLibrary],
        folders: [folders, setFolders],
        selectedFolder: [selectedFolder, setSelectedFolder],
        uploadProgress: [uploadProgress, setUploadProgress],
        loading: [loading, setLoading],
        callback: [callback, setCallback],
        uploadFile,
        uploadMultipleFiles,
        deleteMedia,
        updateMediaMetadata,
        searchMedia,
        createFolder,
        getMediaStats
    };
}

export default MediaAPI;
