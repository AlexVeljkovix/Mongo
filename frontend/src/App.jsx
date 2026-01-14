import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PostDetails from './pages/PostDetails'
import MainLayout from './components/MainLayout'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import CreatePostPage from './pages/CreatePostPage'
import EditPostPage from './pages/EditPostPage'
import EditCommentPage from './pages/EditCommentPage'

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/create" element={<CreatePostPage />} />
                <Route path="/posts/edit/:id" element={<EditPostPage />} />
                <Route
                    path="/comments/edit/:commentId"
                    element={<EditCommentPage />}
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/posts/:id" element={<PostDetails />} />
            </Route>
        </Routes>
    )
}

export default App

// import { useEffect, useState } from 'react'
// import { getPosts, getPostsByKeyword } from './services/api'
// import Header from './components/Header'
// import Footer from './components/Footer'
// import PostCard from './components/PostCard'

// function App() {
//     const [posts, setPosts] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [activeTag, setActiveTag] = useState(null)

//     useEffect(() => {
//         // getPosts()
//         //     .then(setPosts)
//         //     .catch(console.error)
//         //     .finally(() => setLoading(false))
//         loadPosts()
//     }, [])

//     async function loadPosts() {
//         setLoading(true)
//         try {
//             const data = await getPosts()
//             setPosts(data)
//             setActiveTag(null)
//         } catch (err) {
//             console.error(err)
//         } finally {
//             setLoading(false)
//         }
//     }

//     async function handleTagClick(tag) {
//         setLoading(true)
//         try {
//             const data = await getPostsByKeyword(tag)
//             setPosts(data)
//             setActiveTag(tag)
//         } catch (err) {
//             console.error(err)
//         } finally {
//             setLoading(false)
//         }
//     }

//     function handleOpenPost(postId) {
//         console.log('Open post:', postId)
//     }

//     if (loading) return <p>Loading...</p>

//     return (
//         <div
//             style={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 flexDirection: 'column',
//             }}
//         >
//             <Header />

//             <main style={{ padding: 24, flex: 1 }}>
//                 {loading & <p>Loading content...</p>}

//                 {activeTag && (
//                     <p>
//                         Showing results for keyword:{' '}
//                         <strong>#{activeTag}</strong>{' '}
//                         <button onClick={loadPosts}>Clear</button>
//                     </p>
//                 )}

//                 {!loading && posts.length == 0 && (
//                     <p>No posts yet! Welcome to the site tho!</p>
//                 )}

//                 {!loading &&
//                     posts.map((post) => (
//                         <PostCard
//                             key={post.id}
//                             post={post}
//                             onOpenPost={handleOpenPost}
//                             onTagClick={handleTagClick}
//                         ></PostCard>
//                         // <div
//                         //     key={post._id}
//                         //     style={{
//                         //         border: '1px solid #ccc',
//                         //         marginBottom: 16,
//                         //         padding: 16,
//                         //         width: '100%',
//                         //         boxSizing: 'border-box',
//                         //     }}
//                         // >
//                         //     <h3>{post.title}</h3>
//                         //     <p>{post.content}</p>
//                         //     <small>
//                         //         Tags: {post.tags?.join(',')}
//                         //         <br />
//                         //         Comments: {post.commentsCount}
//                         //     </small>
//                         // </div>
//                     ))}
//             </main>

//             <Footer />
//         </div>

//         // <div style={{ padding: 20 }}>
//         //     <h1>Blog</h1>

//         //     {posts.length === 0 && <p>No posts yet!</p>}

//         //     {posts.map((post) => (
//         //         <div
//         //             key={post.id}
//         //             style={{
//         //                 border: '1px solid #ccc',
//         //                 marginBottom: 10,
//         //                 padding: 10,
//         //             }}
//         //         >
//         //             <h3>{post.title}</h3>
//         //             <p>{post.content}</p>
//         //             <small>
//         //                 Tags: {post.tags?.join(',')}
//         //                 <br />
//         //                 Comments: {post.commentsCount}
//         //             </small>
//         //         </div>
//         //     ))}
//         // </div>
//     )
// }

// export default App

