import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzI4MmFlYjhhYzQ3ODE2Mjc2Mzg1ZjQiLCJpYXQiOjE3MzA2ODU2OTQsImV4cCI6MTczMDY4OTI5NH0.4cJmHwzw9WukAw6X30I6yX4X_oLBzvZWiA5bQGhHq1E"; // Reemplaza con tu token JWT
  const userId = "67282aeb8ac47816276385f4";

  useEffect(() => {
    fetchTasks();
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/todo/get-all-to-do/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener las tareas");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== "") {
      const task = {
        title: newTask,
        description: "Task description", 
        isCompleted: false,
        createdBy: userId,
      };

      try {
        const response = await fetch("http://localhost:4000/api/todo/create-to-do", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(task),
        });
        if (!response.ok) throw new Error("Error al agregar la tarea");
        const newTaskFromDB = await response.json();
        setTasks([...tasks, newTaskFromDB]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/todo/delete-to-do/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) throw new Error("Error al eliminar la tarea");
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const completeTask = async (taskId) => {
    try {
      const task = tasks.find((task) => task._id === taskId);
      const updatedTask = { ...task, isCompleted: !task.isCompleted };

      const response = await fetch(`http://localhost:4000/api/todo/update-to-do/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ isCompleted: updatedTask.isCompleted }),
      });
      if (!response.ok) throw new Error("Error al actualizar la tarea");
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  return (
    <div style={{ textAlign: "left", paddingLeft: "50px" }}>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      /> 
      &nbsp;
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{ textDecoration: task.isCompleted ? "line-through" : "none" }}
          >
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => completeTask(task._id)}
            />
            {task.title}
            &nbsp;
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
