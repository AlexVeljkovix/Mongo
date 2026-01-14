import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { AuthProvider } from '../context/AuthContext'

function Header() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const activeSearch = searchParams.get('search') ?? ''
    const [inputSearch, setInputSearch] = useState(activeSearch)

    console.log('Token:', localStorage.getItem('token'))
    console.log('User:', localStorage.getItem('user'))

    useEffect(() => {
        setInputSearch(activeSearch)
    }, [activeSearch])

    function handleSubmit(e) {
        e.preventDefault()
        if (!inputSearch.trim()) {
            // navigate('/')
            // clearSearch()
            return
        }

        setSearchParams({ search: inputSearch })

        navigate(`/?search=${encodeURIComponent(inputSearch)}`)
    }

    function clearInput() {
        setInputSearch('')
    }

    return (
        <AuthProvider>
            <header>
                <div className="header-inner">
                    <Link to="/" style={{ ftonWeight: 'bold', fontSize: 18 }}>
                        Blog
                    </Link>

                    {/* ovde cu dodam search bar za search by keyword */}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                            style={{
                                padding: 6,
                                width: 220,
                            }}
                        />

                        {inputSearch && (
                            <button type="button" onClick={clearInput}>
                                ✕
                            </button>
                        )}
                    </form>

                    <nav style={{ display: 'flex', gap: 16 }}>
                        <Link to="/">Home</Link>
                        {user && <Link to="/create">New Post</Link>}

                        {user ? (
                            <>
                                <Link to="/profile">Profile</Link>
                                <button
                                    className="btn btn-primary"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>
        </AuthProvider>
    )
}

export default Header
