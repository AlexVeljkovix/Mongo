import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiFetch } from '../services/api'

function EditPostPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        apiFetch(`http://localhost:5194/api/posts/${id}`)
            .then((post) => {
                setTitle(post.title)
                setContent(post.content)
                setTags(post.tags?.join(', ') ?? '')
            })
            .catch(() => {
                setError('Post not found')
            })
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            await apiFetch(`http://localhost:5194/api/posts/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title,
                    content,
                    tags: tags
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean),
                }),
            })

            navigate(`/posts/${id}`)
        } catch {
            setError('You are not allowed to edit this post')
        }
    }

    return (
        <div className="container">
            <div className="card">
                <h2 className="section-title">Edit Post</h2>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="form-label">Title:</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input"
                    />
                    <label className="form-label">Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="textarea-large"
                        placeholder="Post content..."
                    />
                    <label className="form-label">Tags:</label>
                    <input
                        type="text"
                        placeholder="Tags (comma separated)"
                        value={tags}
                        className="input"
                    />

                    <button className="btn btn-primary">Save</button>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    )
}

export default EditPostPage
