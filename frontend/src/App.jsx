import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { v4 as uuid } from "uuid";
import io from "socket.io-client";
import {X, Menu} from "lucide-react"

// Socket server connection
const socket = io("https://code-editor-zqmt.onrender.com");


const App = () => {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// start code here");
  const [copySuccess, setCopySuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [outPut, setOutPut] = useState("");
  const [version, setVersion] = useState("*");
  const [userInput, setUserInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true); // toggle sidebar for mobile

  // Socket listeners
  useEffect(() => {
    socket.on("userJoined", (users) => setUsers(users));
    socket.on("codeUpdate", (newCode) => setCode(newCode));
    socket.on("userTyping", (user) => {
      setTyping(`${user.slice(0, 8)}... is typing`);
      setTimeout(() => setTyping(""), 2000);
    });
    socket.on("languageUpdate", (newLanguage) => setLanguage(newLanguage));
    socket.on("codeResponse", (response) => setOutPut(response.run.output));

    return () => {
      socket.off("userJoined");
      socket.off("codeUpdate");
      socket.off("userTyping");
      socket.off("languageUpdate");
      socket.off("codeResponse");
    };
  }, []);

  // Handle leave room on window close
  useEffect(() => {
    const handleBeforeUnload = () => socket.emit("leaveRoom");
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("join", { roomId, userName, language });
      setJoined(true);
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom");
    setJoined(false);
    setRoomId("");
    setUserName("");
    setCode("// start code here");
    setLanguage("javascript");
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    socket.emit("codeChange", { roomId, code: newCode });
    socket.emit("typing", { roomId, userName });
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  const runCode = () => {
    socket.emit("compileCode", { code, roomId, language, version, input: userInput });
  };

  const createRoomId = () => setRoomId(uuid());

  // Join room page
  if (!joined) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-sm">
          <h1 className="mb-6 text-xl font-semibold text-gray-800">Join Code Room</h1>

          <input
            type="text"
            placeholder="Room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded text-base"
          />
          <button
            onClick={createRoomId}
            className="w-full mb-4 p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Create ID
          </button>

          <input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded text-base"
          />
          <button
            onClick={joinRoom}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Join Room
          </button>
        </div>
      </div>
    );
  }

  // Editor page
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div
        className={`bg-slate-800 text-slate-100 flex flex-col p-6 md:w-[250px] transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static top-0 left-0 h-full z-50`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-medium">Code Room: {roomId}</h2>
          <button onClick={() => setSidebarOpen(false)} className="ml-3 text-white text-2xl">
            <X />
          </button>
        </div>

        <div className="flex flex-col items-center mb-4 hidden md:flex">
          <h2 className="mb-3 text-lg font-medium">Code Room: {roomId}</h2>
          <button
            onClick={copyRoomId}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            Copy ID
          </button>
          {copySuccess && <span className="mt-2 text-sm text-green-400">{copySuccess}</span>}
        </div>

        <h3 className="mt-4 mb-2 text-base font-semibold">Users in Room:</h3>
        <ul className="space-y-2">
          {users.map((user, index) => (
            <li key={index} className="bg-gray-500 rounded px-3 py-1 text-sm">
              {user.slice(0, 8)}...
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-white">{typing}</p>

        <select
          value={language}
          onChange={handleLanguageChange}
          className="mt-4 p-2 bg-slate-700 text-white rounded outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="ruby">Ruby</option>
          <option value="csharp">C#</option>
          <option value="typescript">TypeScript</option>
          <option value="php">PHP</option>
        </select>

        <button
          onClick={leaveRoom}
          className="mt-4 p-3 bg-red-500 rounded hover:bg-red-700 transition"
        >
          Leave Room
        </button>
      </div>

      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 md:hidden z-50 p-2 bg-blue-500 text-white rounded"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu />
      </button>

      {/* Editor + Console */}
      <div className="flex-1 bg-white p-2 flex flex-col">
        <Editor
          height="50%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />

        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter input here..."
          className="w-full h-20 mt-2 p-3 font-mono bg-zinc-900 text-white border border-zinc-600 resize-none rounded"
        />

        <button
          onClick={runCode}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Execute
        </button>

        <textarea
          value={outPut}
          readOnly
          placeholder="Output will appear here ..."
          className="w-full h-[200px] mt-2 p-3 text-lg border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default App;
