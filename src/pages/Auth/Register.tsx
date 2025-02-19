import axios from "axios";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "@/schema/authSchema";

const Register = () => {
  const navigate = useNavigate();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const {
    formState: { isSubmitting },
  } = registerForm;

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/local/register`,
        values
      );

      console.log(response);

      localStorage.setItem("jwt", response.data.jwt);
      localStorage.setItem("user_id", response.data.user.documentId);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("email", response.data.user.email);

      toast("Login Success");
      navigate(-1);
    } catch (e) {
      console.log(e);
      toast(
        e.response?.data?.error?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(handleRegister)}
        className="space-y-8 w-2/3 lg:w-1/3 h-screen m-auto pt-[12vh]"
      >
        <h1 className="font-semibold text-2xl">Register</h1>

        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4 justify-start">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Register"}
          </Button>{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-slate-500 text-sm"
          >
            Login?
          </button>
        </div>
      </form>

      <Toaster />
    </Form>
  );
};

export default Register;
