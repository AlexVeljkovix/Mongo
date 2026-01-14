import { useEffect, useState, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getPostById } from '../services/api'
import CommentSection from '../components/CommentSection'

function PostDetails() {
    const { id } = useParams()
    const location = useLocation()
    const commentsRef = useRef(null)

    const [post, setPost] = useState(null)

    useEffect(() => {
        getPostById(id).then(setPost)
    }, [id])

    useEffect(() => {
        if (post && location.hash === '#comments' && commentsRef.current) {
            commentsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [post, location.hash])

    if (!post) return <p>Loading...</p>

    return (
        <div style={{ padding: 20 }}>
            <h1>{post.title}</h1>
            <p>{post.content}</p>

            <hr />
            <section ref={commentsRef} id="comments">
                <CommentSection postId={post.id} />
            </section>
        </div>
    )
}

export default PostDetails
