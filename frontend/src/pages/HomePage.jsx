import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getPosts, searchPosts } from '../services/api'
import PostCard from '../components/PostCard'

function HomePage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState(null)
    const [searchParams] = useSearchParams()

    const search = searchParams.get('search')

    const navigate = useNavigate()

    useEffect(() => {
        if (search) {
            handleTagClick(search)
        } else {
            loadAll()
        }
    }, [search])

    async function loadAll() {
        setLoading(true)
        navigate('/')
        setPosts(await getPosts())
        setActiveFilter(null)
        setLoading(false)
    }

    async function handleTagClick(tag) {
        setLoading(true)
        navigate(`/?search=${encodeURIComponent(tag)}`)
        setPosts(await searchPosts(tag))
        setActiveFilter(tag)
        setLoading(false)
    }

    function handleOpenPost(id, focus) {
        if (focus === 'comments') {
            navigate(`/posts/${id}#comments`)
        } else {
            navigate(`/posts/${id}`)
        }
    }

    if (loading) return <p>Loading posts...</p>

    return (
        <div className="container">
            <h1 className="section-title">Blog</h1>

            {activeFilter && (
                <div style={{ marginBottom: 16 }}>
                    <span>
                        Filtered by: <strong>#{activeFilter}</strong>
                    </span>
                    {' · '}
                    <button onClick={loadAll}>Remove filter</button>
                </div>
            )}

            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onOpenPost={handleOpenPost}
                    onTagClick={handleTagClick}
                ></PostCard>
            ))}
        </div>
    )
}
export default HomePage
