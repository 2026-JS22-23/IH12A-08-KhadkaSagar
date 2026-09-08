import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]); // list of todos
  const [text, setText] = useState('');   // current input value

  const add = () => {
    setTodos([...todos, text]); // add new todo to the list
    setText('');                // clear the input
  };

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} /> {/* update text as user types */}
      <button onClick={add}>追加</button> {/* add todo on click */}

      <ul>
        {todos.map((t, i) => <li key={i}>{t}</li>)} {/* render each todo */}
      </ul>

      <p>残り {todos.length} 件</p> {/* show total count */}
    </div>
  );
}
