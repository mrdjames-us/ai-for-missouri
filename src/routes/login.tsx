import { useState, type FormEvent } from "react";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Staff desk — AI for Missouri" }],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isPending && user) {
    return <Navigate to="/admin" />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Staff",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message);
      }
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <div className="border-b border-border">
        <SiteHeader />
      </div>
      <main id="main" className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="grid w-full max-w-3xl overflow-hidden rounded-2xl bg-card shadow-card md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="bg-forest-deep px-8 py-10 text-paper">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-paper/55">
              Staff desk
            </p>
            <h1 className="mt-4 font-display text-3xl tracking-tight">
              Sign in with the email David added.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-paper/75">
              Editors change gatherings and pages. Owners add more staff. The
              public site stays public — this door is only for people on the
              list.
            </p>
            <p className="mt-8 text-xs leading-relaxed text-paper/55">
              First time? Create an account with that same email. Google or X
              also work, if that account uses the listed address.
            </p>
          </div>

          <div className="p-8">
            {!authEnabled ? (
              <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
            ) : (
              <>
                <form className="space-y-4" onSubmit={onSubmit}>
                  {mode === "up" ? (
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Your name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "up" ? "new-password" : "current-password"}
                    />
                  </div>
                  {error ? (
                    <p className="text-sm text-brick" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy
                      ? "One moment…"
                      : mode === "up"
                        ? "Create account"
                        : "Sign in"}
                  </Button>
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {mode === "in" ? (
                    <button
                      type="button"
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                      onClick={() => setMode("up")}
                    >
                      Invited? Create an account
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                      onClick={() => setMode("in")}
                    >
                      Already have an account? Sign in
                    </button>
                  )}
                </p>

                <div className="mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="mt-5 space-y-2">
                  {GROK_PROVIDERS.map((provider) => (
                    <Button
                      key={provider.providerId}
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        void signIn(provider.providerId, { callbackURL: "/admin" })
                      }
                    >
                      Continue with {provider.label}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
