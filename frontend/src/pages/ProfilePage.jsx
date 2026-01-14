import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'
import { apiFetch } from '../services/api'
import { useNavigate } from 'react-router-dom'

function ProfilePage() {
    const { user, logout } = useAuth()
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()
    const [comments, setComments] = useState([])

    useEffect(() => {
        apiFetch('http://localhost:5194/api/posts/mine').then(setPosts)
        apiFetch('http://localhost:5194/api/comments/mine').then(setComments)
    }, [])

    async function handleDelete(id) {
        if (!confirm('Delete post?')) return

        await apiFetch(`http://localhost:5194/api/posts/${id}`, {
            method: 'DELETE',
        })

        setPosts(posts.filter((p) => p.id !== id))
    }

    async function handleDeleteComment(id) {
        if (!confirm('Delete comment?')) return

        await apiFetch(`http://localhost:5194/api/comments/${id}`, {
            method: 'DELETE',
        })

        setComments(comments.filter((c) => c.id !== id))
    }

    return (
        <div style={{ padding: 20 }}>
            <div style={{ padding: 20 }}>
                <h2>Profile</h2>

                <p>
                    <b>Username:</b> {user.userName}
                </p>
                <p>
                    <b>Email:</b> {user.email}
                </p>

                <h3>My posts</h3>

                {posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            border: '1px solid #ccc',
                            padding: 10,
                            marginBottom: 10,
                        }}
                    >
                        <h4>{post.title}</h4>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/posts/${post.id}`)}
                        >
                            Open
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/posts/edit/${post.id}`)}
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => handleDelete(post.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
                <h3>My comments</h3>

                {comments.map((c) => (
                    <div
                        key={c.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: 10,
                            marginBottom: 10,
                        }}
                    >
                        <p>
                            On post: <b>{c.postTitle}</b>
                        </p>

                        <p>{c.content}</p>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate(`/posts/${c.postId}?comment=${c.id}`)
                            }
                        >
                            Open
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/comments/edit/${c.id}`)}
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => handleDeleteComment(c.id)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProfilePage
