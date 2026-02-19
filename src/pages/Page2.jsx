import React, { useState, useEffect } from "react";
import "./Page2.css";

const API_URL = "http://localhost:5000/api";

const Page2 = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    due_date: "",
    status: "Pending",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTask = async () => {
    if (!formData.description.trim() || !formData.due_date) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError(null);
      let response;

      if (editingId) {
        // Update existing task
        response = await fetch(`${API_URL}/tasks/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new task
        response = await fetch(`${API_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save task");
      }

      // Refresh tasks from server
      await fetchTasks();
      setFormData({ description: "", due_date: "", status: "Pending" });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
      console.error("Error saving task:", err);
    }
  };

  const handleEditTask = (task) => {
    setFormData({
      description: task.description,
      due_date: task.due_date,
      status: task.status,
    });
    setEditingId(task.task_id);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Refresh tasks from server
      await fetchTasks();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting task:", err);
    }
  };

  const handleCancel = () => {
    setFormData({ description: "", due_date: "", status: "Pending" });
    setEditingId(null);
    setError(null);
  };

  const getStatusClass = (status) => {
    return `status-${status.toLowerCase().replace(" ", "-")}`;
  };

  console.log("hello");

  return (
    <div className="page2-container">
      <h2>📝 Todo List Manager</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-section">
        <h3>{editingId ? "Edit Task" : "Add New Task"}</h3>
        <div className="form-group">
          <input
            type="text"
            name="description"
            placeholder="Task description"
            value={formData.description}
            onChange={handleInputChange}
            className="input-field"
          />
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleInputChange}
            className="input-field"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="button-group">
            <button onClick={handleAddTask} className="btn btn-primary">
              {editingId ? "Update Task" : "Add Task"}
            </button>
            {editingId && (
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="table-section">
        <h3>
          Tasks {!loading && `(${tasks.length})`}
        </h3>
        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">No tasks yet. Add one to get started!</div>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.task_id} className="task-row">
                  <td className="description">{task.description}</td>
                  <td className="due-date">
                    {new Date(task.due_date).toLocaleDateString()}
                  </td>
                  <td className="status">
                    <span className={`status-badge ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="btn-icon btn-edit"
                      title="Edit task"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.task_id)}
                      className="btn-icon btn-delete"
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page2;
