import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie
} from "recharts"

function Dashboard() {
  // Dark mode
  const [dark, setDark] = useState(false)

  // Role
  const [role, setRole] = useState("viewer")

  // Search + filter
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  // Transactions
  const [transactions, setTransactions] = useState([])

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transactions"))
    const savedRole = localStorage.getItem("role")

    if (saved) setTransactions(saved)
    else {
      setTransactions([
        { id: 1, date: "2026-04-01", amount: 2000, category: "Salary", type: "income" },
        { id: 2, date: "2026-04-02", amount: 500, category: "Food", type: "expense" },
      ])
    }

    if (savedRole) setRole(savedRole)
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
    localStorage.setItem("role", role)
  }, [transactions, role])

  // Add transaction (admin)
  const addTransaction = () => {
    const newTx = {
      id: Date.now(),
      date: "2026-04-06",
      amount: Math.floor(Math.random() * 2000),
      category: "Misc",
      type: Math.random() > 0.5 ? "income" : "expense"
    }
    setTransactions([...transactions, newTx])
  }

  // Filter logic
  const filtered = transactions.filter((t) =>
    (filter === "all" || t.type === filter) &&
    t.category.toLowerCase().includes(search.toLowerCase())
  )

  // Chart data
  const barData = [
    { month: "Jan", income: 4000, expenses: 2400 },
    { month: "Feb", income: 3000, expenses: 1398 },
    { month: "Mar", income: 5000, expenses: 2800 },
  ]

  const pieData = [
    { name: "Food", value: 400 },
    { name: "Rent", value: 800 },
    { name: "Shopping", value: 300 },
    { name: "Travel", value: 200 },
  ]

  const bg = dark ? "#111827" : "#f3f4f6"
  const text = dark ? "white" : "black"

  return (
    <div style={{ padding: 20, background: bg, minHeight: "100vh", color: text }}>

      {/* HEADER */}
      <h1 style={{ fontSize: 28 }}>Finance Dashboard 💰</h1>

      {/* CONTROLS */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={() => setDark(!dark)}>
          {dark ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>

      </div>

      {/* CARDS */}
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        <Card title="Total Balance" value="₹12,000" text={text} />
        <Card title="Income" value="₹8,000" color="green" text={text} />
        <Card title="Expenses" value="₹4,000" color="red" text={text} />
      </div>

      {/* CHARTS */}
      <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>
        <Box>
          <h3>Monthly Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="month" stroke={text} />
              <YAxis stroke={text} />
              <Tooltip />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <h3>Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </div>

      {/* TRANSACTIONS */}
      <div style={{ marginTop: 40 }}>
        <h2>Transactions</h2>

        {/* SEARCH + FILTER */}
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* ADMIN ACTION */}
        {role === "admin" && (
          <button onClick={addTransaction} style={{ marginBottom: 10 }}>
            + Add Transaction
          </button>
        )}

        {/* TABLE */}
        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Type</th>
              {role === "admin" && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.category}</td>
                <td>₹{t.amount}</td>
                <td>{t.type}</td>
                {role === "admin" && <td>Edit</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// Components
function Card({ title, value, color = "black", text }) {
  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 10,
      width: 200
    }}>
      <p style={{ color: "gray" }}>{title}</p>
      <h2 style={{ color }}>{value}</h2>
    </div>
  )
}

function Box({ children }) {
  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 10,
      width: 400
    }}>
      {children}
    </div>
  )
}

export default Dashboard