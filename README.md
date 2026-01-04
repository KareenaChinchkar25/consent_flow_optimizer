# Consent Flow Optimizer ( LIVE - https://consentsopti.vercel.app/ )
A Privacy-First System to Analyze, Predict & Visualize User Consent Data Across Websites

---

## Problem Statement

Users grant website permissions—such as camera, location, microphone, cookies, and device access—without understanding:

- How their data is used  
- Where it flows  
- How long it is retained  
- Whether it is shared with third parties  
- Whether revoked consents are still being used  
- The overall risk associated with each consent  

Regulations such as GDPR, CCPA, and DPDPA require transparency, yet users and developers lack a unified system to analyze consent patterns and detect misuse.

There is no complete end-to-end solution that collects, predicts, and visualizes consent risks across websites.

---

## Solution — Consent Flow Optimizer

An integrated system that enhances transparency and control over digital permissions by:

### Collecting  
A Chrome Extension captures real-time permission events from websites.

### Predicting  
A CatBoost ML model provides:
- Risk Score (0–1)  
- Risk Level (Low, Medium, High)

### Visualizing  
A modern React dashboard displays:
- Consent activity  
- Permission usage patterns  
- Risk distribution  
- High-risk websites  
- Data retention insights  

### Supporting Users and Developers
- Detect misuse  
- Audit permissions  
- Improve transparency  
- Support compliance  

---

## Key Features

### Chrome Extension
- Captures permission events (camera, mic, location, notifications)  
- Lightweight and secure  
- Sends events to backend API  

### Machine Learning Backend
- CatBoost model  
- FastAPI-based REST API  
- Data preprocessing and risk prediction  

### Analytics Dashboard
- Built using React + Vite  
- Modern UI  
- Charts, tables, filtering options  
- Real-time insights  

### Backend APIs
- FastAPI endpoints  
- Pydantic-based validation  
- Scalable and modular  

---

## Tech Stack

### Frontend (Dashboard)
- React (Vite)  
- TailwindCSS  
- Recharts  

### ML Backend
- Python  
- FastAPI  
- CatBoost  
- Pandas / NumPy  

### Chrome Extension
- Manifest V3  
- Background and content scripts  

### Other Tools
- GitHub  
- VS Code  
- REST APIs  
- JSON  

---

## How It Works (Architecture)

1. User visits any website  
2. Chrome Extension detects and logs permission events  
3. The event is sent to the ML backend  
4. ML model generates:
   - Risk score  
   - Risk category  
5. Dashboard fetches and visualizes data  
6. User views all consent activity and risk insights  

## Technical Overview

![WhatsApp Image 2025-11-26 at 13 01 14_5c93f622](https://github.com/user-attachments/assets/25affaf9-1f21-4446-a563-31f453888a27)

---

## Project Structure

```
Consent-Flow-Optimizer/
|
├── ml_backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── prediction.py
│   │   ├── preprocessing.py
│   │   ├── model_loader.py
│   │   ├── schemas.py
│   │   └── utils.py
│   └── train.py
|
├── frontend/
│   └── consent-dashboard/
│       ├── src/
│       │   ├── components/
│       │   ├── services/
│       │   ├── context/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── public/
│       ├── package.json
│       └── vite.config.js
|
├── consent-extension/
│   └── consent-extension/
│       ├── background.js
│       ├── content.js
│       ├── popup.html
│       ├── popup.js
│       ├── manifest.json
│       └── icons/
|
├── README.md
└── .gitignore
```

---

## Screenshots

### Landing Page  

<img width="1907" height="871" alt="Screenshot 2025-11-26 125458" src="https://github.com/user-attachments/assets/253e90b3-8f0c-41d7-b68d-dd2246df9125" />

<img width="1901" height="870" alt="Screenshot 2025-11-26 125523" src="https://github.com/user-attachments/assets/1dde679d-819c-4def-89ee-840a14781e47" />

<img width="1919" height="864" alt="Screenshot 2025-11-26 125542" src="https://github.com/user-attachments/assets/fef468fd-d82c-415b-9b68-4f08614c271d" />


### Dashboard


<img width="1920" height="1080" alt="Screenshot (169)" src="https://github.com/user-attachments/assets/ab6a423e-f1eb-4122-8e85-b5b106ff7009" />


### Chrome Extension Popup  

<img width="1907" height="873" alt="Screenshot 2025-11-26 123033" src="https://github.com/user-attachments/assets/0fffe719-fcee-41ef-84cb-5c64966ea034" />

---

## Setup Instructions

### 1. Clone Repository

    git clone https://github.com/KareenaChinchkar25/consent_flow_optimizer.git
    cd consent_flow_optimizer

---

### 2. Run Backend

    cd ml_backend
    uvicorn app.main:app --reload

Backend runs at:  
    http://localhost:8000

---

### 3. Run Frontend Dashboard

    cd frontend/consent-dashboard
    npm install
    npm run dev

Frontend runs at:  
    http://localhost:5173

---

### 4. Load Chrome Extension

1. Open: chrome://extensions/  
2. Enable Developer Mode  
3. Click "Load Unpacked"  
4. Select the folder:

        consent-extension/consent-extension/

---

## Collaborators

| Name              | Role                                   |
|-------------------|-----------------------------------------|
| Om Gadge          | Machine Learning & Backend Developer    |
| Kareena Chinchkar | Frontend Developer & UI/UX Engineer     |

---

## Future Enhancements
- Multilingular Support
- Multi-browser support (Firefox, Edge, Brave)  
- AI-driven chatbot for real time conversaion   
- VPN and tracker detection  
- Dark mode dashboard  
- Deployment as SaaS  

