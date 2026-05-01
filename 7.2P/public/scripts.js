const socket = io();

const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const onlinePill = document.getElementById("online-pill");

function formatTime(isoTime) {
  return new Date(isoTime).toLocaleTimeString();
}

function addMessage(type, text, timestamp, sender = "") {
  const messageEl = document.createElement("article");
  messageEl.classList.add("message");

  if (type === "system") {
    messageEl.classList.add("system");
  }

  const metaEl = document.createElement("div");
  metaEl.classList.add("meta");
  metaEl.textContent =
    type === "system"
      ? `System • ${formatTime(timestamp)}`
      : `${sender} • ${formatTime(timestamp)}`;

  const textEl = document.createElement("div");
  textEl.classList.add("text");
  textEl.textContent = text;

  messageEl.append(metaEl, textEl);
  chatBox.appendChild(messageEl);

  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();
  if (!message) return;

  socket.emit("chat message", message);
  messageInput.value = "";
  messageInput.focus();
});

socket.on("chat message", (data) => {
  addMessage("chat", data.text, data.timestamp, data.sender);
});

socket.on("system message", (data) => {
  addMessage("system", data.text, data.timestamp);
  const onlineMatch = data.text.match(/Online users:\s*(\d+)/i);
  if (onlineMatch) {
    onlinePill.textContent = `Online: ${onlineMatch[1]}`;
  }
});
