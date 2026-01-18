import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import TaskList from './components/TaskList';
import AdminPanel from './components/AdminPanel';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [role, setRole] = useState(localStorage.getItem('role'));

    const handleLogin = (newToken, userRole) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', userRole);
        setToken(newToken);
        setRole(userRole);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole(null);
    };

    if (!token) {
        return <Auth onLogin={handleLogin} />;
    }

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>ToDo App {role === 'admin' && <span style={{fontSize: '0.5em', background: 'red', padding: '2px 5px', borderRadius: '4px'}}>ADMIN</span>}</h1>
                <button onClick={handleLogout} className="secondary">Wyloguj</button>
            </header>

            {role === 'admin' && (
                <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ff4444', borderRadius: '8px' }}>
                    <AdminPanel token={token} />
                </div>
            )}

            <TaskList token={token} />
        </div>
    );
}

export default App;