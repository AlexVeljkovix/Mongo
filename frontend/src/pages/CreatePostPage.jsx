import { useState } from 'react'
import { apiFetch } from '../services/api'
import { useNavigate } from 'react-router-dom'

function CreatePostPage() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()
    const [toast, setToast] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const tagsArray = tags
                ? tags
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter((tag) => tag !== '')
                : []

            const token = localStorage.getItem('token')

            const response = await fetch('http://localhost:5194/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    title,
                    content,
                    tags: tagsArray,
                }),
            })

            if (response.status === 401) {
                throw new Error('You need to be logged in to create a post')
            }

            if (response.status === 201) {
                const data = await response.json()
                console.log('Post created:', data)

                setSuccess(true)

                setTitle('')
                setContent('')
                setTags('')

                setTimeout(() => {
                    navigate('/')
                }, 2000)
            } else if (!response.ok) {
                throw new Error(`Failed to create post: ${response.status}`)
            }
        } catch (err) {
            setError(err.message || 'Failed to create post')
            console.error('Create error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container">
            <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
                <h2 className="section-title">Create New Post</h2>

                {success && (
                    <div className="card">
                        <div>
                            <strong>Success!</strong> Post has been created
                            successfully.
                            <div style={{ fontSize: '14px', marginTop: '5px' }}>
                                Redirecting to home page in 2 seconds...
                            </div>
                        </div>
                        <button
                            onClick={() => setSuccess(false)}
                            className="btn btn-primary"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {error && (
                    <div className="card">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="form">
                    <div>
                        <label
                            htmlFor="title"
                            style={{ display: 'block', marginBottom: 5 }}
                        >
                            Title *
                        </label>
                        <input
                            id="title"
                            placeholder="Enter post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="input"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="content"
                            style={{ display: 'block', marginBottom: 5 }}
                        >
                            Content *
                        </label>
                        <textarea
                            id="content"
                            placeholder="Write your post content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={15}
                            style={{
                                width: '100%',
                                padding: 10,
                                fontSize: 16,
                                fontFamily: 'inherit',
                            }}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="tags"
                            style={{ display: 'block', marginBottom: 5 }}
                        >
                            Tags (comma separated)
                        </label>
                        <input
                            id="tags"
                            placeholder="e.g., programming, csharp, mongodb"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="input"
                            disabled={loading}
                        />
                        <small style={{ color: '#666' }}>
                            Separate multiple tags with commas
                        </small>
                    </div>

                    <div className="card">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? (
                                <>
                                    <span style={{ marginRight: '8px' }}>
                                        ⏳
                                    </span>
                                    Creating Post...
                                </>
                            ) : (
                                <>
                                    <span style={{ marginRight: '8px' }}>
                                        📝
                                    </span>
                                    Create Post
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setTitle('')
                                setContent('')
                                setTags('')
                                setError('')
                                setSuccess(false)
                            }}
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            Clear Form
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>

                    {loading && (
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            <div className="card"></div>
                            <style>
                                {`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                            `}
                            </style>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default CreatePostPage
