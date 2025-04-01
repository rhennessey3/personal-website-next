"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedText, Spotlight, FloatingElement } from "@/components/ui/aceternity";
import type { ImageUrlBuilder } from '@sanity/image-url/lib/types/builder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface HeroSectionProps {
  profileImage: SanityImageSource | null;
  loadingImage: boolean;
  urlFor: (source: SanityImageSource) => ImageUrlBuilder;
}

export function HeroSection({ profileImage, loadingImage, urlFor }: HeroSectionProps) {
  return (
    // Changed py-16 to pt-[60px] pb-16
    <section className="pt-[60px] pb-16">
      <div className="flex flex-col md:flex-row gap-8 items-center w-full">
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
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
              {loadingImage ? (
                <span className="text-xl text-neutral-500">Loading...</span>
              ) : profileImage ? (
                <img
                  // Request a larger image (e.g., 2x the max display size) for higher density screens
                  src={urlFor(profileImage).width(640).height(640).fit('crop').url()}
                  alt="Profile Image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl text-neutral-500">Profile Image</span>
              )}
            </div>
          </FloatingElement>
        </div>
      </div>
    </section>
  );
}