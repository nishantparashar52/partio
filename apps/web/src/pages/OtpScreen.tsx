import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export default function OtpScreen() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const verifyOtpMutation = useMutation({
    mutationFn: () => api.verifyOtp({ phone: state.phone, otp }),
    onSuccess: () => {
      navigate("/home");
    },
    onError: () => {
      alert("Invalid OTP");
    }
  });

  return (
    <div className="card p-6 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
      <Input
        label="OTP"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 1111"
      />
      <Button onClick={() => verifyOtpMutation.mutate()} className="mt-4">
        Verify
      </Button>
    </div>
  );
}