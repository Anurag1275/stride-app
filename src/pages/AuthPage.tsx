import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { BookOpen, Loader2, Phone, Mail } from "lucide-react";
import sankalpLogo from "@/assets/sankalp-logo.png";

// Inline brand SVGs (no extra deps, theme-tolerant)
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.31 0-6-2.74-6-6.2s2.69-6.2 6-6.2c1.88 0 3.14.8 3.86 1.49l2.63-2.54C16.96 3.13 14.7 2.2 12 2.2 6.92 2.2 2.8 6.32 2.8 11.4S6.92 20.6 12 20.6c6.93 0 9.2-4.85 9.2-7.34 0-.5-.05-.88-.12-1.26H12z"
    />
  </svg>
);

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else {
        toast.success("Welcome back!");
        navigate("/");
      }
    } else {
      if (!displayName.trim()) {
        toast.error("Please enter your name");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, displayName.trim());
      if (error) toast.error(error.message);
      else toast.success("Account created! Check your email to verify.");
    }
    setLoading(false);
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setOauthLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as "google" | "apple",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error(error.message || `Couldn't sign in with ${provider}`);
        setOauthLoading(null);
      }
    } catch (err: any) {
      toast.error(err?.message || `Couldn't sign in with ${provider}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-pulse" />

      <div className="w-full max-w-md space-y-6 relative animate-fade-in-up">
        <div className="text-center space-y-3">
          <img
            src={sankalpLogo}
            alt="Sankalp Logo"
            className="mx-auto h-20 w-20 object-contain transition-transform hover:scale-105"
          />
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#B5541C", lineHeight: "1.1" }}
            >
              Sankalp
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your AI-powered exam prep companion
            </p>
          </div>
        </div>

        <Card className="shadow-xl shadow-black/10 border-border/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {mode === "login" ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Sign in to continue your preparation"
                : "Start your exam prep journey"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social auth */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading || loading}
              className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <GoogleIcon /> Google
                </>
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Tabs
              value={mode}
              onValueChange={(v) => setMode(v as "login" | "signup")}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login" className="transition-all">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="transition-all">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Email/password form */}
              <TabsContent value={mode} className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-3 animate-fade-in">
                  {mode === "signup" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="transition-all focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading || !!oauthLoading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : mode === "login" ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Phone OTP placeholder (Twilio not configured yet) */}
            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs text-muted-foreground transition-colors hover:text-foreground"
              onClick={() =>
                toast.info(
                  "Phone OTP login coming soon — SMS provider not configured yet."
                )
              }
            >
              <Phone className="h-3.5 w-3.5 mr-1.5" /> Continue with mobile OTP (soon)
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          <BookOpen className="h-3 w-3" /> Focused exam preparation for B.Tech CSE
        </p>
      </div>
    </div>
  );
}
