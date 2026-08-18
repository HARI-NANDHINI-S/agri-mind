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

const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone_number: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, data);
      const { access_token, refresh_token } = res.data.data;
      await login(access_token, refresh_token);
      toast("success", "Account Created", "Your AgriMind account has been registered successfully.");
      navigate("/dashboard");
    } catch (err: any) {
      toast("error", "Registration Failed", err.response?.data?.detail || "Something went wrong");
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
          <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Create an Account</h2>
          <p className="text-xs text-neutral-500 font-medium mt-1">Sign up to begin mapping and managing crops</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="full_name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.full_name?.message}
            {...register("full_name")}
          />

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="farmer@example.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="phone_number"
            label="Phone Number (Optional)"
            type="text"
            placeholder="+1 (555) 000-0000"
            error={errors.phone_number?.message}
            {...register("phone_number")}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button type="submit" loading={loading} className="w-full mt-2">
            Register Account
          </Button>
        </form>

        <p className="text-center text-xs text-neutral-500 font-medium mt-6">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="font-semibold text-primary-700 hover:text-primary-800">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
