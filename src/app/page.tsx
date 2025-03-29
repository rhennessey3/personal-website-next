"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AnimatedText,
  Card3D,
  Spotlight,
  Parallax,
  AnimatedCounter,
  FloatingElement,
  InteractiveBackground
} from "@/components/ui/aceternity";

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section with Parallax */}
      <Parallax className="py-8" baseVelocity={-2}>
        <section className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-6">
            <AnimatedText
              text="Aligning Product Vision with Business Needs"
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            />
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-2xl">
              With over 10 years of experience in product management and UX strategy,
              I help organizations create meaningful digital experiences that drive results.
            </p>
            <div className="flex gap-4 pt-4">
              <Spotlight className="rounded-lg">
                <Button asChild size="lg">
                  <Link href="/thinking?filter=case-study">View My Work</Link>
                </Button>
              </Spotlight>
              <Spotlight className="rounded-lg">
                <Button variant="outline" asChild size="lg">
                  <Link href="/about">About Me</Link>
                </Button>
              </Spotlight>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <FloatingElement amplitude={15} frequency={0.6}>
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                {/* Placeholder for profile image */}
                <span className="text-xl text-neutral-500">Profile Image</span>
              </div>
            </FloatingElement>
          </div>
        </section>
      </Parallax>

      {/* Metrics Section with AnimatedCounter */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
        <AnimatedText
          text="Impact by the Numbers"
          className="text-3xl font-bold mb-12 text-center"
          delay={0.1}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <AnimatedCounter
              value={45}
              suffix="%"
              className="text-5xl font-bold text-primary"
            />
            <p className="text-lg">Average Increase in User Engagement</p>
          </div>
          <div className="space-y-2">
            <AnimatedCounter
              value={12}
              suffix="+"
              className="text-5xl font-bold text-primary"
            />
            <p className="text-lg">Enterprise Products Launched</p>
          </div>
          <div className="space-y-2">
            <AnimatedCounter
              value={30}
              suffix="M+"
              className="text-5xl font-bold text-primary"
            />
            <p className="text-lg">Users Impacted</p>
          </div>
        </div>
      </section>

      {/* Expertise Section with InteractiveBackground */}
      <InteractiveBackground
        className="py-12 rounded-xl"
        dotSize={2}
        dotSpacing={30}
        dotOpacity={0.3}
        dotColor="var(--primary)"
      >
        <section>
          <AnimatedText
            text="Areas of Expertise"
            className="text-3xl font-bold mb-8 text-center"
            delay={0.2}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card3D className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Product Strategy</CardTitle>
                  <CardDescription>Defining vision and roadmaps</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Developing product strategies that align with business goals while meeting user needs through research-driven insights.</p>
                </CardContent>
              </Card>
            </Card3D>

            <Card3D className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>UX Leadership</CardTitle>
                  <CardDescription>Creating seamless experiences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Leading UX initiatives that balance business requirements with user-centered design principles to deliver intuitive interfaces.</p>
                </CardContent>
              </Card>
            </Card3D>

            <Card3D className="h-full">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Cross-functional Collaboration</CardTitle>
                  <CardDescription>Building bridges between teams</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Facilitating collaboration between design, engineering, and business stakeholders to ensure successful product delivery.</p>
                </CardContent>
              </Card>
            </Card3D>
          </div>
        </section>
      </InteractiveBackground>

      {/* Featured Work Section Removed */}
    </div>
  );
}
