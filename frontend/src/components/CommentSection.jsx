import { useEffect, useState } from 'react'
import { getCommentsByPost, addComment, apiFetch } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function CommentSection({ postId }) {
    const [comments, setComments] = useState([])
    //const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const navigate = useNavigate()

    const loadComments = async () => {
        const data = await getCommentsByPost(postId)
        setComments(data)
    }

    useEffect(() => {
        loadComments().finally(() => setLoading(false))
    }, [postId])

    async function handleSubmit(e) {
        e.preventDefault()

        if (!user) {
            navigate('/login')
            return
        }

        try {
            await apiFetch(`http://localhost:5194/api/comments/${postId}`, {
                method: 'POST',
                body: JSON.stringify({ content }),
            })

            setContent('')
            loadComments()
        } catch {
            alert('Failed to add comment')
        }
    }

    if (loading) return <p>Loading comments...</p>

    return (
        <div className="card">
            <h3 className="section-title">Comments</h3>

            {comments.map((c) => (
                <div key={c.id} className="comment">
                    <div className="comment-author">{c.authorUsername}</div>
                    <p>{c.content}</p>
                    <div className="comment-date">
                        {new Date(c.createdAt).toLocaleString()}
                    </div>
                </div>
            ))}

            {user && (
                <form className="form" onSubmit={handleSubmit}>
                    <textarea
                        className="textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <button className="btn btn-primary">Add comment</button>
                </form>
            )}
        </div>
    )
}

export default CommentSection
