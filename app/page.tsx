"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import {
	ChevronRight,
	Code,
	Globe,
	Layers,
	Lock,
	MessageCircle,
	Moon,
	Star,
	Sun,
	Users,
} from "lucide-react";
import Image from "next/image";
// import type { Metadata } from "next";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// export const metadata: Metadata = {
// 	title: "Messenger - Modern Chat Platform",
// 	description: "A modern messaging platform UI",
// };

const testimonials = [
	{
		name: "Sarah Johnson",
		title: "Product Manager at TechCorp",
		message:
			"This messaging platform transformed our team's collaboration. The seamless UI and enterprise features give us everything we need.",
		avatar: "https://i.pravatar.cc/100?img=1",
	},
	{
		name: "Michael Chen",
		title: "Engineering Lead",
		message:
			"Best communication tool we've implemented. The real-time features and API integrations saved us countless development hours.",
		avatar: "https://i.pravatar.cc/100?img=2",
	},
	{
		name: "Alex Rodriguez",
		title: "CTO at StartupHQ",
		message:
			"The enterprise-grade security combined with an intuitive interface made this an easy choice for our growing team.",
		avatar: "https://i.pravatar.cc/100?img=3",
	},
	{
		name: "Emily Wang",
		title: "Director of Product Design",
		message:
			"The customization options and thoughtful UI details show that this platform truly understands enterprise communication needs.",
		avatar: "https://i.pravatar.cc/100?img=4",
	},
	{
		name: "Jamal Brooks",
		title: "VP of Customer Success",
		message:
			"Our clients love the seamless experience. The analytics and team management features made adoption a breeze across departments.",
		avatar: "https://i.pravatar.cc/100?img=5",
	},
];

const features = [
	{
		title: "Enterprise-Grade Security",
		description:
			"End-to-end encryption and compliance with global security standards keep your communications safe.",
		icon: <Lock className="h-6 w-6 text-white" />,
		color: "bg-indigo-600",
		borderColor: "border-indigo-500/20 group-hover:border-indigo-500/50",
	},
	{
		title: "Team Collaboration",
		description:
			"Purpose-built tools for enterprise teams to communicate, share, and track projects effectively.",
		icon: <Users className="h-6 w-6 text-white" />,
		color: "bg-blue-600",
		borderColor: "border-blue-500/20 group-hover:border-blue-500/50",
	},
	{
		title: "Global Accessibility",
		description:
			"Connect your teams across the world with multi-language support and low-latency global infrastructure.",
		icon: <Globe className="h-6 w-6 text-white" />,
		color: "bg-purple-600",
		borderColor: "border-purple-500/20 group-hover:border-purple-500/50",
	},
	{
		title: "Developer API",
		description:
			"Extensible platform with comprehensive API access for custom integrations and workflows.",
		icon: <Code className="h-6 w-6 text-white" />,
		color: "bg-emerald-600",
		borderColor: "border-emerald-500/20 group-hover:border-emerald-500/50",
	},
	{
		title: "Scalable Architecture",
		description:
			"Built to grow with your organization from startup to enterprise with no compromises.",
		icon: <Layers className="h-6 w-6 text-white" />,
		color: "bg-amber-600",
		borderColor: "border-amber-500/20 group-hover:border-amber-500/50",
	},
	{
		title: "Premium Experience",
		description:
			"Polished UI/UX designed for power users and executives alike with no learning curve.",
		icon: <Star className="h-6 w-6 text-white" />,
		color: "bg-rose-600",
		borderColor: "border-rose-500/20 group-hover:border-rose-500/50",
	},
];

