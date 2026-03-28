"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const CORRECT_ANSWER = "神秘哥";

export function ZrcGate() {
  const [showDialog, setShowDialog] = useState(false);
  const [answer, setAnswer] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (showDialog && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showDialog]);

  const handleSubmit = () => {
    if (answer.trim() === CORRECT_ANSWER) {
      setSuccess(true);
      setTimeout(() => {
        setShowDialog(false);
        router.push("/zrc");
      }, 1200);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const openDialog = () => {
    setShowDialog(true);
    setAnswer("");
    setSuccess(false);
    setShake(false);
  };

  return (
    <>
      {/* ZRC Logo Button */}
      <button
        onClick={openDialog}
        className="group"
        aria-label="ZRC"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/zrc_logo.png"
          alt="ZRC"
          className="w-32 h-32 rounded-full object-cover shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all duration-300"
        />
      </button>

      {/* Dialog */}
      {showDialog && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDialog(false);
          }}
        >
          <div
            className={`bg-bg-primary rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-slide-reveal ${shake ? "animate-shake" : ""}`}
          >
            {/* Header with decorative gradient */}
            <div className="relative h-28 bg-gradient-to-br from-accent/20 via-accent-light/30 to-bg-tertiary overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/zrc_logo.png"
                  alt="ZRC"
                  className="w-14 h-14 rounded-full object-cover shadow-lg"
                />
              </div>
              <div className="absolute top-4 right-6 w-2 h-2 rounded-full bg-accent/30" />
              <div className="absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-accent/20" />
              <div className="absolute bottom-6 left-8 w-1.5 h-1.5 rounded-full bg-accent/25" />
            </div>

            <div className="p-8 pt-6">
              <h3 className="text-center text-lg font-light text-text-primary mb-1">
                珠海文学读书会
              </h3>
              <p className="text-center text-xs text-text-muted font-mono mb-6">
                Zhuhai Reading Club
              </p>

              {success ? (
                <div className="text-center py-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-success"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-text-primary font-light">
                    欢迎回来，文学知己
                  </p>
                  <p className="text-xs text-text-muted mt-1">正在进入...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-text-secondary text-center leading-relaxed mb-6">
                      请回答：
                      <span className="block text-text-primary font-light text-base mt-2">
                        ZRC 最懂文学的人是谁？
                      </span>
                    </p>
                    <input
                      ref={inputRef}
                      type="text"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                      }}
                      placeholder="输入答案..."
                      className="w-full rounded-xl border border-border-light bg-bg-secondary text-text-primary text-sm px-4 py-3 text-left focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all placeholder:text-text-muted"
                    />
                    {shake && (
                      <p className="text-xs text-error text-center mt-2 animate-fade-in">
                        不对哦，再想想？
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDialog(false)}
                      className="flex-1 text-sm py-2.5 rounded-xl border border-border-light text-text-secondary hover:text-text-primary transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 text-sm py-2.5 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors"
                    >
                      确认
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
