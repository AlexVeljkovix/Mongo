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

