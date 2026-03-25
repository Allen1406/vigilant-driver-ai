from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/status")
def status():
    return jsonify({"status": "ACTIVE"})

if __name__ == "__main__":
    app.run(port=5000)