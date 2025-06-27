# ⛳ Cha Cha Cha Golf Trip App

A React app built with [Bolt.new](https://bolt.new) to manage a rotating golf game format for an 11-player group trip. This app handles team assignments, scoring, payout breakdowns, and modified handicap rules.

---

## 🧠 Game Format Overview

Each round is divided into **three 6-hole segments** using a rotating net best ball structure:

| Holes      | Team Score Counts         |
|------------|---------------------------|
| 1–3        | Best **1** net score      |
| 4–6        | Best **2** net scores     |
| 7–9        | Best **1** net score      |
| 10–12      | Best **2** net scores     |
| 13–15      | Best **1** net score      |
| 16–18      | Best **2** net scores     |

---

## 💸 Entry & Payout Structure

- **$30 per player per day**  
- **11 players = $330/day total pot**
- **$60 removed daily for skins**
- **$270 split into 3 payouts:**
  - Holes 1–6 winner → $30
  - Holes 7–12 winner → $30
  - Holes 13–18 winner → $30

Skins payouts are handled separately.

---

## 👥 Team Rotation

Teams rotate daily to keep play fresh and fair. Each day includes:
- **4 teams of 2**
- **1 team of 3**

Team assignments are hard-coded based on a pre-defined fair rotation that ensures:
- No more than one high-handicap player per small team
- No team of 3 includes more than one of: `Drew`, `Dan Y`, `MJ`, `Bryan`

---

## 🟡 Handicap Modifications

Players with an asterisk (*) use **modified net scoring** rules:

**Modified Players:** `Drew`, `Dan Y`, `MJ`, `Bryan`

### Bonus Strokes
- **Par 4 or 5**: +3 strokes (e.g. Par 5 = Par 8)
- **Par 3**: +2 strokes

### Ball Sharing Rules
- Players can play from a teammate's ball **but lose 1 bonus stroke** for that hole
- Once on the green, they **must play their own ball**
- At the end of the hole, unused bonus strokes are **subtracted** from the gross score

---

## ⚙️ Built With

- ⚛️ React (via [bolt.new](https://bolt.new))
- 💾 State management via local storage (or optional Supabase integration)
- 📊 Responsive layout for mobile scoring on the course

---

## 🚀 Getting Started

```bash
git clone https://github.com/your-username/cha-cha-cha-golf.git
cd cha-cha-cha-golf
npm install
npm start
