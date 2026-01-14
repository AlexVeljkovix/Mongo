import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../services/api'

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            const res = await apiFetch('http://localhost:5194/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            })
            login(res.token, res.user)
            navigate('/')
        } catch (err) {
            setError('Invalid creredentials')
        }
    }

    return (
        <div className="container">
            <div className="form">
                <h2 className="section-title">Login</h2>
                <form className="form" onSubmit={handleSubmit}>
                    <input
                        className="input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <br />
                    <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <button className="input" type="submit">
                        Login
                    </button>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    )
}
export default LoginPage
