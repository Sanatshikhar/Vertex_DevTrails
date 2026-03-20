# 🛡️ Kavro  
**AI-Powered Parametric Income Protection for India’s Q-Commerce Workforce**

---

# 📌 1. Problem Statement

India’s gig delivery workforce (Zomato, Swiggy, Zepto, Blinkit, etc.) operates on **daily earnings with zero income protection**.

### Key Issue:
Delivery partners lose **20–30% of weekly income** due to:
- Extreme weather (rain, heatwaves)
- Platform outages (app/server crashes)
- Local disruptions (strikes, curfews)

These are **uncontrollable external risks**, yet workers bear 100% of the financial loss.

---

# 💡 2. Solution Overview

**Kavro** is a **parametric, AI-driven income protection platform** that:

- Detects disruptions using real-time data  
- Verifies if a worker was actively working  
- Automatically triggers **instant payouts (no claims required)**  

> “If you couldn’t work due to verified external conditions, you get paid automatically.”

---

# 👤 3. Target Persona (Deep Dive)

### Primary User: Q-Commerce Delivery Partner

- **Age:** 19–32  
- **Income:** ₹15,000 – ₹30,000/month  
- **Work Pattern:** 8–12 hours/day  
- **Zone:** 2–3 km hyperlocal delivery radius  
- **Platforms:** Zepto, Blinkit, Swiggy Instamart  

### Behavioral Insights:
- Relies on **daily earnings (no savings buffer)**  
- Income depends on **continuous order streaks**  
- Cannot afford **2–3 hours downtime**  
- Prefers **fast, zero-click UX**

### Pain:
- ₹300–₹800 loss per disruption day  
- Up to **30% income volatility**

---

# 📱 4. Platform Choice: Mobile-First

### Why Mobile?

- Workers operate via smartphones  
- Access to **sensor data (GPS, accelerometer, battery)**  
- Enables **real-time validation**  
- Faster UX for on-road users  

👉 Web is used for **admin dashboard only**

---

# 📲 5. Optimized Onboarding Flow

1. Mobile Number Login (OTP)  
2. Select Platform (Zepto / Blinkit / etc.)  
3. Auto-detect Work Zone (Geofence)  
4. Choose Plan (Base / Pro)  
5. Activate Weekly Coverage  

👉 Total onboarding time: **< 60 seconds**

---

# 📄 6. Policy Model (Weekly Coverage)

Each user gets a **weekly active policy**:

### Policy Includes:
- Coverage duration (7 days)  
- Selected plan (Base / Pro)  
- Trigger types (environmental, platform, social)  
- Maximum payout limit  
- Assigned geofence  

👉 Auto-renewed weekly

---

# 💰 7. Weekly Pricing Model (AI-Based)

| Plan | Weekly Cost | Coverage |
|------|------------|----------|
| Base | ₹25 | Floods, cyclones |
| Pro | ₹55 | + Heatwaves, strikes, app crashes |

---

### Dynamic Pricing Formula:
Premium = (Base Tier × Risk Factor) − Discounts − Credits  

---

### AI Pricing Engine:
- Model: Random Forest Regressor  
- Inputs:
  - 7-day weather forecast  
  - Historical disruption data  

---

### Incentives:
- Reliability Score → up to 15% discount  
- No-Claim Bonus → ₹5 credit/week  

---

# 📊 8. Parametric Trigger System

### 🌧️ Environmental
- Rainfall > 40 mm/hr  
- Temperature > 45°C  
- AQI > 300  

---

### ⚙️ Platform
- App/API downtime > threshold  

---

### 🚧 Social
- Local strikes  
- Zone closures  

---

👉 Triggers are **data-driven, not user-reported**

---

# 🔄 9. Claim Lifecycle

1. Trigger detected  
2. User mapped to affected geofence  
3. AI validation begins  
4. Fraud checks applied  
5. Claim approved or flagged  
6. Instant payout executed  

👉 Fully automated, zero manual claims

---

# 🧠 10. AI & Fraud Detection Architecture

### A. Pricing Engine
- Random Forest → dynamic premium  

---

### B. Fraud Detection Engine
- Isolation Forest → anomaly detection  

---

# 🛡️ 11. Adversarial Defense & Anti-Spoofing Strategy

## 🚨 Threat Model
Coordinated fraud using:
- GPS spoofing  
- Group attacks  
- Fake trigger participation  

---

## 🧠 Differentiation Logic
> “Behavior > Location”

### Genuine Worker:
- Natural movement patterns  
- Active app usage  
- High network fluctuation  

---

### Fraud Actor:
- Static or smooth GPS  
- Low interaction  
- Unrealistic movement  

---

## 📊 Multi-Signal Data Used:
- GPS + motion sensors  
- App activity  
- Battery usage  
- Network fluctuations  
- Road-mapped movement  

---

## 👥 Swarm Detection:
- Identical patterns across users  
- Cluster anomaly detection  

---

## ⚖️ UX Balance

| Risk Level | Action |
|-----------|--------|
| Low | Instant payout |
| Medium | Delayed validation |
| High | Temporary hold |

👉 Ensures fairness for genuine users

---

# 📉 12. Market Crash Handling

- Dynamic premium scaling  
- Regional payout caps  
- Claim throttling  
- Reserve fund buffer  
- Risk balancing across regions  

👉 Maintains financial stability during mass claims

---

# 📊 13. Analytics Dashboard

### 👤 Worker Dashboard:
- Earnings protected  
- Active coverage  
- Claim history  

---

### 🧑‍💼 Admin Dashboard:
- Loss ratio  
- Fraud alerts  
- High-risk zones  
- Active policies  

---

# 🛠️ 14. Tech Stack

- Backend: FastAPI (Python)  
- AI/ML: Scikit-learn, Pandas  
- Database: PostgreSQL + Redis  
- APIs: Weather, Maps  
- Payments: Mock UPI  

---

# 🏗️ 15. MVP Development Plan

### Week 1:
- Backend setup  
- Database schema  

---

### Week 2:
- Trigger engine  
- API integration  

---

### Week 3:
- Fraud detection  
- Validation pipeline  

---

### Week 4:
- Mock payouts  
- End-to-end testing  

---

# 🧩 16. System Architecture

## 🔄 Overview

| Layer | Component | Role |
|------|----------|------|
| User | Mobile App | User interaction (onboarding, policy, claims) |
| API | FastAPI Backend | Handles requests and business logic |
| Trigger | Trigger Engine | Detects disruptions (weather, API, social) |
| Validation | AI Engine | Verifies activity & detects fraud |
| Decision | Decision Engine | Approves / holds / rejects claims |
| Execution | Payout System | Processes payouts (mock UPI) |
| Data | DB + Cache | Stores data (PostgreSQL, Redis) |

---

## 🔁 Flow

| Step | Process |
|------|--------|
| 1 | Disruption detected |
| 2 | User mapped to location |
| 3 | AI validates activity |
| 4 | Decision engine evaluates |
| 5 | Payout triggered |
| 6 | Data stored |

---

# 🚀 17. Key Differentiators

- Zero-claim insurance system  
- Hyper-local parametric triggers  
- AI-based pricing  
- Advanced fraud detection  
- Designed for gig economy behavior  

---

# 🧾 18. Final Summary

**Kavro** is a **parametric insurtech platform** that:

- Detects disruptions in real time  
- Validates worker activity using AI  
- Pays instantly for lost income  

👉 Transforming **income uncertainty into financial security**

---

# ✅ Final Status

✔ All competition requirements covered  
✔ AI + fraud + adversarial defense included  
✔ UX + lifecycle + dashboards defined  
✔ Market crash scenario addressed  

---
