import { useState } from 'react'
import './App.css'

export default function App() {
  // "todos" = our list of tasks (starts empty)
  // "setTodos" = the only way allowed to change that list
  const [todos, setTodos] = useState([]);

  // "text" = whatever the user is currently typing in the input box
  // "setText" = updates it as they type
  const [text, setText] = useState('');

  // Runs when ADD button is clicked
  const add = () => {
    const trimmedText = text.trim(); // remove extra spaces at start/end
    if (!trimmedText) return;        // if empty after trimming, do nothing

    // Make a NEW array = old todos + one new todo object at the end
    // crypto.randomUUID() makes a unique id so React can track this item
    setTodos([...todos, { id: crypto.randomUUID(), text: trimmedText }]);

    setText(''); // clear the input box, ready for next todo
  }

  // Runs when REMOVE button is clicked (needs the id of which todo to remove)
  const remove = (id) => {
    // .filter() builds a NEW array keeping only todos whose id is NOT
    // the one we want to delete — so that one gets left out = "removed"
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return (
    <div>
      {/* Input box: shows "text", updates "text" every time user types */}
      <input value={text} onChange={e => setText(e.target.value)} />

      {/* Calls add() when clicked */}
      <button onClick={add}>ADD</button>

      <ul>
        {/* Loop through every todo and turn it into a list item */}
        {todos.map((todo) => (
          <li key={todo.id}>  {/* key helps React track each item */}
            {todo.text}
            {/* IMPORTANT: () => remove(todo.id)  -- NOT remove(todo.id) directly!
                Using () => ... means "only run this when clicked",
                otherwise it would run remove() immediately on page load */}
            <button onClick={() => remove(todo.id)}>REMOVE</button>
          </li>
        ))}
      </ul>

      {/* Shows how many todos are currently in the list */}
      <p>残り {todos.length} 件</p>
    </div>
  );
}