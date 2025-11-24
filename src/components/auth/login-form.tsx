"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

// Компонент для работы с параметрами URL
function LoginFormWithSearchParams() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Проверяем, пришел ли пользователь после успешной регистрации
    const registered = searchParams.get("registered");
    if (registered === "true") {
      setSuccessMessage("Registration successful! You can now sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация формы
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }
      
      // Перенаправление на главную страницу
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Sign In</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe} 
            onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
          />
          <Label htmlFor="remember" className="text-sm">
            Remember me for 1 year
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      
      <div className="mt-8 text-xs text-gray-500">
        <p>
          By signing in, you agree to store cookies for 1 year to ensure convenient use of the service.
        </p>
      </div>
    </div>
  );
}

// Компонент-обертка с Suspense
export function LoginForm() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm"><p className="text-center">Loading login form...</p></div>}>
      <LoginFormWithSearchParams />
    </Suspense>
  );
} 