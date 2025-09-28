import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Activity, MessageSquare, Users, Sparkles, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Activity className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                PulseBoard
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discord-connected onboarding and engagement tool that transforms community interactions 
              into actionable insights and automated nudges.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="glass-card p-6 text-center">
              <MessageSquare className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Discord Integration</h3>
              <p className="text-sm text-muted-foreground">
                Seamless Discord-like interface with channels, messages, and real-time activity tracking.
              </p>
            </Card>

            <Card className="glass-card p-6 text-center">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Onboarding</h3>
              <p className="text-sm text-muted-foreground">
                Personalized starter kits with resources, channels, and connections based on user interests.
              </p>
            </Card>

            <Card className="glass-card p-6 text-center">
              <Activity className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Engagement Analytics</h3>
              <p className="text-sm text-muted-foreground">
                Real-time community energy monitoring with automated engagement suggestions.
              </p>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
              onClick={() => window.location.href = '/discord'}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Try Discord Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.location.href = '/welcome'}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Your Starter Kit
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/pulseboard'}
            >
              <Activity className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Flow */}
      <div className="container mx-auto px-4 py-16 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Complete Demo Flow</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold">Join Discord</h3>
              <p className="text-sm text-muted-foreground">
                Explore the mock Discord interface, browse channels, and click the pinned starter kit CTA.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold">Get Onboarded</h3>
              <p className="text-sm text-muted-foreground">
                Fill out your profile to receive a personalized starter kit with resources and connections.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold">Monitor Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Watch the PulseBoard dashboard track community energy and suggest engagement tactics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with React, TypeScript, and Tailwind CSS • Mock data only • No backend required
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
