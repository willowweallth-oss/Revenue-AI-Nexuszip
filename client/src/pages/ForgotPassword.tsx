import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

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

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success",
        description: "If an account exists for that email, we've sent a reset link.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md rounded-2xl border-[#3b82f6]/50 shadow-2xl bg-black text-white">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3b82f6] text-white shadow-lg">
              <Command className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">Reset Your Password</CardTitle>
          <CardDescription className="text-[#94a3b8]">
            Enter your email to receive a reset link.
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
            <Button type="submit" className="w-full rounded-xl bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white font-semibold h-11" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/login">
              <a className="text-sm text-[#3b82f6] hover:underline inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
