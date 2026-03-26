import smtplib
from email.mime.text import MIMEText
from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import cv2
import mediapipe as mp
import time
import math

app = Flask(__name__)
CORS(app)

status = "ACTIVE"

mp_face_mesh = mp.solutions.face_mesh

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

EAR_THRESHOLD = 0.25
SLEEP_TIME = 2

start_time = None


def eye_aspect_ratio(landmarks, eye_indices, w, h):
    points = []
    for idx in eye_indices:
        x = int(landmarks[idx].x * w)
        y = int(landmarks[idx].y * h)
        points.append((x, y))

    v1 = math.dist(points[1], points[5])
    v2 = math.dist(points[2], points[4])
    h_dist = math.dist(points[0], points[3])

    return (v1 + v2) / (2.0 * h_dist)


# 🔥 SINGLE CAMERA + STABLE STREAM + DETECTION
def generate_frames():
    global status, start_time

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    frame_count = 0
    face_mesh = None

    while True:
        success, frame = cap.read()
        if not success:
            continue

        # 🔥 Reinitialize FaceMesh every 100 frames (CRITICAL FIX)
        if frame_count % 100 == 0:
            face_mesh = mp_face_mesh.FaceMesh(
                static_image_mode=False,
                max_num_faces=1,
                refine_landmarks=True
            )

        frame_count += 1

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape

        rgb = cv2.cvtColor(frame.copy(), cv2.COLOR_BGR2RGB)

        try:
            results = face_mesh.process(rgb)
        except:
            continue

        if results.multi_face_landmarks:
            for face_landmarks in results.multi_face_landmarks:
                landmarks = face_landmarks.landmark

                left_ear = eye_aspect_ratio(landmarks, LEFT_EYE, w, h)
                right_ear = eye_aspect_ratio(landmarks, RIGHT_EYE, w, h)

                ear = (left_ear + right_ear) / 2

                # 👁 Draw eye points
                for idx in LEFT_EYE + RIGHT_EYE:
                    x = int(landmarks[idx].x * w)
                    y = int(landmarks[idx].y * h)
                    cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

                # 🧠 Drowsiness logic
                if ear < EAR_THRESHOLD:
                    if start_time is None:
                        start_time = time.time()

                    if time.time() - start_time > SLEEP_TIME:
                        status = "DROWSY"
                        cv2.putText(frame, "DROWSY DETECTED!", (50, 100),
                                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
                else:
                    start_time = None
                    status = "ACTIVE"

                # EAR display
                cv2.putText(frame, f"EAR: {ear:.2f}", (50, 50),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        # Encode frame
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

        time.sleep(0.03)  # 🔥 IMPORTANT


# 🔄 STATUS API
@app.route("/status")
def get_status():
    return jsonify({"status": status})


@app.route("/")
def home():
    return "Backend running"


# 🎥 VIDEO STREAM
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


# 📡 SOS API
@app.route("/send-sos", methods=["POST"])
def send_sos():
    data = request.get_json()
    location = data.get("location")

    message = f"""
EMERGENCY ALERT

Driver: ABC driver
Vehicle: GJ00 AZ1234

Driver drowsiness detected

Location:
{location}
"""

    try:
        sender = "fernandezallen234@gmail.com"
        receiver = "patelanul2006@gmail.com"
        password = "vjpkgvpjdjncsxwx"

        msg = MIMEText(message)
        msg["Subject"] = "Driver Emergency Alert"
        msg["From"] = sender
        msg["To"] = receiver

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender, password)
        server.send_message(msg)
        server.quit()

        print("✅ Email sent successfully")

    except Exception as e:
        print("❌ Email failed:", e)

    return {"status": "sent"}


if __name__ == "__main__":
    app.run(port=5000, debug=False, use_reloader=False)