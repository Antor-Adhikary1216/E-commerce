import type { Config } from "tailwindcss";
export default { darkMode: ["class"], content: ["./src/**/*.{ts,tsx}"], theme: { extend: { colors: { background: "hsl(var(--background))", foreground: "hsl(var(--foreground))", primary: "hsl(var(--primary))", muted: "hsl(var(--muted))" }, borderRadius: { xl: "1rem" } } }, plugins: [] } satisfies Config;
