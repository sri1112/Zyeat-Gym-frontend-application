import React, { useState } from "react";
import Onboarding from "./Onboarding";
import LoginModal from "./LoginModal";
import OtpModal from "./OtpModal";

export default function OnboardingHome() {
  const [showLogin, setShowLogin] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [mobile, setMobile] = useState(""); 

  return (
    <div className="min-h-screen flex items-end justify-center bg-gray-50 font-sans">
      <div className="w-full h-screen bg-white shadow-2xl flex flex-col items-center">
        <Onboarding onLoginClick={() => setShowLogin(true)} />
      </div>

      {(showLogin || showOtp) && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            setShowLogin(false);
            setShowOtp(false);
          }}
        />
      )}

      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onContinue={(enteredMobile) => {
          setMobile(enteredMobile);
          setShowLogin(false);
          setShowOtp(true);
        }}
      />

      <OtpModal
        show={showOtp}
        onClose={() => setShowOtp(false)}
        mobile={mobile}
      />
    </div>
  );
}
