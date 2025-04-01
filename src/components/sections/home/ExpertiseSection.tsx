"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedText, Card3D, InteractiveBackground } from "@/components/ui/aceternity";

export function ExpertiseSection() {
  return (
    <InteractiveBackground
      className="py-16 rounded-xl"
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
  );
}