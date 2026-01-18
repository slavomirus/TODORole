import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

function AdminPanel({ token }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                alert('Błąd pobierania danych (wymagany Admin)');
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    // Pobierz użytkowników przy załadowaniu komponentu
    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (!confirm('UWAGA: To usunie użytkownika i wszystkie jego zadania. Kontynuować?')) return;

        await fetch(`${API_URL}/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchUsers();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Panel Administratora</h3>
                <button onClick={fetchUsers} style={{ fontSize: '0.8em' }}>Odśwież</button>
            </div>

            {loading && <p>Ładowanie...</p>}

            {users.length > 0 && (
                <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ textAlign: 'left', background: '#333', color: 'white' }}>
                        <th style={{ padding: '8px' }}>Email</th>
                        <th style={{ padding: '8px' }}>Rola</th>
                        <th style={{ padding: '8px' }}>Akcja</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #444' }}>
                            <td style={{ padding: '8px' }}>{user.email}</td>
                            <td style={{ padding: '8px' }}>{user.role}</td>
                            <td style={{ padding: '8px' }}>
                                <button onClick={() => deleteUser(user.id)} style={{ background: 'darkred', color: 'white', padding: '4px 8px' }}>Usuń</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminPanel;