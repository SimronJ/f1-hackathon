import { StarterKit } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, ArrowRight, BookOpen, MessageSquare, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StarterKitCardProps {
  starterKit: StarterKit;
  onGoToDiscord: () => void;
}

export function StarterKitCard({ starterKit, onGoToDiscord }: StarterKitCardProps) {
  const copyToClipboard = async () => {
    const markdown = `# Welcome ${starterKit.profile.name}! 🎉

**Role:** ${starterKit.profile.role}
**Interests:** ${starterKit.profile.interests.join(', ')}

## 📚 Top Resources
${starterKit.resources.map(r => `- [${r.title}](${r.url})`).join('\n')}

## 💬 Channels to Join
${starterKit.channels.map(c => `- ${c}`).join('\n')}

## 👥 People to Connect With
${starterKit.people.map(p => `- ${p}`).join('\n')}

## 🧾 Your Bio
${starterKit.profile.bio}
`;

    try {
      await navigator.clipboard.writeText(markdown);
      toast({
        title: "Starter Kit Copied! 📋",
        description: "Your personalized starter kit has been copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            🎉 Welcome, {starterKit.profile.name}!
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">{starterKit.profile.role}</Badge>
            {starterKit.profile.interests.map(interest => (
              <Badge key={interest} variant="outline">{interest}</Badge>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold">
            <BookOpen className="w-5 h-5 text-primary" />
            📚 Top Resources
          </h3>
          <div className="space-y-2">
            {starterKit.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{resource.title}</p>
                  {resource.description && (
                    <p className="text-xs text-muted-foreground">{resource.description}</p>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>

        {/* Channels */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold">
            <MessageSquare className="w-5 h-5 text-primary" />
            💬 Channels to Join
          </h3>
          <div className="flex flex-wrap gap-2">
            {starterKit.channels.map((channel, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {channel}
              </Badge>
            ))}
          </div>
        </div>

        {/* People */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold">
            <Users className="w-5 h-5 text-primary" />
            👥 People to Connect With
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {starterKit.people.map((person, index) => (
              <div key={index} className="text-sm p-2 rounded bg-secondary/30">
                {person}
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold">
            <span className="text-primary">🧾</span>
            Your Bio
          </h3>
          <p className="text-sm p-3 rounded-lg bg-secondary/30 italic">
            "{starterKit.profile.bio}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Starter Kit
          </Button>
          <Button
            onClick={onGoToDiscord}
            className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
          >
            Go to Discord
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}