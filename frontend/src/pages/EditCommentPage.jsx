import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../services/api'

function EditCommentPage() {
    const { commentId } = useParams()
    const navigate = useNavigate()

    const [content, setContent] = useState('')
    const [postId, setPostId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadComment() {
            try {
                // const comment = await apiFetch(
                //     `http://localhost:5194/api/comments/${commentId}`
                // )
                const comment = await apiFetch(
                    `http://localhost:5194/api/comments/by-id/${commentId}`
                )

                setContent(comment.content)
                setPostId(comment.postId)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadComment()
    }, [commentId])

    async function handleSubmit(e) {
        e.preventDefault()

        if (!content.trim()) {
            alert('Comment cannot be empty')
            return
        }

        if (!postId) {
            alert('Post not found')
            return
        }

        navigate(`/posts/${postId}`)

        try {
            await apiFetch(`http://localhost:5194/api/comments/${commentId}`, {
                method: 'PUT',
                body: JSON.stringify({ content }),
            })

            // vraćamo se na post i fokusiramo komentar (hash koristimo kasnije)
            navigate(`/posts/${postId}`)
        } catch (err) {
            alert(err.message)
        }
    }

    if (loading) return <p style={{ padding: 20 }}>Loading...</p>

    if (error)
        return <p style={{ padding: 20, color: 'red' }}>Error: {error}</p>

    return (
        <div className="container">
            <div className="card">
                <h2 className="section-title">Edit comment</h2>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="form-label">Comment content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="textarea-large"
                        placeholder="Your comment..."
                    />

                    <button className="btn btn-primary" type="submit">
                        Save
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditCommentPage
