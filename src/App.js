import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const defaultTasks = [
  {
    id: 1,
    code: "SPR-101",
    title: "Recently Viewed Product Synchronization",
    category: "Integration",
    priority: "High",
    status: "Done",
    dueDate: "2026-07-24",
    description:
      "Synchronizes recently viewed products across user sessions while preventing duplicate product entries."
  },
  {
    id: 2,
    code: "SPR-102",
    title: "Dark Mode and Theme Management",
    category: "UI/UX",
    priority: "Medium",
    status: "Done",
    dueDate: "2026-07-22",
    description:
      "Provides light and dark themes and stores the selected theme preference for future sessions."
  },
  {
    id: 3,
    code: "SPR-103",
    title: "Event-Driven Notification System",
    category: "Frontend",
    priority: "High",
    status: "Done",
    dueDate: "2026-07-27",
    description:
      "Displays notifications for task reminders, status updates and important project events."
  },
  {
    id: 4,
    code: "SPR-104",
    title: "Transaction History and CSV Export",
    category: "Data",
    priority: "Medium",
    status: "Done",
    dueDate: "2026-07-29",
    description:
      "Displays task records and enables the complete project data to be exported in CSV format."
  },
  {
    id: 5,
    code: "SPR-105",
    title: "Save for Later Workflow",
    category: "Productivity",
    priority: "Low",
    status: "Done",
    dueDate: "2026-07-26",
    description:
      "Allows selected work items to be saved for later without creating duplicate entries."
  },
  {
    id: 6,
    code: "SPR-106",
    title: "Category-Based Recommendation Module",
    category: "Personalization",
    priority: "Medium",
    status: "Done",
    dueDate: "2026-07-23",
    description:
      "Recommends relevant tasks and project features according to the selected category."
  }
];

const emptyForm = {
  title: "",
  category: "Frontend",
  priority: "Medium",
  status: "Done",
  dueDate: "",
  description: ""
};

