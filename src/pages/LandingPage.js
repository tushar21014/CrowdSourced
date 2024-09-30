"use client";
import { Button } from "../ui/Button";
import React, { Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

import GlassmorphicCard from "../components/GlassmorphicCard";
import { GlobeDemo } from "../components/GlobeDemo";
import ParallaxSection from "../components/ParallaxSection";
import AnimatedCounter from "../components/AnimatedCounter";

import {
  ArrowRight,
  BarChart2,
  Globe,
  DollarSign,
  Lock,
  Zap,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";


export default function LandingPage() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  const [isVideoLoaded2, setIsVideoLoaded2] = useState(false);
  const videoRef2 = useRef(null);
  const { scrollYProgress } = useScroll();

  const ifScrollUp = useTransform(scrollYProgress, (value) => {
    // If current is less than last, then we are scrolling up
    console.log(value, scrollYProgress.getPrevious());
    console.log(value < scrollYProgress.getPrevious());
    return value < scrollYProgress.getPrevious();
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <div className="min-h-screen bg-black/90 text-white overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-500 z-50"
        style={{ scaleX }}
      />

      {/* Hero Section with Video Background */}
      {/* Header */}

      <header
        className={
          "container backdrop-blur-sm  mx-auto px-4 py-6 flex justify-between items-center top-0 z-20 absolute"
        }
      >
        <motion.h1
          className="text-3xl popping-font font-semibold bg-clip-text  text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}

          style={{
            letterSpacing: "1px",
          }}
        >
          Crowdsourced
        </motion.h1>
        <nav>
          {/* <Button
            variant="ghost"
            className="text-white mr-4 bg-[#7047eb] hover:bg-[#7047eb]/80 hover:text-white transition-colors"
          >
            Login
          </Button> */}
          <Link to='/register'>
          <Button 
          variant="ghost"
          className="hover:bg-[#8a46ff]/80 bg-[#8a46ff] hover:text-white transition-colors"
          >
            Sign In
          </Button>
          </Link>
        </nav>
      </header>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <motion.div style={{ opacity }} className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`object-fill lg:scale-x-75  lg:scale-y-[1.25]  scale-y-90 w-full h-full transition-opacity duration-1000 ${
              isVideoLoaded ? "opacity-65" : "opacity-0"
            }`}
          >
            {/* <source src="/assets/zkevm720p.mp4" type="video/mp4" /> */}
            <source src="/assets/zkevm720p.mp4" type="video/mp4" />
          </video>
        </motion.div>
        <div className="container mx-auto px-4 text-center relative z-10 bg-transparent">
          <motion.h2
            className="popping-font animated-gradientV2 text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-500 to-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3  }}
            
          >
            Unlock the Power of the Crowd
          </motion.h2>
          <motion.p
            className="popping-font text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Gather Real-Time Data and Insights Through Our Global Network of
            Contributors
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button className="bg-purple-600 hover:bg-purple-700 text-xl font-semibold px-10 py-8 group transition-all duration-300 transform hover:scale-105">
              {/* Get Insights (For Companies) */}
              <Link to='/register'>
              Get Started
              </Link>
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            {/* <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 group transition-all duration-300 transform hover:scale-105">
              Earn Rewards (For Voters)
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button> */}
          </motion.div>
        </div>
      </section>

      {/* What is Crowdsourced? */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br bg-black/80" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Connecting Companies with a Global Network of Voters
          </motion.h2>
          <motion.p
            className="text-xl mb-12 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Crowdsourced is a platform that facilitates the collection of
            opinions, feedback, and responses on a large scale. Companies post
            tasks, and individuals (Voters) complete them to earn cryptocurrency
            rewards.
          </motion.p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Diverse Tasks",
                content:
                  "Engage with a wide variety of projects and contribute your unique perspective.",
              },
              {
                icon: DollarSign,
                title: "Cryptocurrency Rewards",
                content:
                  "Earn digital currency for your valuable input and time spent on tasks.",
              },
              {
                icon: Zap,
                title: "Powered by Polygon",
                content:
                  "Benefit from fast, secure, and low-cost transactions on a scalable blockchain network.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                viewport={{ once: true }}
              >
                <GlassmorphicCard className="h-full group hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <item.icon className="mr-2 h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-lg">{item.content}</CardContent>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 relative overflow-hidden" id="HowItWorks">
        <div className="absolute inset-0 bg-gradient-to-tl from-black/20 to-gray-950/20" />
        <div className="container mx-auto px-4 relative z-10 popping-font">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How it Works
          </motion.h2>
          <Tabs defaultValue="companies" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full h-full grid-cols-2 mb-8">
              <TabsTrigger value="companies" className="text-lg py-2">
                For Companies
              </TabsTrigger>
              <TabsTrigger value="voters" className="text-lg py-2">
                For Voters
              </TabsTrigger>
            </TabsList>
            <TabsContent value="companies">
              <GlassmorphicCard>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Get the Data You Need to Make Informed Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-4 mb-6 text-lg">
                    {[
                      "Post a Task",
                      "Fund Your Project",
                      "Access a Global Network of Voters",
                      "Gather Valuable Insights",
                    ].map((step, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        viewport={{ once: true }}
                      >
                        {step}
                      </motion.li>
                    ))}
                  </ol>
                  <h4 className="font-semibold mb-2 text-xl">Benefits:</h4>
                  <ul className="list-disc list-inside space-y-2 text-lg">
                    {[
                      "Train AI models with diverse datasets",
                      "Get real-time product feedback",
                      "Conduct large-scale market research",
                      "Make data-driven decisions",
                    ].map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * (index + 4) }}
                        viewport={{ once: true }}
                      >
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </GlassmorphicCard>
            </TabsContent>
            <TabsContent value="voters">
              <GlassmorphicCard>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Earn Cryptocurrency by Sharing Your Opinions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-4 mb-6 text-lg">
                    {[
                      "Browse and Select Tasks",
                      "Complete Tasks and Provide Your Input",
                      "Earn Cryptocurrency Rewards",
                    ].map((step, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        viewport={{ once: true }}
                      >
                        {step}
                      </motion.li>
                    ))}
                  </ol>
                  <h4 className="font-semibold mb-2 text-xl">Benefits:</h4>
                  <ul className="list-disc list-inside space-y-2 text-lg">
                    {[
                      "Earn money for your time and insights",
                      "Engage in interesting and varied tasks",
                      "Be part of a global community of contributors",
                    ].map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * (index + 3) }}
                        viewport={{ once: true }}
                      >
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </GlassmorphicCard>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br bg-black" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-4xl  font-bold z-20 mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0.75, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Use Cases
          </motion.h2>
          {/* Two top and one middle */}
          <div className=" gap-8">
            <motion.div  className="absolute inset-0 flex justify-center items-center">
              <video
                ref={videoRef2}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setIsVideoLoaded2(true)}
                className={`object-fill w-[80%] h-[80%] scale-x-75 transition-opacity duration-1000 ${
                  isVideoLoaded2 ? "opacity-65" : "opacity-0"
                }`}
              >
                {/* <source src="/assets/zkevm720p.mp4" type="video/mp4" /> */}
                <source src="/assets/video2.mp4" type="video/mp4" />
              </video>
            </motion.div>
            <div className="flex flex-col gap-16 justify-center items-center">
              <div className="grid md:grid-cols-2 gap-16">
                {[
                  {
                    icon: BarChart2,
                    title: "Training AI Models",
                    content:
                      "Leverage diverse datasets to improve machine learning algorithms and AI performance.",
                  },
                  {
                    icon: DollarSign,
                    title: "Product Feedback",
                    content:
                      "Gather real-time insights from a global audience to refine and improve your products.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                    viewport={{ once: true }}
                    className="h-[200px] w-[300px] md:w-[400px] md:h-[300px]"
                  >
                    <GlassmorphicCard className="h-full group hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                      <CardHeader>
                        <CardTitle className="flex items-center text-2xl">
                          <item.icon className="mr-2 h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-lg">
                        {item.content}
                      </CardContent>
                    </GlassmorphicCard>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * 3 }}
                viewport={{ once: true }}
                className="h-[200px] w-[300px] md:w-[400px] md:h-[300px]"
              >
                <GlassmorphicCard className="h-full group hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <Globe className="mr-2 h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                      Market Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-lg">
                    Conduct large-scale surveys and studies to understand market
                    trends and consumer behavior.
                  </CardContent>
                </GlassmorphicCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology and Trust */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl bg-black" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Built on Security and Transparency
          </motion.h2>

          <div className="flex  gap-8">

          <motion.div  className="flex w-[40%] justify-center items-center">
              <video
                ref={videoRef2}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setIsVideoLoaded2(true)}
                className={`object-fill transition-opacity duration-1000 ${
                  isVideoLoaded2 ? "opacity-65" : "opacity-0"
                }`}
              >
                {/* <source src="/assets/zkevm720p.mp4" type="video/mp4" /> */}
                <source src="/assets/video3.mp4" type="video/mp4" />
              </video>
            </motion.div>

          <div className="w-[60%] grid md:grid-rows-2 gap-8">
            {[
              {
                icon: Zap,
                title: "Polygon Technology",
                content: [
                  "Fast, low-cost, and secure transactions",
                  "Scalability for growing demand",
                  "Interoperability with Ethereum for enhanced credibility and reach",
                ],
              },
              {
                icon: Lock,
                title: "Secure Payment System",
                content: [
                  "Worker pre-payment ensures rewards are secured and tasks are legitimate, providing trust and reliability for all participants.",
                  "Smart contracts ensure transparency and automate payments.",
                  "Decentralized platform ensures data privacy and security.",
                ],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                viewport={{ once: true }}
              >
                <GlassmorphicCard className="h-full group hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl">
                      <item.icon className="mr-2 h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-lg">
                      {item.content.map((text, i) => (
                        <li key={i}>{text}</li>
                      ))}
                    </ul>
                  </CardContent>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <ParallaxSection>
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br bg-black/80" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.h2
              className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Our Impact
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ">
              {[
                { label: "Active Users", value: "50,000+" },
                { label: "Tasks Completed", value: "1,000,000+" },
                { label: "Companies Served", value: "500+" },
                { label: "Tokens Distributed", value: "10,000,000+" },
              ].map((stat, index) => (
                <GlassmorphicCard key={index} className="text-center">
                  <CardContent>
                    <h3 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                      <AnimatedCounter value={stat.value.replace(/\D/g, "")} />
                      {stat.value.includes("+") ? "+" : ""}
                    </h3>
                    <p className="text-lg">{stat.label}</p>
                  </CardContent>
                </GlassmorphicCard>
              ))}
            </div>
          </div>

          <GlobeDemo />
        </section>
      </ParallaxSection>

      {/* Footer */}
      <footer className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br bg-black/80" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
                Crowdsourced
              </h3>
              <p className="text-gray-400">
                Connecting companies with global insights
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-purple-600 hover:bg-purple-700 group transition-all duration-300 transform hover:scale-105">
                Get Started as a Company
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 group transition-all duration-300 transform hover:scale-105">
                Join as a Voter
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center space-x-4 text-gray-400">
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              About Us
            </a>
            <a
              onClick={() =>
                document
                  .getElementById("HowItWorks")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-white cursor-pointer transition-colors duration-200"
            >
              How It Works
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              FAQs
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
