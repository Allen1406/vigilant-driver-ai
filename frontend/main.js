const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backendProcess;

// 🔥 START BACKEND
function startBackend() {
  const isDev = !app.isPackaged;

  let backendPath;

  if (isDev) {
    backendPath = path.join(__dirname, "../backend/dist/app.exe");
  } else {
    backendPath = path.join(process.resourcesPath, "backend/dist/app.exe");
  }

  console.log("Starting backend from:", backendPath);

  backendProcess = spawn(backendPath);

  backendProcess.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`Backend Error: ${data}`);
  });
}

// 🔥 CREATE WINDOW
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  win.loadFile(path.join(__dirname, "dist/index.html"));


}

// 🔥 APP START
app.whenReady().then(() => {
  startBackend();

  setTimeout(() => {
    createWindow();
  }, 3000);
});

// 🔥 CLEANUP
app.on("will-quit", () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});