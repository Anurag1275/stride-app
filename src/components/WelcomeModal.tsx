import { useState, useEffect, useRef } from "react";
import { useProgress } from "@/context/ProgressContext";

const ONBOARDED_KEY = "hasOnboarded";

export function WelcomeModal() {
  const { setUserName } = useProgress();
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localStorage.getItem(ONBOARDED_KEY) !== "true") {
      setShow(true);
      // Auto-focus the input after the modal renders
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, []);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed) {
      setUserName(trimmed);
    }
    localStorage.setItem(ONBOARDED_KEY, "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="animate-fade-in-up"
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 20,
          padding: "40px 36px 32px",
          maxWidth: 400,
          width: "90%",
          boxShadow: "0 24px 80px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#1E293B",
            marginBottom: 6,
            lineHeight: 1.3,
          }}
        >
          Welcome to Sankalp! 👋
        </h2>
        <p
          style={{
            fontSize: 15,
            color: "#94A3B8",
            marginBottom: 28,
          }}
        >
          Let's personalise your experience
        </p>

        <label
          htmlFor="welcome-name"
          style={{
            display: "block",
            textAlign: "left",
            fontSize: 13,
            fontWeight: 600,
            color: "#475569",
            marginBottom: 6,
          }}
        >
          What should we call you?
        </label>
        <input
          ref={inputRef}
          id="welcome-name"
          type="text"
          placeholder="Your first name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          maxLength={40}
          style={{
            width: "100%",
            padding: "12px 14px",
            fontSize: 15,
            border: "2px solid #E2E8F0",
            borderRadius: 12,
            outline: "none",
            transition: "border-color 0.2s ease",
            color: "#1E293B",
            background: "#F8FAFC",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#B5541C")}
          onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
        />

        <button
          onClick={handleSubmit}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "13px 0",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(135deg, #B5541C, #8B3A12)",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
            boxShadow: "0 4px 14px -3px rgba(181,84,28,0.4)",
          }}
          onMouseDown={(e) => {
            (e.target as HTMLElement).style.transform = "scale(0.97)";
          }}
          onMouseUp={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.transform = "scale(1)";
          }}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
