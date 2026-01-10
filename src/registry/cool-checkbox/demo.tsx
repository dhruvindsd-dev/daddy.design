"use client";

import CoolCheckbox from ".";
import { useState } from "react";

const TODOS = [
  { id: 0, title: "Fix bugs caused by Vibe Coding", checked: true },
  { id: 1, title: "Fix more bugs", checked: false },
  { id: 2, title: "Vibe code more bugs", checked: false },
  { id: 3, title: "Again fix bugs", checked: false },
];
function CoolCheckBoxDemo() {
  const [todos, setTodos] = useState(TODOS);

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, checked: !todo.checked };
        }
        return todo;
      }),
    );
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <CoolCheckbox todos={todos} onToggle={handleToggle} />
    </div>
  );
}
export default CoolCheckBoxDemo;
