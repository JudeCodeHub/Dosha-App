import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthInput } from "./AuthInput";
import { Loader2 } from "lucide-react";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const authUrl = import.meta.env.VITE_AUTH_SERVICE_URL || "http://127.0.0.1:8003";
        const response = await fetch(`${authUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrors({ submit: errorData.detail || "Login failed" });
          return;
        }

        const data = await response.json();
        
        // Save auth data to localStorage as requested
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("userId", String(data.user_id));
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("marinzen_auth", "true");

        if (data.dosha) {
          localStorage.setItem("marinZenUserDosha", data.dosha);
          navigate("/dashboard");
        } else {
          // Ensure we don't have leftover stale dosha if backend says null
          localStorage.removeItem("marinZenUserDosha");
          navigate("/discover");
        }

      } catch (error) {
        console.error("Login request failed:", error);
        setErrors({ submit: "A network error occurred. Please try again." });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center">
      {errors.submit && (
        <div className="w-full mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm text-center">
          {errors.submit}
        </div>
      )}
      <AuthInput
        label="Email Address"
        id="email"
        type="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <AuthInput
        label="Password"
        id="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <div className="w-full flex justify-end mb-6">
        <button type="button" className="text-sm text-amber-500 hover:text-amber-400">
          Forgot password?
        </button>
      </div>
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full py-6 text-md font-semibold shadow-md shadow-orange-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Logging in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
