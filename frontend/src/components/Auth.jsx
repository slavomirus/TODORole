import { useState } from 'react';

const API_URL = 'http://localhost:3000';

function Auth({ onLogin }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Błąd połączenia');

            if (isLogin) {
                onLogin(data.token, data.user.role);
            } else {
                alert('Rejestracja udana! Możesz się zalogować.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Logowanie' : 'Rejestracja'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isLogin ? 'Zaloguj' : 'Zarejestruj'}</button>
            </form>

            <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>
                {isLogin ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
            </p>
        </div>
    );
}

export default Auth;