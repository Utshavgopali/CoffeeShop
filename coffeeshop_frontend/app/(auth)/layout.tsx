import Logo from "@/app/_components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-roast-950">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--color-roast-800) 0%, transparent 45%), radial-gradient(circle at 80% 70%, var(--color-roast-800) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Logo className="mb-8" />
        {children}
      </div>
    </div>
  );
}