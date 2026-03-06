import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import logoImg from "@assets/svg_1772778640623.PNG";

const FloatingInput = ({ id, label, type, value, onChange, required }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative mt-2">
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className="h-12 bg-black border-[#3b82f6] text-white rounded-xl pt-4 pb-1 peer focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
      />
      <Label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 pointer-events-none
          ${(isFocused || hasValue)
            ? "-top-2 left-2 bg-black px-1 text-[10px] text-[#3b82f6]"
            : "top-3.5 text-sm text-[#94a3b8]"}`}
      >
        {label}
      </Label>
    </div>
  );
};

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "Error", description: data.message, variant: "destructive" });
        return;
      }

      setLocation("/");
      window.location.href = "/";
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md rounded-2xl border-[#3b82f6]/50 shadow-2xl bg-black text-white">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-6">
            <img src={logoImg} alt="Flowtari Logo" className="h-24 w-24 object-contain" />
          </div>
          <CardTitle className="text-3xl font-bold italic bg-clip-text text-transparent bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400">
            Welcome to Flowtari
          </CardTitle>
          <CardDescription className="text-[#94a3b8]">
            manage your revenue operations and AI insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FloatingInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-1">
              <FloatingInput
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
              />
              {mode === "login" && (
                <div className="flex justify-end">
                  <Link href="/forgot-password">
                    <a className="text-xs text-[#3b82f6] hover:underline">Forgot password?</a>
                  </Link>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full rounded-xl bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white font-semibold h-11" disabled={isLoading}>
              {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-[#94a3b8]">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-[#3b82f6] font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[#3b82f6] font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
