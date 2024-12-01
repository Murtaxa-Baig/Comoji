"use client"
import { useState, useEffect, useRef } from "react";

export default function App() {
  // const emojiList = [
  //   "😀", "😃", "😄", "😁", "😆", "😅", "😂", "😊", "🥰", "🤔", "🤩", "🤯", "😎", "😏", "😇",
  // ];

  const emojiList = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "😊", "🥰", "🤔", "🤩", "🤯", "😎", "😏", "😇",
    "🤓", "🤡", "🤠", "😈", "👿", "🤥", "😷", "🤒", "🤕", "🤑", "🤗", "🤤", "🤧", "😴", "🤪",
    "😜", "😝", "😛", "🫣", "🫠", "🫥", "🥳", "🥴", "🫡", "🫤", "😬", "🙃", "🫣", "🫠", "🫥",
    "😌", "🤭", "🤫", "😳", "🥺", "😦", "😧", "😮", "😯", "😲", "😵", "😵‍💫", "🤯", "🤠", "🥸",
    "🤡", "😺", "😸", "😻", "😽", "🙀", "😿", "😼", "🥺", "😽", "🤧"
  ];

  const [activeBox, setActiveBox] = useState("emoji1");
  const [selectedEmoji1, setSelectedEmoji1] = useState(null);
  const [selectedEmoji2, setSelectedEmoji2] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  // Function to encode emoji to Unicode
  const encodeEmoji = (emoji) => {
    return Array.from(emoji)
      .map((char) => char.codePointAt(0).toString(16))
      .join("_");
  };

  // Function to generate result URL
  const generateResult = () => {
    if (selectedEmoji1 && selectedEmoji2) {
      const encodedEmoji1 = encodeEmoji(selectedEmoji1);
      const encodedEmoji2 = encodeEmoji(selectedEmoji2);
      setResultUrl(
        `https://emojik.vercel.app/s/${encodedEmoji1}_${encodedEmoji2}?size=128`
      );
    } else {
      setResultUrl(null);
    }
  };

  // Handle emoji selection
  const selectEmoji = (emoji) => {
    if (activeBox === "emoji1") {
      setSelectedEmoji1(emoji);
      setActiveBox("emoji2");
    } else {
      setSelectedEmoji2(emoji);
    }
  };

  // Randomize emojis (Dice functionality)
  const randomizeEmojis = () => {
    const randomEmoji1 = emojiList[Math.floor(Math.random() * emojiList.length)];
    const randomEmoji2 = emojiList[Math.floor(Math.random() * emojiList.length)];
    setSelectedEmoji1(randomEmoji1);
    setSelectedEmoji2(randomEmoji2);
    setActiveBox("emoji2");
  };

  // Clear the selected emoji in a box
  const clearBox = (box) => {
    if (box === "emoji1") {
      setSelectedEmoji1(null);
    } else {
      setSelectedEmoji2(null);
    }
    setResultUrl(null);
  };

  // Generate result URL whenever emojis are updated
  useEffect(() => {
    generateResult();
  }, [selectedEmoji1, selectedEmoji2]);

  // Download combined emoji as PNG
  const downloadImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 128;

    if (selectedEmoji1 && selectedEmoji2) {
      canvas.width = size * 2 + 10; // Width for two emojis with padding
      canvas.height = size;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${size / 1.5}px Arial`;

      // Draw the emojis
      ctx.fillText(selectedEmoji1, size / 2, size / 2);
      ctx.fillText(selectedEmoji2, size + size / 2 + 10, size / 2);

      // Download the canvas as PNG
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "emoji-combination.png";
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-5">
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Comoji
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Combine two emojis to create your own emoji!
        </p>

        {/* Emoji Selector */}
        <div className="flex justify-center items-center mb-4 space-x-3">
          <div
            className={`emoji-box ${activeBox === "emoji1" ? "ring-2 ring-blue-500" : ""
              }`}
            onClick={() => setActiveBox("emoji1")}
          >
            {selectedEmoji1 || "❓"}
          </div>
          <span className="text-xl font-bold">+</span>
          <div
            className={`emoji-box ${activeBox === "emoji2" ? "ring-2 ring-blue-500" : ""
              }`}
            onClick={() => setActiveBox("emoji2")}
          >
            {selectedEmoji2 || "❓"}
          </div>
          <span className="text-xl font-bold">=</span>
          <div className="emoji-box">
            {resultUrl ? (
              <img
                src={resultUrl}
                alt={`${selectedEmoji1} + ${selectedEmoji2}`}
                className="w-full h-full object-contain"
              />
            ) : (
              "❓"
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={randomizeEmojis}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
          >
            🎲 Random
          </button>
          <button
            onClick={downloadImage}
            className={`py-2 px-4 rounded-lg shadow ${selectedEmoji1 && selectedEmoji2
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            disabled={!selectedEmoji1 || !selectedEmoji2}
          >
            Download
          </button>
        </div>

        {/* Emoji Grid */}
        <h4 className="text-center text-lg font-semibold text-gray-700 mb-4">
          Select an Emoji:
        </h4>
        <div className="grid grid-cols-5 gap-3">
          {emojiList.map((emoji, index) => (
            <button
              key={index}
              onClick={() => selectEmoji(emoji)}
              className="emoji-tile hover:bg-gray-200"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
