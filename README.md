# 🚗 Vigilant Driver AI

### AI-Powered Driver Drowsiness Detection & Emergency Alert System

---

## 🧠 Overview

**Vigilant Driver AI** is a real-time AI-based system designed to detect driver drowsiness using computer vision and trigger immediate safety responses.

The system continuously monitors the driver via a camera, analyzes eye movement patterns, and detects signs of fatigue. If the driver becomes unresponsive, it automatically initiates emergency protocols such as alerts and notifications.

---

## 🚀 Features

* 🎥 Real-time driver monitoring using webcam
* 🧠 Drowsiness detection using Eye Aspect Ratio (EAR)
* 🚨 Smart alert system (countdown + alarm + popup)
* 💬 Emergency SOS workflow with chat simulation
* 📍 Google Maps location integration
* 📡 Email-based emergency alerts
* 🔁 Real-time backend-frontend communication

---

## 🏗️ Tech Stack

| Layer         | Technology         |
| ------------- | ------------------ |
| Frontend      | React + Vite       |
| Backend       | Flask (Python)     |
| AI/ML         | OpenCV + MediaPipe |
| Communication | REST APIs          |

---

## ⚙️ System Architecture

```text
Camera → OpenCV + MediaPipe → EAR Detection
       → Flask Backend → React UI
       → Alert System (Alarm + Email + SOS)
```

---

## 📦 Requirements

### 🧠 Backend (Python)

* Python **3.10** (recommended)
* flask
* flask-cors
* opencv-python
* mediapipe
* numpy

Install:

```bash
pip install flask flask-cors opencv-python mediapipe numpy
```

---

### 💻 Frontend (Node.js)

* Node.js (v18+ recommended)

Dependencies:

* react
* react-dom
* vite

Install:

```bash
npm install
```

---

### 🖥️ System Requirements

* Webcam (for detection)
* Modern browser (Chrome recommended)

---

## 📁 Project Structure

```text
vigilant-driver-ai/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
```

---

## 🚀 Setup & Run

### 🔹 Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 Access Application

Open in browser:

```
http://localhost:5173
```

---

## 📍 Demo Location

For stable demonstration, a fixed location is used:

```
Latitude: 18.60112757910701
Longitude: 73.73854802141446
```

Google Maps:
https://maps.google.com/?q=18.60112757910701,73.73854802141446

---

## 🧪 How It Works

1. Captures real-time video feed
2. Detects facial landmarks using MediaPipe
3. Calculates Eye Aspect Ratio (EAR)
4. If eyes remain closed:

   * Triggers countdown alert
   * Activates alarm
5. If no response:

   * Sends emergency alert (Email + UI)
   * Includes location & driver details

---

## 🎯 Use Cases

* Road safety systems
* Commercial driver monitoring
* Ride-sharing safety
* Industrial fatigue monitoring

---

## 🛠️ Challenges Solved

* Real-time video processing
* Backend-frontend synchronization
* Handling asynchronous alert flow
* Integrating AI detection with UI

---

## 🏆 Future Enhancements

* 📸 Driver image capture in alerts
* 📞 Auto-call emergency services
* 📱 Mobile app integration
* 🌐 Cloud-based monitoring

---

## 📜 License

This project is for academic and demonstration purposes.

---

## ⭐ Final Note

This project demonstrates how AI and real-time systems can be used to enhance road safety and prevent accidents.

> “Technology should not just be smart — it should save lives.”
