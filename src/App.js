import React, { useEffect, useState } from "react";

const initialTasks = [
  {
    id: 1,
    icon: "🔄",
    title: "Hybrid Recently Viewed with Cross-Device Sync",
    category: "Sync",
    status: "In Progress",
    description:
      "Stores recently viewed items, prevents duplicates and keeps the latest viewed item first."
  },
  {
    id: 2,
    icon: "🎨",
    title: "Scalable Theme and Dark Mode Architecture",
    category: "UI/UX",
    status: "In Progress",
    description:
      "Provides light and dark themes and saves the selected theme."
  },
  {
    id: 3,
    icon: "🔔",
    title: "Event-Driven Push Notification System",
    category: "Backend",
    status: "To Do",
    description:
      "Displays browser notifications for task updates and reminders."
  },
  {
    id: 4,
    icon: "💳",
    title: "Transaction History with Audit and Export",
    category: "Payments",
    status: "To Do",
    description:
      "Displays transaction history and exports transactions as a CSV file."
  },
  {
    id: 5,
    icon: "🛒",
    title: "Concurrency-Safe Cart with Save for Later",
    category: "Cart",
    status: "In Progress",
    description:
      "Allows tasks to be saved for later without creating duplicate entries."
  },
  {
    id: 6,
    icon: "🤖",
    title: "Scalable Personalization Engine",
    category: "AI/ML",
    status: "To Do",
    description:
      "Recommends similar tasks based on the selected task category."
  }
];

