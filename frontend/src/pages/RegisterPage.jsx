import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../services/api'

function RegisterPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [username, setUsername] = useState('')

    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)

        try {
            const res = await apiFetch(
                'http://localhost:5194/api/auth/register',
                {
                    method: 'POST',
                    body: JSON.stringify({ username, email, password }),
                }
            )
            setSuccess(true)
        } catch {
            setError('Registration failed!')
        }
    }

    if (success) {
        return (
            <div className="card">
                <h2 className="section-title">Registration successful</h2>
                <p>Your account has been created.</p>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                >
                    Go to login
                </button>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="card">
                <h2 className="section-title">Register</h2>

                <form className="form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                        required
                    />
                    <br />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input"
                        required
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                        required
                    />
                    <br />
                    <button className="btn btn-primary" type="submit">
                        Register
                    </button>
                </form>

                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    )
}

export default RegisterPage
