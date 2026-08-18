import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import client from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { User, ShieldAlert } from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone_number: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
    },
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileForm) => {
    setProfileLoading(true);
    try {
      const res = await client.put("/users/profile", data);
      updateUser(res.data.data);
      toast("success", "Profile Updated", "Your profile details have been saved.");
    } catch (err: any) {
      toast("error", "Update Failed", err.response?.data?.detail || "Could not update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPasswordLoading(true);
    try {
      await client.put("/users/password", data);
      toast("success", "Password Changed", "Your password has been changed successfully.");
      resetPassword();
    } catch (err: any) {
      toast("error", "Action Failed", err.response?.data?.detail || "Current password may be incorrect");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">User Profile</h1>
        <p className="text-sm text-neutral-500 font-medium mt-1">Manage profile attributes and security configurations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card title="Farmer Details" className="lg:col-span-2">
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 border border-primary-200">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 text-base">{user?.full_name}</h3>
                <p className="text-[10px] text-neutral-500 font-semibold">{user?.email}</p>
              </div>
            </div>

            <Input id="prof-name" label="Full Name" error={profileErrors.full_name?.message} {...registerProfile("full_name")} />
            <Input id="prof-phone" label="Phone Number" error={profileErrors.phone_number?.message} {...registerProfile("phone_number")} />

            <Button type="submit" loading={profileLoading}>
              Save Profile Details
            </Button>
          </form>
        </Card>

        {/* Password Card */}
        <Card title="Security Credentials" className="lg:col-span-1">
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <Input id="sec-curr" label="Current Password" type="password" error={passwordErrors.current_password?.message} {...registerPassword("current_password")} />
            <Input id="sec-new" label="New Password" type="password" error={passwordErrors.new_password?.message} {...registerPassword("new_password")} />

            <Button type="submit" variant="danger" loading={passwordLoading} className="w-full flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> Change Password
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
