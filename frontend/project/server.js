// server.js - minimal backend to serve frontend + sample APIs
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// sample in-memory storage (for demo)
let expenses = [
  // date ISO, amount, category, description
  { id:1, date: '2025-09-28', amount: 40, category: 'Food', description: 'Lunch' },
  { id:2, date: '2025-10-02', amount: 600, category: 'Rent', description: 'Hostel rent' },
  { id:3, date: '2025-10-03', amount: 60, category: 'Stationary', description: 'Notebooks' },
  { id:4, date: '2025-10-04', amount: 150, category: 'Petrol', description: 'Bike refill' },
];

let friends = [
  { id: 1, name: 'Aman' },
  { id: 2, name: 'Priya' },
  { id: 3, name: 'Rahul' }
];

let reminders = [
  { id: 1, title: 'Library Fee', due: '2025-10-10', amount: 500, done:false }
];

// APIs
app.get('/api/expenses', (req, res) => {
  res.json({ success:true, data: expenses });
});

app.post('/api/expenses', (req, res) => {
  const e = req.body;
  e.id = Date.now();
  expenses.push(e);
  res.json({ success:true, data: e });
});

app.get('/api/categories', (req, res) => {
  // produce aggregated by category
  const agg = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  res.json({ success:true, data: agg });
});

app.get('/api/friends', (req, res) => {
  res.json({ success:true, data: friends });
});

app.post('/api/split', (req, res) => {
  // simple split algorithm - for demo only
  const { total, payerId, splits } = req.body;
  // splits: [{friendId, amount}]
  res.json({ success:true, message: 'Split saved (demo)', sharePerFriend: total / (splits.length + 1) });
});

app.get('/api/reminders', (req, res) => {
  res.json({ success:true, data: reminders });
});

app.post('/api/reminders', (req, res) => {
  const r = req.body; r.id = Date.now();
  reminders.push(r);
  res.json({ success:true, data: r });
});

// chat inference mock
app.post('/api/chat', (req, res) => {
  const q = req.body.query || '';
  // mock response (in real app call inference model)
  const reply = `Mock reply: I can help with your budget. You asked: "${q}"`;
  res.json({ success:true, reply });
});

app.listen(port, ()=> console.log(`Server running at http://localhost:${port}`));
// End of server.js