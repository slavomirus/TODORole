import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

function TaskList({ token }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const fetchTasks = async () => {
        try {
            const res = await fetch(`${API_URL}/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [token]);

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask) return;

        await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTask })
        });
        setNewTask('');
        fetchTasks();
    };

    const toggleTask = async (id, completed) => {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !completed })
        });
        fetchTasks();
    };

    const deleteTask = async (id) => {
        if (!confirm('Usunąć zadanie?')) return;
        await fetch(`${API_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchTasks();
    };

    return (
        <div>
            <h3>Twoje Zadania</h3>
            <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    placeholder="Nowe zadanie..."
                    style={{ flex: 1 }}
                />
                <button type="submit">Dodaj</button>
            </form>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {tasks.map(task => (
                    <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #333' }}>
            <span
                onClick={() => toggleTask(task.id, task.completed)}
                style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer', flex: 1, color: task.completed ? '#888' : '#fff' }}
            >
              {task.completed ? '✅' : '⬜'} {task.title}
            </span>
                        <button onClick={() => deleteTask(task.id)} style={{ background: '#ff4444', marginLeft: '10px' }}>Usuń</button>
                    </li>
                ))}
                {tasks.length === 0 && <p>Brak zadań.</p>}
            </ul>
        </div>
    );
}

export default TaskList;