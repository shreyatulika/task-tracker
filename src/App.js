import React, { useState } from "react";
import "./App.css";

const TASKS = [
  {
    id: 1,
    title: "Hybrid Recently Viewed with Cross-Device Sync",
    description:
      'The platform must implement a "Recently Viewed" feature that stores product views locally for fast access while synchronizing with the server to maintain consistency across devices. The system must prevent duplicate entries, maintain a maximum of 20 items per user, and prioritize the most recently viewed products. When a user logs in after browsing anonymously, the system must merge local and server histories without duplication while preserving timestamp order. The logic must ensure consistent behavior even when accessed from multiple devices simultaneously.',
    due: "5/19/2026",
    daysLeft: 8,
    status: "in-progress",
    tag: "Sync",
    icon: "🔁",
  },
  {
    id: 2,
    title: "Scalable Theme and Dark Mode Architecture",
    description:
      "The platform must implement a centralized theme architecture that automatically detects device appearance settings on first launch while allowing users to manually switch between themes. The selected theme must persist using AsyncStorage. All UI components must consume theme values from a centralized configuration file, with no hardcoded colors allowed. The architecture must allow additional themes to be added without refactoring existing components and must maintain accessibility standards, including proper contrast ratios for readability.",
    due: "5/19/2026",
    daysLeft: 8,
    status: "in-progress",
    tag: "UI/UX",
    icon: "🎨",
  },
  {
    id: 3,
    title: "Event-Driven Push Notification System",
    description:
      "The platform must implement push notifications using Expo's notification API and web depends on the system, ensuring secure device token registration and storage in the backend. The system must support both real-time notifications (e.g., order updates) and scheduled notifications (e.g., cart abandonment reminders). A background job queue must handle delivery attempts with retry mechanisms for failures and enforce rate limiting to prevent excessive notifications. The system must correctly manage notifications across foreground, background, and terminated app states while automatically removing invalid device tokens.",
    due: "5/19/2026",
    daysLeft: 8,
    status: "todo",
    tag: "Backend",
    icon: "🔔",
  },
  {
    id: 4,
    title: "Transaction History with Audit and Export",
    description:
      'The platform must include a "My Transactions" page that supports server-side filtering, sorting, and pagination for large datasets (10,000+ records). Each transaction must display payment mode, amount, status, date/time, and receipt download options. The backend must implement idempotent webhook handling to prevent duplicate payment entries. An audit log must record transaction events such as creation, failure, or refund. The export functionality must support streaming CSV downloads to prevent excessive memory usage and generate secure PDF receipts containing unique invoice identifiers and timestamps.',
    due: "5/19/2026",
    daysLeft: 8,
    status: "todo",
    tag: "Payments",
    icon: "💳",
  },
  {
    id: 5,
    title: "Concurrency-Safe Cart with Save for Later",
    description:
      'The platform must implement a cart system that supports both active cart items and a "Save for Later" section, ensuring synchronization across multiple devices. The system must handle simultaneous updates from different sessions without causing quantity mismatches or duplicate entries. Students must implement optimistic locking or database transactions to maintain consistency. The system must also validate stock availability, detect price changes before checkout, and gracefully handle discontinued products. Clear separation of active and saved items must be maintained, and only active items should contribute to cart total calculations.',
    due: "5/19/2026",
    daysLeft: 8,
    status: "in-progress",
    tag: "Cart",
    icon: "🛒",
  },
  {
    id: 6,
    title: "Scalable Personalization Engine",
    description:
      'The platform must implement a scalable "You May Also Like" recommendation engine that dynamically generates user-specific product suggestions based on category similarity, wishlist overlap, browsing history, and product popularity as a fallback mechanism. Browsing history must be stored server-side with a limit of the last 50 unique views per user and automatic expiration of outdated records. The recommendation query must be optimized to avoid N+1 issues and must return results within 200 milliseconds under normal load conditions. Proper database indexing and query optimization are mandatory, and students must justify their design decisions, including time complexity and cold-start handling strategies.',
    due: "5/19/2026",
    daysLeft: 8,
    status: "todo",
    tag: "AI/ML",
    icon: "🤖",
  },
];

const TAG_COLORS = {
  Sync: { bg: "#E1F5EE", color: "#0F6E56", border: "#9FE1CB" },
  "UI/UX": { bg: "#EEEDFE", color: "#3C3489", border: "#CECBF6" },
  Backend: { bg: "#FAECE7", color: "#993C1D", border: "#F5C4B3" },
  Payments: { bg: "#E6F1FB", color: "#185FA5", border: "#B5D4F4" },
  Cart: { bg: "#FAEEDA", color: "#854F0B", border: "#FAC775" },
  "AI/ML": { bg: "#FBEAF0", color: "#993556", border: "#F4C0D1" },
};

const STATUS_CONFIG = {
  "in-progress": { label: "In Progress", color: "#185FA5", bg: "#E6F1FB" },
  todo: { label: "To Do", color: "#5F5E5A", bg: "#F1EFE8" },
  done: { label: "Done", color: "#3B6D11", bg: "#EAF3DE" },
};

function TaskCard({ task, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const tag = TAG_COLORS[task.tag] || {};
  const statusCfg = STATUS_CONFIG[task.status];

  return (
    <div className={`task-card ${task.status === "done" ? "done" : ""}`}>
      <div className="task-header" onClick={() => setExpanded(!expanded)}>
        <div className="task-left">
          <span className="task-icon">{task.icon}</span>
          <div className="task-info">
            <h3 className={`task-title ${task.status === "done" ? "strikethrough" : ""}`}>
              {task.title}
            </h3>
            <div className="task-meta">
              <span
                className="tag"
                style={{ background: tag.bg, color: tag.color, border: `1px solid ${tag.border}` }}
              >
                {task.tag}
              </span>
              <span className="due-date">📅 {task.due}</span>
              <span className="days-left">{task.daysLeft} days left</span>
            </div>
          </div>
        </div>
        <div className="task-right">
          <span
            className="status-badge"
            style={{ background: statusCfg.bg, color: statusCfg.color }}
          >
            {statusCfg.label}
          </span>
          <span className="chevron">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && (
        <div className="task-body">
          <p className="task-description">{task.description}</p>
          <div className="task-actions">
            <span className="action-label">Change status:</span>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                className={`status-btn ${task.status === key ? "active" : ""}`}
                style={
                  task.status === key
                    ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color }
                    : {}
                }
                onClick={() => onStatusChange(task.id, key)}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState(TASKS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const handleStatusChange = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const filtered = tasks.filter((t) => {
    const matchFilter = filter === "all" || t.status === filter;
    const matchSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tag.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: tasks.length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const progress = Math.round((counts.done / tasks.length) * 100);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1 className="app-title">🗂 Sprint Tasks</h1>
            <p className="app-subtitle">Due by May 19, 2026 · {tasks.length} tasks total</p>
          </div>
          <div className="progress-block">
            <span className="progress-label">{progress}% complete</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="stats-row">
          {Object.entries(counts).map(([key, val]) => (
            <div key={key} className="stat-card">
              <span className="stat-val">{val}</span>
              <span className="stat-key">{STATUS_CONFIG[key]?.label || "All Tasks"}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="🔍  Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {["all", "in-progress", "todo", "done"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {STATUS_CONFIG[f]?.label || "All"}
              <span className="filter-count">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="task-list">
        {filtered.length === 0 ? (
          <div className="empty-state">No tasks match your filter.</div>
        ) : (
          filtered.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
          ))
        )}
      </main>
    </div>
  );
}

export default App;
