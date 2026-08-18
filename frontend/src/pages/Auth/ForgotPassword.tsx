import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { Leaf } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200/80 p-8 rounded-xl shadow-sm text-center">
        <div className="flex flex-col items-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary-700 flex items-center justify-center text-white mb-3 shadow-md shadow-primary-950/20">
            <Leaf className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-800 tracking-tight">Reset Password</h2>
          <p className="text-xs text-neutral-500 font-medium mt-1">Forgot-password strategy instructions</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-xs text-neutral-600 font-medium text-left leading-relaxed mb-6">
          <p className="font-semibold text-neutral-800 mb-2">Forgot Password Architecture:</p>
          As a stateless JWT configuration, password recoveries generate a short-expiry token mailed out internally. 
          To complete your reset or configure standard SMTP integrations, please refer to Developer 2's Admin Dashboard SMTP management module.
        </div>

        <Button onClick={() => navigate("/login")} className="w-full">
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
