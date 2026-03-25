import cv2
import mediapipe as mp
import time
import math

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh()

cap = cv2.VideoCapture(1)

# Eye landmark indices
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

def eye_aspect_ratio(landmarks, eye_indices, w, h):
    points = []

    for idx in eye_indices:
        x = int(landmarks[idx].x * w)
        y = int(landmarks[idx].y * h)
        points.append((x, y))

    # vertical distances
    v1 = math.dist(points[1], points[5])
    v2 = math.dist(points[2], points[4])

    # horizontal distance
    h_dist = math.dist(points[0], points[3])

    ear = (v1 + v2) / (2.0 * h_dist)
    return ear


EAR_THRESHOLD = 0.25
SLEEP_TIME = 2  # seconds

start_time = None

while True:
    ret, frame = cap.read()
    if not ret:
        break

    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:

            landmarks = face_landmarks.landmark

            left_ear = eye_aspect_ratio(landmarks, LEFT_EYE, w, h)
            right_ear = eye_aspect_ratio(landmarks, RIGHT_EYE, w, h)

            ear = (left_ear + right_ear) / 2

            # Draw eye points
            for idx in LEFT_EYE + RIGHT_EYE:
                x = int(landmarks[idx].x * w)
                y = int(landmarks[idx].y * h)
                cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

            # Drowsiness logic
            if ear < EAR_THRESHOLD:
                if start_time is None:
                    start_time = time.time()

                elapsed = time.time() - start_time

                if elapsed > SLEEP_TIME:
                    cv2.putText(frame, "DROWSY DETECTED!", (50, 100),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
            else:
                start_time = None

            # Show EAR value
            cv2.putText(frame, f"EAR: {ear:.2f}", (50, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

    cv2.imshow("Drowsiness Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()