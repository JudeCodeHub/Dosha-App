import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthInput } from "./AuthInput";
import { Loader2 } from "lucide-react";

export const SignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const authUrl = import.meta.env.VITE_AUTH_SERVICE_URL || "http://127.0.0.1:8003";
        const response = await fetch(`${authUrl}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrors({ submit: errorData.detail || "Signup failed" });
          return;
        }

        // Successfully created user context on Database
        const data = await response.json();

        // Clear any stale quiz state from previous attempts or other users
        localStorage.removeItem("prakritiQuizState");

        // Auto-login to preserve the token in Dashboard routes
        try {
          const authUrl = import.meta.env.VITE_AUTH_SERVICE_URL || "http://127.0.0.1:8003";
          const loginRes = await fetch(`${authUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email, password: formData.password })
          });
          if (loginRes.ok) {
            const loginData = await loginRes.json();
            localStorage.setItem("token", loginData.access_token);
          }
        } catch (err) {
          console.error("Auto-login failed:", err);
        }
        
        // Push user directly into Dashboard discovery flow
        localStorage.setItem("marinzen_auth", "true");
        // Also log them in so patches work via headers implicitly
        localStorage.setItem("userId", String(data.user_id));
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
        
        navigate("/discover");
      } catch (error) {
        console.error("Signup request failed:", error);
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
        label="Full Name"
        id="name"
        type="text"
        placeholder="Jane Doe"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
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
        placeholder="Create a password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <AuthInput
        label="Confirm Password"
        id="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full mt-4 bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-full py-6 text-md font-semibold shadow-md shadow-orange-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Signing up...
          </>
        ) : (
          "Sign Up"
        )}
      </Button>
    </form>
  );
};

export default SignupForm;
