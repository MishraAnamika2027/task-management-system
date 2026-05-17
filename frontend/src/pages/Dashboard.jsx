import { useState, useEffect } from "react";
import API from "../services/api";

function Dashboard() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);


  const createTask = async () => {

    try {

      const token = localStorage.getItem("token");

      await API.post(
        "/tasks",
        {
          title,
          description,
          status: "pending",
          priority: "high"
        },
        {
          headers: {
            authorization: token
          }
        }
      );

      alert("Task Created");

      fetchTasks();

    } catch (error) {

      alert("Task Creation Failed");

    }

  };


  const fetchTasks = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await API.get("/tasks", {
        headers: {
          authorization: token
        }
      });

      setTasks(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  const deleteTask = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await API.delete(`/tasks/${id}`, {
        headers: {
          authorization: token
        }
      });

      alert("Task Deleted");

      fetchTasks();

    } catch (error) {

      alert("Delete Failed");

    }

  };


  const logout = () => {

    localStorage.removeItem("token");

    alert("Logged Out");

    window.location.reload();

  };


  useEffect(() => {
    fetchTasks();
  }, []);


  return (

    <div style={{ padding: "20px" }}>

      <h1>Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Task Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={createTask}>
        Create Task
      </button>

      <hr />

      <h2>My Tasks</h2>

      {
        tasks.map((task) => (

          <div
            key={task._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <p>Status: {task.status}</p>

            <p>Priority: {task.priority}</p>

            <button onClick={() => deleteTask(task._id)}>
              Delete
            </button>

          </div>

        ))
      }

    </div>

  );

}

export default Dashboard;