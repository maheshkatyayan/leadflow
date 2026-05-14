# LeadFlow 🚀

A lightweight, single-screen CRM for sales reps to track leads, log discussions, and manage follow-ups.

![LeadFlow Video demo](https://www.loom.com/share/1e601396e1c6415c81595abefb1c4973)

---

## Features

- **Lead List** — name, status badge, last discussion note, time since last note
- **Status Filtering** — New / Contacted / Qualified / Proposal Sent / Won / Lost
- **Search** — real-time search by name or company
- **Today's Follow-ups** — pinned at the top of the list
- **Overdue Highlights** — overdue follow-ups shown in red
- **Lead Timeline Dialog** — full discussion history (reverse chronological)
- **Add Discussion** — log notes with an optional follow-up date & time
- **Status Update** — change status directly from the timeline dialog
- **Add New Lead** — name required; company & phone optional; status defaults to New
- **Seed Data** — 6 sample leads with 13 discussions

---

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | React 18 + Vite, Axios             |
| Backend  | Node.js 22, Express 4              |
| Database | LowDB v3 (JSON file, zero deps)    |
| Styling  | Plain CSS with CSS variables       |
| DevOps   | Docker + Docker Compose (optional) |

---

## Quick Start (Manual)

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Clone & install dependencies

```bash
git clone https://github.com/maheshkatyayan/leadflow
cd leadflow
npm run install:all
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

The defaults work out of the box — no changes needed for local dev.

### 3. Seed the database (optional but recommended)

```bash
npm run seed
```

This creates 6 sample leads with discussion history.

### 4. Start the backend

```bash
npm run dev:backend
# API running at http://localhost:3001
```

### 5. Start the frontend (new terminal)

```bash
npm run dev:frontend
# App running at http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Quick Start (Docker Compose)

```bash
git clone https://github.com/YOUR_USERNAME/leadflow.git
cd leadflow
docker compose up --build
```

Then open **http://localhost:5173**.

To seed inside Docker:

```bash
docker compose exec backend node src/seed.js
```

---

## Project Structure

```
leadflow/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server entry point
│   │   ├── db.js             # LowDB setup (JSON file storage)
│   │   ├── seed.js           # Seed script (6 leads, 13 discussions)
│   │   └── routes/
│   │       ├── leads.js      # GET/POST/PATCH/DELETE /api/leads
│   │       └── discussions.js# GET/POST /api/leads/:id/discussions
│   ├── data/
│   │   └── db.json           # Auto-generated database file
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx          # React entry point
│   │   ├── App.jsx           # Main app + lead list
│   │   ├── api.js            # Axios API client
│   │   ├── utils.js          # timeAgo, formatters, isToday, isOverdue
│   │   ├── index.css         # Global styles (CSS variables)
│   │   └── components/
│   │       ├── StatusBadge.jsx    # Coloured status pill
│   │       ├── LeadCard.jsx       # Lead row card
│   │       ├── LeadTimeline.jsx   # Full timeline dialog
│   │       └── AddLeadModal.jsx   # New lead form modal
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── package.json              # Root convenience scripts
└── README.md
```

---

## API Reference

### Leads

| Method | Path              | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | /api/leads        | List leads (query: `status`, `search`) |
| POST   | /api/leads        | Create lead (`name` required)        |
| PATCH  | /api/leads/:id    | Update lead (status, followUpDate, etc.) |
| DELETE | /api/leads/:id    | Delete lead + its discussions        |

### Discussions

| Method | Path                              | Description                     |
|--------|-----------------------------------|---------------------------------|
| GET    | /api/leads/:leadId/discussions    | List discussions (newest first)  |
| POST   | /api/leads/:leadId/discussions    | Add discussion (`note` required) |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Default                    | Description               |
|----------------|----------------------------|---------------------------|
| `PORT`         | `3001`                     | Server port               |
| `FRONTEND_URL` | `http://localhost:5173`    | CORS allowed origin       |

### Frontend (`frontend/.env`)

| Variable        | Default                         | Description          |
|-----------------|---------------------------------|----------------------|
| `VITE_API_URL`  | `http://localhost:3001/api`     | Backend API base URL |

---

## Bonus Features Implemented

- ✅ **Search** — real-time search by name or company
- ✅ **Overdue follow-ups highlighted in red** — both on cards and in timeline
- ✅ **Docker Compose** — full containerised setup
- ✅ **Seed script** — 6 leads + 13 discussions
- ✅ **Status filters** — all 6 statuses + "All" tab

---

## Screenshots

| Lead List | Timeline Dialog | Add Lead |
|-----------|-----------------|----------|
| Today's follow-ups pinned at top, overdue in red | Full discussion history, status dropdown | Simple form, defaults to New |
