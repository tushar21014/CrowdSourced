"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Building2, User, Globe } from "lucide-react";

import { motion } from "framer-motion";

import React from "react";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";
import GlassmorphicCard from "../components/GlassmorphicCard";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RegistrationPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  //   const router = useRouter()

  const handleRoleSelection = (role) => {
    console.log(`Selected role: ${role}`);
    setSelectedRole(role);
    setError(null);
  };

  const handleLoginCompany = async(address) => {
    try {
      toast.success("Company Logged in");
      const response = await fetch("http://localhost:4000/Routes/company/login", {
        method:"post",
        headers:{
          'content-type': "application/json"
        },
        body: JSON.stringify({address: address})
      })

      const data = await response.json();
      console.log(data)
      if(response.status == 200)
      {
        localStorage.setItem("authToken", data.token)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleLoginVoter = async(address) => {
    try {

      const response = await fetch("http://localhost:4000/Routes/auth/login", {
        method:"post",
        headers:{
          'content-type': "application/json"
        },
        body: JSON.stringify({address: address})
      })

      const data = await response.json();
      console.log(data)
      if(response.status == 200)
      {
        localStorage.setItem("authToken", data.token)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleMetaMaskLogin = async () => {
    if (!selectedRole) {
      setError("Please select a role before proceeding.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          // Here you would typically send the account address and selected role to your backend
          console.log(
            `Logged in with address: ${accounts[0]} as ${selectedRole}`
          );

          localStorage.setItem("walletaddress", accounts[0]);


          if(selectedRole === 'company'){
            await handleLoginCompany(accounts[0]);
          } else {
            await handleLoginVoter(accounts[0]);
          }

          // Redirect to the appropriate dashboard
          localStorage.setItem("accountType", selectedRole);
          
            nav(selectedRole === 'company' ? '/company/dashboard' : '/voter/dashboard')
        } else {
          setError(
            "No accounts found. Please make sure you are connected to MetaMask."
          );
        }
      } else {
        setError("MetaMask is not installed. Please install it to continue.");
      }
    } catch (err) {
      setError(
        "An error occurred while connecting to MetaMask. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundGradientAnimation>
      <div className="h-screen w-full absolute z-50  text-white flex flex-col items-center justify-center p-4">
        <motion.h1
          className="text-5xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Join
          <span className="animated-gradient font-bold bg-clip-text text-transparent ">
            {" "}
            CrowdSourced
          </span>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * 3 }}
            viewport={{ once: true }}
            className="h-[200px] w-[300px] md:w-[400px] md:h-[300px]"
            onClick={() => handleRoleSelection("company")}
          >
            <GlassmorphicCard
              className={`h-full group hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                selectedRole === "company" ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Building2 className="mr-2 h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  I'm a Company
                </CardTitle>
              </CardHeader>
              <CardContent className="text-lg">
                Post surveys, get insights, and contribute to the reward vault
              </CardContent>
            </GlassmorphicCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * 3 }}
            viewport={{ once: true }}
            className="h-[200px] w-[300px] md:w-[400px] md:h-[300px]"
            onClick={() => handleRoleSelection("voter")}
          >
            <GlassmorphicCard
              className={`h-full group hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                selectedRole === "voter" ? "ring-2 ring-purple-500" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <User className="mr-2 h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                  I'm a Voter
                </CardTitle>
              </CardHeader>
              <CardContent className="text-lg">
                Answer surveys, earn rewards, and make your voice heard
              </CardContent>
            </GlassmorphicCard>
          </motion.div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Button
          className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4"
          onClick={handleMetaMaskLogin}
          disabled={isLoading || !selectedRole}
        >
          {isLoading ? "Connecting..." : "Connect with MetaMask"}
        </Button>

        <p className="mt-8 text-gray-400 text-center">
          By connecting, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}
