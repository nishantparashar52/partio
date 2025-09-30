import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export default function PhoneNumberScreen() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const sendOtpMutation = useMutation({
    mutationFn: () => api.sendPhoneOtp({ phone }),
    onSuccess: () => {
      navigate("/verify", { state: { phone } });
    },
    onError: () => {
      alert("Failed to send OTP. Please try again.");
    }
  });

  return (
    <div className="card p-6 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Enter your phone number</h2>
      <Input
        label="Phone Number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="e.g. +91 9876543210"
      />
      <Button
        onClick={() => sendOtpMutation.mutate()}
        className="mt-4"
        disabled={sendOtpMutation.isPending}
      >
        {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
      </Button>
    </div>
  );
}