// Shimmer animation for shine effect
const shimmer = (w: number, h: number) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#6366f1" offset="20%" />
        <stop stop-color="#8b5cf6" offset="50%" />
        <stop stop-color="#6366f1" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#6366f1" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.5s" repeatCount="indefinite"  />
  </svg>`;

const toBase64 = (str: string) =>
	typeof window === "undefined"
		? Buffer.from(str).toString("base64")
		: window.btoa(str);

export default function Home() {
	const featuresRef = useRef<HTMLDivElement>(null);
	const [theme, setTheme] = useState<string>("light");
	const [scrolled, setScrolled] = useState(false);

	const { scrollYProgress } = useScroll({
		target: featuresRef,
		offset: ["start end", "end start"],
	});

	const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
	const y = useTransform(scrollYProgress, [0, 0.5], [50, 0]);

	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		if (savedTheme) {
			setTheme(savedTheme);
			document.documentElement.classList.add(savedTheme);
		} else if (
			window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
		) {
			setTheme("dark");
			document.documentElement.classList.add("dark");
		} else {
			setTheme("light");
			document.documentElement.classList.remove("dark");
		}
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 20;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		window.addEventListener("scroll", handleScroll);

		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [scrolled]);

	const toggleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
			localStorage.setItem("theme", "dark");
			document.documentElement.classList.add("dark");
		} else {
			setTheme("light");
			localStorage.setItem("theme", "light");
			document.documentElement.classList.remove("dark");
		}
	};

	return (
		<div className="min-h-screen overflow-hidden bg-white text-gray-900 dark:from-slate-950 dark:to-indigo-950 dark:bg-gradient-to-br dark:text-white">
			{/* Navigation */}
			<nav
				className={cn(
					"fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300",
					scrolled
						? "mt-[10px] mx-[20px] w-[calc(100%-40px)] rounded-xl shadow-lg"
						: ""
				)}
			>
				<div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<MessageCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
						<span className="font-bold text-xl">Messenger</span>
					</div>
					<div className="flex items-center space-x-4">
						<Button
							variant="ghost"
							className="text-gray-700 dark:text-gray-300"
							asChild
						>
							<Link href="#features">Features</Link>
						</Button>
						<Button
							variant="ghost"
							className="text-gray-700 dark:text-gray-300"
							asChild
						>
							<Link href="#testimonials">Testimonials</Link>
						</Button>
						<Button
							variant="ghost"
							className="text-gray-700 dark:text-gray-300"
							asChild
						>
							<Link href="#enterprise">Enterprise</Link>
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="rounded-full ml-2"
							onClick={toggleTheme}
						>
							{theme === "dark" ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="relative pt-24">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)]"></div>

				<div className="container relative mx-auto flex min-h-[85vh] flex-col items-center justify-center px-4 py-16 text-center md:px-8">
					<div className="mb-8 inline-block rounded-2xl bg-blue-50/50 px-4 py-2 text-sm font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
						Introducing Messenger Enterprise
					</div>

					<motion.h1
						className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl max-w-4xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						Connect your enterprise with{" "}
						<span className="text-indigo-600 dark:text-indigo-400">
							purpose-built messaging
						</span>
					</motion.h1>

					<motion.p
						className="mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						A secure, scalable platform designed for modern
						enterprises. Built with industry-leading technology to
						transform how your teams communicate.
					</motion.p>

					<motion.div
						className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								asChild
								size="lg"
								className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 h-12 rounded-md transition-transform duration-200"
							>
								<Link href="/signup">
									Get Started
									<ChevronRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<Button
								asChild
								variant="outline"
								size="lg"
								className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 h-12 rounded-md transition-transform duration-200"
							>
								<Link href="#enterprise">Enterprise Solutions</Link>
							</Button>
						</motion.div>
					</motion.div>

					{/* Hero Image/Mockup */}
					<motion.div
						className="relative mt-16 w-full max-w-4xl rounded-lg border border-gray-200 bg-white/90 shadow-xl dark:border-gray-800 dark:bg-gray-900/90"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
					>
						<div className="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center px-4">
							<div className="flex space-x-2">
								<div className="h-3 w-3 rounded-full bg-red-500"></div>
								<div className="h-3 w-3 rounded-full bg-yellow-500"></div>
								<div className="h-3 w-3 rounded-full bg-green-500"></div>
							</div>
							<div className="mx-auto flex items-center space-x-2">
								<MessageCircle className="h-4 w-4 text-indigo-600" />
								<span className="text-sm font-medium">
									Messenger Enterprise
								</span>
							</div>
						</div>
						<div className="flex h-[300px] md:h-[400px]">
							<div className="hidden md:block w-1/4 border-r border-gray-200 dark:border-gray-800 p-3">
								<div className="space-y-3">
									{[1, 2, 3, 4, 5].map((item) => (
										<div
											key={item}
											className="h-10 rounded-md bg-gray-100 dark:bg-gray-800"
										></div>
									))}
								</div>
							</div>
							<div className="flex-1 p-4">
								<div className="flex h-full flex-col space-y-4">
									<div className="flex-1 rounded-md bg-gray-100 dark:bg-gray-800 p-3">
										<div className="flex flex-col h-full justify-end space-y-3">
											<div className="ml-auto w-2/3 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 p-3">
												<p className="text-sm text-gray-800 dark:text-gray-200">
													How are we doing on the Q3
													planning?
												</p>
											</div>
											<div className="w-2/3 rounded-lg bg-gray-200 dark:bg-gray-700 p-3">
												<p className="text-sm text-gray-800 dark:text-gray-200">
													Just finalized the roadmap.
													Sharing the document with
													the team now.
												</p>
											</div>
											<div className="ml-auto w-2/3 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 p-3">
												<p className="text-sm text-gray-800 dark:text-gray-200">
													Perfect! Let&apos;s review
													it in tomorrow&apos;s
													meeting.
												</p>
											</div>
										</div>
									</div>
									<div className="flex h-10">
										<div className="flex-1 rounded-l-md bg-gray-100 dark:bg-gray-800"></div>
										<div className="w-24 rounded-r-md bg-indigo-600"></div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Stats Section */}
			<div className="border-t border-b border-gray-200 bg-gray-50 py-20 dark:border-gray-800 dark:bg-transparent">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
						{[
							{ number: "99.99%", label: "Uptime" },
							{
								number: "10,000+",
								label: "Enterprise Customers",
							},
							{ number: "5M+", label: "Daily Active Users" },
							{ number: "256-bit", label: "Encryption" },
						].map((stat, index) => (
							<div
								key={index}
								className="flex flex-col items-center"
							>
								<p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 md:text-4xl">
									{stat.number}
								</p>
								<p className="text-gray-600 dark:text-gray-400">
									{stat.label}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div
				id="features"
				ref={featuresRef}
				className="container mx-auto px-4 py-24 md:px-8"
			>
				<motion.div
					style={{ opacity, y }}
					className="mb-16 text-center"
				>
					<div className="mx-auto mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
						Enterprise Features
					</div>
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
						Built for modern enterprise communication
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
						Every feature is designed with enterprise security,
						scale, and usability in mind.
					</p>
				</motion.div>

				{/* Feature Cards */}
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-md transition-all duration-300 dark:bg-gray-900/50 hover:shadow-xl"
							whileHover={{ scale: 1.05, y: -5 }}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
							onHoverStart={() => setHoveredIndex(index)}
							onHoverEnd={() => setHoveredIndex(null)}
						>
							<div
								className={`pointer-events-none absolute -inset-px rounded-xl border ${feature.borderColor} transition duration-300 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]`}
							></div>
							<div className="flex items-center">
								<div
									className={`mr-4 rounded-full ${feature.color} p-3`}
								>
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold">
									{feature.title}
								</h3>
							</div>
							<p className="mt-4 text-gray-600 dark:text-gray-400">
								{feature.description}
							</p>
							{hoveredIndex === index && (
								<motion.div
									className="absolute bottom-0 left-0 right-0 top-0 opacity-10"
									initial={{ opacity: 0 }}
									animate={{ opacity: 0.05 }}
									exit={{ opacity: 0 }}
									style={{
										backgroundImage: `url("data:image/svg+xml;base64,${toBase64(
											shimmer(200, 200)
										)}")`,
										backgroundSize: "150%",
									}}
								/>
							)}
						</motion.div>
					))}
				</div>
			</div>

			{/* Enterprise Section */}
			<div id="enterprise" className="bg-indigo-600 py-24 text-white">
				<div className="container mx-auto px-4 md:px-8">
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div>
							<div className="mb-4 inline-block rounded-full bg-indigo-500 px-3 py-1 text-sm font-medium">
								Enterprise Solutions
							</div>
							<h2 className="text-3xl font-bold md:text-4xl">
								Built for teams of all sizes
							</h2>
							<p className="mt-4 text-indigo-100">
								From startups to Fortune 500 companies, our
								enterprise platform scales with your
								organization.
							</p>

							<div className="mt-8 space-y-4">
								{[
									"Dedicated customer success manager",
									"Custom integration development",
									"Enterprise SLA with 99.99% uptime",
									"Advanced security and compliance features",
									"Single sign-on and directory integration",
									"Custom retention policies and data governance",
								].map((item, index) => (
									<div
										key={index}
										className="flex items-start"
									>
										<div className="mr-3 rounded-full bg-indigo-500 p-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
										<p>{item}</p>
									</div>
								))}
							</div>

							<div className="mt-8">
								<Button
									asChild
									className="bg-white text-indigo-600 hover:bg-gray-100 px-8 h-12 rounded-md"
								>
									<Link href="/signup">Contact Sales</Link>
								</Button>
							</div>
						</div>

						<div className="flex items-center justify-center">
							<div className="relative rounded-xl bg-indigo-700/50 p-8 md:p-12">
								<div className="absolute -right-4 -top-4 h-24 w-24 rounded-xl bg-indigo-500/30 backdrop-blur-md"></div>
								<div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-indigo-500/20 backdrop-blur-md"></div>

								<div className="relative z-10 text-center">
									<h3 className="text-2xl font-bold">
										Enterprise Plan
									</h3>
									<div className="my-6">
										<span className="text-5xl font-bold">
											Custom
										</span>
										<span className="ml-2 text-indigo-200">
											pricing
										</span>
									</div>

									<p className="mb-6 text-indigo-100">
										Tailored solutions designed for your
										specific enterprise needs
									</p>

									<ul className="mb-8 space-y-3 text-left">
										{[
											"Unlimited workspaces and channels",
											"Unlimited message history",
											"Dedicated support team",
											"Custom features and development",
											"Advanced analytics and reporting",
											"Enterprise API access",
										].map((feature, index) => (
											<li
												key={index}
												className="flex items-center"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="mr-2 h-5 w-5 text-indigo-300"
													viewBox="0 0 20 20"
													fill="currentColor"
												>
													<path
														fillRule="evenodd"
														d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
														clipRule="evenodd"
													/>
												</svg>
												{feature}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Testimonials Section */}
			<div
				id="testimonials"
				className="bg-white py-24 dark:bg-transparent"
			>
				<div className="container mx-auto px-4 md:px-8">
					<div className="mx-auto mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
						Testimonials
					</div>
					<h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
						Trusted by industry leaders
					</h2>

					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{testimonials.slice(0, 3).map((testimonial, index) => (
							<div
								key={index}
								className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800/50"
							>
								<div className="mb-4 flex items-center justify-between">
									<div className="flex items-center">
										<Image
											src={testimonial.avatar}
											alt={testimonial.name}
											className="mr-3 h-12 w-12 rounded-full object-cover ring-2 ring-indigo-500/20"
											width={48}
											height={48}
										/>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">
												{testimonial.name}
											</p>
											<p className="text-sm text-gray-500 dark:text-gray-400">
												{testimonial.title}
											</p>
										</div>
									</div>
									<div className="flex text-indigo-500">
										{[...Array(5)].map((_, i) => (
											<svg
												key={i}
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										))}
									</div>
								</div>
								<p className="text-gray-700 dark:text-gray-300">
									&ldquo;{testimonial.message}&rdquo;
								</p>
							</div>
						))}
					</div>

					{/* Logos Section */}
					<div className="mt-20">
						<p className="mb-8 text-center text-gray-600 dark:text-gray-400">
							Trusted by innovative companies worldwide
						</p>
						<div className="flex flex-wrap items-center justify-center gap-8 grayscale opacity-70">
							{[...Array(6)].map((_, index) => (
								<div
									key={index}
									className="h-8 w-32 rounded-md bg-gray-200 dark:bg-gray-700"
								></div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="container mx-auto px-4 py-24 text-center md:px-8">
				<motion.div
					className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 p-12 shadow-xl dark:from-indigo-900/30 dark:to-blue-900/30"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
				>
					<div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600">
						<motion.div
							className="absolute inset-0 rounded-full opacity-75"
							animate={{
								scale: [1, 1.2, 1],
								opacity: [0.7, 0.2, 0.7],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								repeatType: "loop",
							}}
						/>
						<MessageCircle className="h-10 w-10 text-white" />
					</div>

					<h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
						Ready to transform enterprise communication?
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-gray-600 dark:text-gray-300">
						Join thousands of leading companies that trust our
						platform for their critical business communication.
					</p>
					<div className="mt-8 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
						<Button
							asChild
							size="lg"
							className="bg-indigo-600 text-white hover:bg-indigo-700 h-12 rounded-md w-full sm:w-auto px-8"
						>
							<Link href="/signup">Start Free Trial</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							size="lg"
							className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 h-12 rounded-md w-full sm:w-auto"
						>
							<Link href="#enterprise">View Enterprise Plan</Link>
						</Button>
					</div>
				</motion.div>
			</div>

			{/* Newsletter Signup Section */}
			<div className="bg-gray-50 dark:bg-gray-900 py-20 border-t border-b border-gray-200 dark:border-gray-800">
				<div className="container mx-auto px-4 md:px-8 text-center">
					<h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl mb-4">
						Stay Updated
					</h2>
					<p className="mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
						Subscribe to our newsletter for the latest updates on features, releases, and more.
					</p>
					<form className="mx-auto flex max-w-md flex-col sm:flex-row gap-4 justify-center">
						<input
							type="email"
							required
							placeholder="Enter your email"
							className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
						/>
						<Button
							type="submit"
							className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md"
						>
							Subscribe
						</Button>
					</form>
				</div>
			</div>
			{/* Footer */}
			<footer className="border-t border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-gray-950">
				<div className="container mx-auto px-4 md:px-8">
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
						<div className="col-span-2 lg:col-span-1">
							<div className="flex items-center space-x-2">
								<MessageCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
								<span className="font-bold text-xl">
									Messenger
								</span>
							</div>
							<p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
								Modern enterprise communication platform built
								for security, reliability, and seamless
								collaboration.
							</p>
						</div>

						<div>
							<h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
								Product
							</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Features
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Security
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Enterprise
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Pricing
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
								Company
							</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										About
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Careers
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Contact
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Partners
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
								Resources
							</h3>
							<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Blog
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Documentation
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Guides
									</Link>
								</li>
								<li>
									<Link
										href="#"
										className="hover:text-indigo-600 dark:hover:text-indigo-400"
									>
										Support
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
						<div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								© 2023 Messenger. All rights reserved.
							</p>
							<div className="flex space-x-6">
								<Link
									href="#"
									className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
								>
									Terms
								</Link>
								<Link
									href="#"
									className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
								>
									Privacy
								</Link>
								<Link
									href="#"
									className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
								>
									Cookies
								</Link>
							</div>
						</div>
					</div>
				</div>
			</footer>

			<style jsx global>{`
				.apostrophe-fix {
					content: "Fixed apostrophe warning";
				}
			`}</style>
		</div>
	);
}