const statuses = ["To Do", "In Progress", "Done"];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("sprintflowTasks");

      if (savedTasks) {
        return JSON.parse(savedTasks);
      }

      return defaultTasks;
    } catch (error) {
      console.error("Unable to load saved tasks:", error);
      return defaultTasks;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem("sprintflowTasks", JSON.stringify(tasks));
  }, [tasks]);

  const statistics = useMemo(() => {
    const total = tasks.length;

    const todo = tasks.filter(
      (task) => task.status === "To Do"
    ).length;

    const inProgress = tasks.filter(
      (task) => task.status === "In Progress"
    ).length;

    const completed = tasks.filter(
      (task) => task.status === "Done"
    ).length;

    const percentage =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      todo,
      inProgress,
      completed,
      percentage
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !searchValue ||
        task.title.toLowerCase().includes(searchValue) ||
        task.code.toLowerCase().includes(searchValue) ||
        task.category.toLowerCase().includes(searchValue) ||
        task.description.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  function updateTaskStatus(id, newStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: newStatus
            }
          : task
      )
    );

    if (selectedTask && selectedTask.id === id) {
      setSelectedTask({
        ...selectedTask,
        status: newStatus
      });
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value
    }));
  }

  function addTask(event) {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.dueDate ||
      !form.description.trim()
    ) {
      alert(
        "Please enter the task title, due date and description."
      );
      return;
    }

    const newId =
      tasks.length === 0
        ? 1
        : Math.max(...tasks.map((task) => task.id)) + 1;

    const newTask = {
      id: newId,
      code: `SPR-${100 + newId}`,
      title: form.title.trim(),
      category: form.category,
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate,
      description: form.description.trim()
    };

    setTasks((currentTasks) => [
      newTask,
      ...currentTasks
    ]);

    setForm(emptyForm);
    setShowForm(false);
  }

  function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );

    setSelectedTask(null);
  }

  function resetTasks() {
    const confirmed = window.confirm(
      "Reset the project to the original six completed tasks?"
    );

    if (!confirmed) {
      return;
    }

    setTasks(defaultTasks);
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setSelectedTask(null);

    localStorage.setItem(
      "sprintflowTasks",
      JSON.stringify(defaultTasks)
    );
  }

  function markAllTasksComplete() {
    const completedTasks = tasks.map((task) => ({
      ...task,
      status: "Done"
    }));

    setTasks(completedTasks);
    setSelectedTask(null);
  }

  function exportTasks() {
    if (tasks.length === 0) {
      alert("No tasks are available to export.");
      return;
    }

    const rows = [
      [
        "Task Code",
        "Task Title",
        "Category",
        "Priority",
        "Status",
        "Due Date",
        "Description"
      ],
      ...tasks.map((task) => [
        task.code,
        task.title,
        task.category,
        task.priority,
        task.status,
        task.dueDate,
        task.description
      ])
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(
              value ?? ""
            ).replace(/"/g, '""');

            return `"${safeValue}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;"
      }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "sprintflow-completed-tasks.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <div
      className={
        darkMode ? "app dark-theme" : "app"
      }
    >
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo">SF</div>

          <div>
            <h2>SprintFlow</h2>
            <p>Project Workspace</p>
          </div>
        </div>

        <nav className="navigation">
          <button
            type="button"
            className="nav-button active"
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            type="button"
            className="nav-button"
          >
            <span>✓</span>
            Sprint Tasks
          </button>

          <button
            type="button"
            className="nav-button"
          >
            <span>◷</span>
            Activity
          </button>

          <button
            type="button"
            className="nav-button"
          >
            <span>⚙</span>
            Settings
          </button>
        </nav>

        <div className="sidebar-project">
          <p className="small-label">
            CURRENT PROJECT
          </p>

          <h3>E-Commerce Feature Sprint</h3>

          <p>
            Final-year academic software engineering
            project
          </p>

          <div className="sidebar-progress">
            <div
              style={{
                width: `${statistics.percentage}%`
              }}
            />
          </div>

          <span>
            {statistics.percentage}% completed
          </span>
        </div>

        <div className="profile">
          <div className="profile-avatar">
            TS
          </div>

          <div>
            <strong>Tulika Shreya</strong>
            <span>Project Developer</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <p className="small-label">
              SPRINT MANAGEMENT
            </p>

            <h1>Project Dashboard</h1>

            <p className="page-subtitle">
              Manage project tasks, priorities,
              deadlines and implementation progress.
            </p>
          </div>

          <div className="header-buttons">
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                setDarkMode((currentMode) => !currentMode)
              }
            >
              {darkMode
                ? "☀ Light mode"
                : "☾ Dark mode"}
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              + Add new task
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon">
              ▤
            </div>

            <div>
              <p>Total tasks</p>
              <h2>{statistics.total}</h2>
              <span>Defined sprint scope</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon">
              ○
            </div>

            <div>
              <p>To do</p>
              <h2>{statistics.todo}</h2>
              <span>Waiting to begin</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon">
              ◔
            </div>

            <div>
              <p>In progress</p>
              <h2>
                {statistics.inProgress}
              </h2>
              <span>Currently active</span>
            </div>
          </article>

          <article className="stat-card completed-card">
            <div className="stat-icon">
              ✓
            </div>

            <div>
              <p>Completed</p>
              <h2>
                {statistics.completed}
              </h2>
              <span>
                {statistics.percentage}% completion
              </span>
            </div>
          </article>
        </section>

        <section className="progress-section">
          <div>
            <p className="small-label">
              SPRINT HEALTH
            </p>

            <h2>
              {statistics.percentage}% completed
            </h2>

            <p>
              {statistics.completed} of{" "}
              {statistics.total} tasks are complete.
            </p>
          </div>

          <div className="main-progress">
            <div
              style={{
                width: `${statistics.percentage}%`
              }}
            />
          </div>

          <div className="progress-values">
            <span>
              To do: {statistics.todo}
            </span>

            <span>
              In progress:{" "}
              {statistics.inProgress}
            </span>

            <span>
              Done: {statistics.completed}
            </span>
          </div>
        </section>

        <section className="task-workspace">
          <div className="workspace-heading">
            <div>
              <h2>Sprint Tasks</h2>

              <p>
                Track and update all project
                implementation tasks.
              </p>
            </div>

            <div className="workspace-buttons">
              <button
                type="button"
                className="small-button export-button"
                onClick={exportTasks}
              >
                ↓ Export CSV
              </button>

              <button
                type="button"
                className="small-button"
                onClick={markAllTasksComplete}
              >
                ✓ Complete All
              </button>

              <button
                type="button"
                className="small-button reset-button"
                onClick={resetTasks}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="filters">
            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search by task, code or category"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">
                All statuses
              </option>

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
            >
              <option value="All">
                All priorities
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>
          </div>

          <div className="task-table-wrapper">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Due date</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <button
                        type="button"
                        className="task-title-button"
                        onClick={() =>
                          setSelectedTask(task)
                        }
                      >
                        <span>
                          {task.code}
                        </span>

                        <strong>
                          {task.title}
                        </strong>
                      </button>
                    </td>

                    <td>
                      <span className="category-badge">
                        {task.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`priority-badge ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td>
                      {task.dueDate}
                    </td>

                    <td>
                      <select
                        className={`status-dropdown ${task.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                        value={task.status}
                        onChange={(event) =>
                          updateTaskStatus(
                            task.id,
                            event.target.value
                          )
                        }
                      >
                        {statuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="details-button"
                        onClick={() =>
                          setSelectedTask(task)
                        }
                      >
                        →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTasks.length === 0 && (
              <div className="empty-state">
                <h3>No tasks found</h3>

                <p>
                  Try changing the search text or
                  selected filters.
                </p>
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          <span>
            SprintFlow Academic Project
          </span>

          <span>
            React.js • Local Storage • CSV Export •
            Responsive Design
          </span>
        </footer>
      </main>

      {selectedTask && (
        <div
          className="modal-background"
          onClick={() =>
            setSelectedTask(null)
          }
        >
          <article
            className="task-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="close-button"
              onClick={() =>
                setSelectedTask(null)
              }
            >
              ×
            </button>

            <p className="small-label">
              {selectedTask.code}
            </p>

            <h2>
              {selectedTask.title}
            </h2>

            <p className="modal-description">
              {selectedTask.description}
            </p>

            <div className="modal-grid">
              <div>
                <span>Category</span>
                <strong>
                  {selectedTask.category}
                </strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>
                  {selectedTask.priority}
                </strong>
              </div>

              <div>
                <span>Due date</span>
                <strong>
                  {selectedTask.dueDate}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedTask.status}
                </strong>
              </div>
            </div>

            <div className="modal-status-buttons">
              {statuses.map((status) => (
                <button
                  type="button"
                  key={status}
                  className={
                    selectedTask.status === status
                      ? "modal-status-button active"
                      : "modal-status-button"
                  }
                  onClick={() =>
                    updateTaskStatus(
                      selectedTask.id,
                      status
                    )
                  }
                >
                  {status}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="delete-button"
              onClick={() =>
                deleteTask(selectedTask.id)
              }
            >
              Delete task
            </button>
          </article>
        </div>
      )}

      {showForm && (
        <div
          className="modal-background"
          onClick={() =>
            setShowForm(false)
          }
        >
          <form
            className="task-form"
            onSubmit={addTask}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="close-button"
              onClick={() =>
                setShowForm(false)
              }
            >
              ×
            </button>

            <p className="small-label">
              NEW TASK
            </p>

            <h2>
              Create Sprint Task
            </h2>

            <label className="full-field">
              Task title

              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                value={form.title}
                onChange={handleFormChange}
              />
            </label>

            <div className="form-grid">
              <label>
                Category

                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                >
                  <option value="Frontend">
                    Frontend
                  </option>

                  <option value="Backend">
                    Backend
                  </option>

                  <option value="Integration">
                    Integration
                  </option>

                  <option value="UI/UX">
                    UI/UX
                  </option>

                  <option value="Data">
                    Data
                  </option>

                  <option value="Testing">
                    Testing
                  </option>

                  <option value="Productivity">
                    Productivity
                  </option>

                  <option value="Personalization">
                    Personalization
                  </option>
                </select>
              </label>

              <label>
                Priority

                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleFormChange}
                >
                  <option value="High">
                    High
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="Low">
                    Low
                  </option>
                </select>
              </label>

              <label>
                Status

                <select
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Due date

                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleFormChange}
                />
              </label>
            </div>

            <label className="full-field">
              Description

              <textarea
                rows="4"
                name="description"
                placeholder="Enter task description"
                value={form.description}
                onChange={handleFormChange}
              />
            </label>

            <div className="form-buttons">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Create task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;