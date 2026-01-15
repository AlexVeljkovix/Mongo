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
        setPosts((prev) => prev.filter((p) => p.id !== id))
        setComments((prev) => prev.filter((c) => c.postId !== id))
    }

    async function handleDeleteComment(id) {
        if (!confirm('Delete comment?')) return

        await apiFetch(`http://localhost:5194/api/comments/${id}`, {
            method: 'DELETE',
        })

        setComments(comments.filter((c) => c.id !== id))
    }

    return (
        <div className="page">
            <div className="profile-container">
                <div className="profile-card">
                    <h2>Profile</h2>

                    <div className="profile-info">
                        <div>
                            <span className="label">Username</span>
                            <span>{user.username}</span>
                        </div>
                        <div>
                            <span className="label">Email</span>
                            <span>{user.email}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-columns">
                    <section>
                        <h3 className="section-title">My posts</h3>

                        {posts.map((post) => (
                            <div key={post.id} className="item-card">
                                <h4>{post.title}</h4>

                                <div className="actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            navigate(`/posts/${post.id}`)
                                        }
                                    >
                                        Open
                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            navigate(`/posts/edit/${post.id}`)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section>
                        <h3 className="section-title">My comments</h3>

                        {comments.map((c) => (
                            <div key={c.id} className="item-card">
                                <p>
                                    On post: <b>{c.postTitle}</b>
                                </p>

                                <p>{c.content}</p>

                                <div className="actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            navigate(
                                                `/posts/${c.postId}?comment=${c.id}`
                                            )
                                        }
                                    >
                                        Open
                                    </button>

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            navigate(`/comments/edit/${c.id}`)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-danger"
                                        onClick={() =>
                                            handleDeleteComment(c.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
