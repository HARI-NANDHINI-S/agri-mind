import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { API_URL } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Leaf } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, data);
      const { access_token, refresh_token } = res.data.data;
      await login(access_token, refresh_token);
      toast("success", "Logged in successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast("error", "Login Failed", err.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200/80 p-8 rounded-xl shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary-700 flex items-center justify-center text-white mb-3 shadow-md shadow-primary-950/20">
            <Leaf className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Sign In to AgriMind</h2>
          <p className="text-xs text-neutral-500 font-medium mt-1">Enter your details to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="farmer@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 font-medium text-neutral-600 cursor-pointer">
              <input type="checkbox" className="rounded border-neutral-300 text-primary-700 focus:ring-primary-600" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="font-semibold text-primary-700 hover:text-primary-800"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-500 font-medium mt-6">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="font-semibold text-primary-700 hover:text-primary-800">
            Register now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
