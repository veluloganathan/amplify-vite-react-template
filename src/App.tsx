import { useEffect, useState } from 'react';
import type { Schema } from './API';
import { generateClient } from 'aws-amplify/api';
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
    const [todos, setTodos] = useState<Array<Schema['Todo']['Item']>>([]);

    const fetchTodos = async () => {
        const { data: items, errors } = await client.models.Todo.list();
        alert(items.length + " todos fetched")
    };

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        client.models.Todo.create({ content: window.prompt("What do you need to do?") });
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id })
    }

    return (
        <Authenticator>
            {({signOut, user})=> (
                <main>
                    <h1> {user?.signInDetails?.loginId}'s todos</h1>
                    <button onClick={createTodo}>+ new</button>
                    <ul>
                        {todos.map((todo) => (
                            <li
                                onClick={() => deleteTodo(todo.id)}
                                key={todo.id}>{todo.content}</li>
                        ))}
                    </ul>
                    <div>
                        🥳 App successfully hosted. Try creating a new todo.
                        <br />
                        <a href="https://docs.amplify.aws/gen2/start/quickstart/">
                            Review next step of this tutorial.
                        </a>
                    </div>
                    <div>
                        <button onClick={fetchTodos}>Fetch Data</button>
                        <button onClick={signOut}>Sign out</button>
                    </div>
                </main>
            )}
        </Authenticator>
    );
}

export default App;