const transactions = [
  {
    id: "TXN001",
    item: "Premium Task Plan",
    amount: 499,
    status: "Successful",
    date: "19/07/2026"
  },
  {
    id: "TXN002",
    item: "Dark Theme Package",
    amount: 199,
    status: "Successful",
    date: "18/07/2026"
  },
  {
    id: "TXN003",
    item: "Notification Service",
    amount: 299,
    status: "Pending",
    date: "17/07/2026"
  }
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("sprintTasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [expandedTask, setExpandedTask] = useState(null);

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem("recentlyViewed");
    return saved ? JSON.parse(saved) : [];
  });

  const [savedForLater, setSavedForLater] = useState(() => {
    const saved = localStorage.getItem("savedForLater");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("sprintTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(recentlyViewed)
    );
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem(
      "savedForLater",
      JSON.stringify(savedForLater)
    );
  }, [savedForLater]);

  const updateStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  const viewTask = (task) => {
    setExpandedTask(expandedTask === task.id ? null : task.id);
    setSelectedTask(task);

    setRecentlyViewed((previous) => {
      const withoutDuplicate = previous.filter(
        (item) => item.id !== task.id
      );

      return [task, ...withoutDuplicate].slice(0, 5);
    });
  };

  const saveTaskForLater = (task) => {
    setSavedForLater((previous) => {
      const alreadySaved = previous.some(
        (item) => item.id === task.id
      );

      if (alreadySaved) {
        alert("Task is already saved.");
        return previous;
      }

      return [...previous, task];
    });
  };

  const removeSavedTask = (taskId) => {
    setSavedForLater(
      savedForLater.filter((task) => task.id !== taskId)
    );
  };

  const showNotification = async () => {
    if (!("Notification" in window)) {
      alert("Your browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      new Notification("Sprint Task Reminder", {
        body: "You have sprint tasks waiting for completion."
      });
    } else {
      alert("Notification permission was not granted.");
    }
  };

  const exportTransactions = () => {
    const rows = [
      ["Transaction ID", "Item", "Amount", "Status", "Date"],
      ...transactions.map((transaction) => [
        transaction.id,
        transaction.item,
        transaction.amount,
        transaction.status,
        transaction.date
      ])
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "transaction-history.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || task.status === filter;

    return matchesSearch && matchesFilter;
  });

  const doneCount = tasks.filter(
    (task) => task.status === "Done"
  ).length;

  const progress = Math.round(
    (doneCount / tasks.length) * 100
  );

  const recommendations = selectedTask
    ? tasks
        .filter(
          (task) =>
            task.id !== selectedTask.id &&
            task.category !== selectedTask.category
        )
        .slice(0, 3)
    : tasks.slice(0, 3);

  const styles = {
    app: {
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "Arial, sans-serif",
      background: darkMode ? "#111827" : "#f5f3ee",
      color: darkMode ? "#f9fafb" : "#172033"
    },
    container: {
      maxWidth: "1100px",
      margin: "auto"
    },
    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      flexWrap: "wrap",
      marginBottom: "20px"
    },
    button: {
      padding: "10px 16px",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold"
    },
    card: {
      background: darkMode ? "#1f2937" : "#ffffff",
      border: darkMode
        ? "1px solid #374151"
        : "1px solid #d9d5cc",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "15px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.05)"
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
      gap: "15px",
      marginBottom: "20px"
    },
    summaryBox: {
      background: darkMode ? "#1f2937" : "#ffffff",
      padding: "18px",
      borderRadius: "14px",
      textAlign: "center"
    },
    controls: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginBottom: "20px"
    },
    input: {
      flex: "1",
      minWidth: "220px",
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      fontSize: "16px"
    },
    taskHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "15px",
      cursor: "pointer"
    },
    badge: {
      padding: "7px 12px",
      borderRadius: "15px",
      background: "#e7f1ff",
      color: "#075ea8",
      fontWeight: "bold"
    },
    statusButtons: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "15px"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    cell: {
      border: darkMode
        ? "1px solid #4b5563"
        : "1px solid #ddd",
      padding: "10px",
      textAlign: "left"
    }
  };

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1>📁 Sprint Tasks</h1>
            <p>Complete all project features and track progress.</p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              style={{
                ...styles.button,
                background: "#7c3aed",
                color: "white"
              }}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>

            <button
              style={{
                ...styles.button,
                background: "#0284c7",
                color: "white"
              }}
              onClick={showNotification}
            >
              🔔 Test Notification
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <h2>{progress}% Complete</h2>

          <div
            style={{
              height: "14px",
              background: darkMode ? "#374151" : "#e5e7eb",
              borderRadius: "20px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#16a34a",
                transition: "0.3s"
              }}
            />
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryBox}>
            <h2>{tasks.length}</h2>
            <p>All Tasks</p>
          </div>

          <div style={styles.summaryBox}>
            <h2>
              {
                tasks.filter(
                  (task) => task.status === "In Progress"
                ).length
              }
            </h2>
            <p>In Progress</p>
          </div>

          <div style={styles.summaryBox}>
            <h2>
              {
                tasks.filter(
                  (task) => task.status === "To Do"
                ).length
              }
            </h2>
            <p>To Do</p>
          </div>

          <div style={styles.summaryBox}>
            <h2>{doneCount}</h2>
            <p>Done</p>
          </div>
        </div>

        <div style={styles.controls}>
          <input
            style={styles.input}
            placeholder="Search tasks..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {["All", "In Progress", "To Do", "Done"].map(
            (status) => (
              <button
                key={status}
                style={{
                  ...styles.button,
                  background:
                    filter === status ? "#111827" : "#ffffff",
                  color:
                    filter === status ? "#ffffff" : "#111827",
                  border: "1px solid #ccc"
                }}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            )
          )}
        </div>

        {filteredTasks.map((task) => (
          <div key={task.id} style={styles.card}>
            <div
              style={styles.taskHeader}
              onClick={() => viewTask(task)}
            >
              <div>
                <h2
                  style={{
                    textDecoration:
                      task.status === "Done"
                        ? "line-through"
                        : "none"
                  }}
                >
                  {task.icon} {task.title}
                </h2>

                <span style={styles.badge}>
                  {task.category}
                </span>
              </div>

              <div>
                <span style={styles.badge}>{task.status}</span>
                <span style={{ marginLeft: "10px" }}>
                  {expandedTask === task.id ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {expandedTask === task.id && (
              <div style={{ marginTop: "18px" }}>
                <p>{task.description}</p>

                <div style={styles.statusButtons}>
                  {["To Do", "In Progress", "Done"].map(
                    (status) => (
                      <button
                        key={status}
                        style={{
                          ...styles.button,
                          background:
                            task.status === status
                              ? "#16a34a"
                              : "#e5e7eb",
                          color:
                            task.status === status
                              ? "white"
                              : "#111827"
                        }}
                        onClick={() =>
                          updateStatus(task.id, status)
                        }
                      >
                        {status}
                      </button>
                    )
                  )}

                  <button
                    style={{
                      ...styles.button,
                      background: "#f59e0b",
                      color: "white"
                    }}
                    onClick={() => saveTaskForLater(task)}
                  >
                    🛒 Save for Later
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div style={styles.card}>
          <h2>🕘 Recently Viewed</h2>

          {recentlyViewed.length === 0 ? (
            <p>Open a task to add it here.</p>
          ) : (
            recentlyViewed.map((task) => (
              <p key={task.id}>
                {task.icon} {task.title}
              </p>
            ))
          )}
        </div>

        <div style={styles.card}>
          <h2>🛒 Saved for Later</h2>

          {savedForLater.length === 0 ? (
            <p>No saved tasks.</p>
          ) : (
            savedForLater.map((task) => (
              <div
                key={task.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px"
                }}
              >
                <span>
                  {task.icon} {task.title}
                </span>

                <button
                  style={{
                    ...styles.button,
                    background: "#dc2626",
                    color: "white"
                  }}
                  onClick={() => removeSavedTask(task.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div style={styles.card}>
          <h2>🤖 You May Also Like</h2>

          {recommendations.map((task) => (
            <p key={task.id}>
              {task.icon} {task.title}
            </p>
          ))}
        </div>

        <div style={styles.card}>
          <div style={styles.topBar}>
            <h2>💳 Transaction History</h2>

            <button
              style={{
                ...styles.button,
                background: "#16a34a",
                color: "white"
              }}
              onClick={exportTransactions}
            >
              Export CSV
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.cell}>Transaction ID</th>
                  <th style={styles.cell}>Item</th>
                  <th style={styles.cell}>Amount</th>
                  <th style={styles.cell}>Status</th>
                  <th style={styles.cell}>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={styles.cell}>
                      {transaction.id}
                    </td>
                    <td style={styles.cell}>
                      {transaction.item}
                    </td>
                    <td style={styles.cell}>
                      ₹{transaction.amount}
                    </td>
                    <td style={styles.cell}>
                      {transaction.status}
                    </td>
                    <td style={styles.cell}>
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          style={{
            ...styles.button,
            width: "100%",
            background: "#dc2626",
            color: "white",
            marginTop: "10px"
          }}
          onClick={() => {
            localStorage.clear();
            setTasks(initialTasks);
            setRecentlyViewed([]);
            setSavedForLater([]);
            setDarkMode(false);
          }}
        >
          Reset Application
        </button>
      </div>
    </div>
  );
}