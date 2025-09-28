import { useState } from "react";
import { Role, Interest, Resource } from "@/lib/types";
import {
  RESOURCES_CATALOG,
  generateBio,
  generateIntroMessage,
} from "@/lib/mock";
import { aiService } from "@/lib/ai";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InterestChips } from "@/components/InterestChips";
import { StarterKitCard } from "@/components/StarterKitCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ROLES: Role[] = ["Student", "Engineer", "Founder", "Designer", "Product"];
const INTERESTS: Interest[] = [
  "AI",
  "Python",
  "Growth",
  "Design",
  "Product",
  "Data",
];

export default function Welcome() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setProfile, setStarterKit, postMessage } = useStore();

  const handleInterestToggle = (interest: Interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !role || selectedInterests.length === 0) {
      toast({
        title: "Please fill all fields",
        description: "Name, role, and at least one interest are required.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate profile and bio (use AI welcome_bot as bio if available)
      const aiWelcome = await aiService.welcomeBot(
        name.trim(),
        role as Role,
        selectedInterests
      );
      const bio =
        aiWelcome || generateBio(name.trim(), role, selectedInterests);
      const profile = {
        name: name.trim(),
        role,
        interests: selectedInterests,
        bio,
      };
      // Try AI recommendations in parallel
      const [aiResources, aiChannels, aiPeople] = await Promise.all([
        aiService.getResources(role as Role, selectedInterests, 3),
        aiService.getChannels(role as Role, selectedInterests, 3),
        aiService.getPeople(role as Role, selectedInterests, 3),
      ]);

      let resources: Resource[] = [];
      let channels: string[] = [];
      let people: string[] = [];

      if (aiResources.length || aiChannels.length || aiPeople.length) {
        resources = aiResources.slice(0, 3).map((r) => ({
          title: r.name,
          url: r.link,
          description: r.topics?.join(", "),
        }));
        channels = aiChannels.slice(0, 3);
        people = aiPeople.slice(0, 3).map((p) => `${p.name} (${p.role})`);
      } else {
        // Fallback to static catalog
        const allResources: Resource[] = [];
        const allChannels: string[] = [];
        const allPeople: string[] = [];

        selectedInterests.forEach((interest) => {
          const catalog = RESOURCES_CATALOG[interest];
          allResources.push(...catalog.resources.slice(0, 1));
          allChannels.push(...catalog.channels.slice(0, 1));
          allPeople.push(...catalog.people.slice(0, 1));
        });

        resources = allResources.slice(0, 3);
        channels = [...new Set(allChannels)].slice(0, 3);
        people = [...new Set(allPeople)].slice(0, 3);
      }

      const starterKit = { profile, resources, channels, people };

      // Save to store
      setProfile(profile);
      setStarterKit(starterKit);

      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDiscord = () => {
    const state = useStore.getState();

    if (state.profile) {
      // Generate and post intro message (use bio we set, which may be AI)
      const introMessage = generateIntroMessage(
        state.profile.name,
        state.profile.role,
        state.profile.interests,
        state.profile.bio
      );

      postMessage("introductions", introMessage);

      toast({
        title: "Welcome message posted! 🎉",
        description: "Your introduction has been added to #introductions.",
      });
    }

    // Navigate to Discord with introductions channel
    window.location.href = "/discord?c=introductions";
  };

  if (isSubmitted) {
    const starterKit = useStore.getState().starterKit;
    if (!starterKit) return null;

    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <StarterKitCard
            starterKit={starterKit}
            onGoToDiscord={handleGoToDiscord}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="glass-card p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  PulseBoard
                </h1>
              </div>

              <h2 className="text-2xl font-semibold">
                👋 Welcome to the AI Collective!
              </h2>

              <p className="text-lg text-muted-foreground">
                Tell us your name, role, and interests — we'll craft your
                personalized Starter Kit.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  ✅ Top free resources
                </span>
                <span className="flex items-center gap-1">
                  ✅ Channels to join
                </span>
                <span className="flex items-center gap-1">
                  ✅ People to connect with
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-card"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={role}
                  onValueChange={(value: Role) => setRole(value)}
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((roleOption) => (
                      <SelectItem key={roleOption} value={roleOption}>
                        {roleOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label>Interests * (select at least one)</Label>
                <InterestChips
                  interests={INTERESTS}
                  selectedInterests={selectedInterests}
                  onToggle={handleInterestToggle}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  !name.trim() ||
                  !role ||
                  selectedInterests.length === 0
                }
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
              >
                {isLoading ? (
                  "Generating Your Starter Kit..."
                ) : (
                  <>
                    Generate My Starter Kit
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
