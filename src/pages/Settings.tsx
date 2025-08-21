import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  User, 
  CreditCard, 
  Home,
  ChevronLeft,
  Key,
  Brain,
  Mic
} from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('account');
  const [openaiKey, setOpenaiKey] = useState('');
  const [openaiModel, setOpenaiModel] = useState('gpt-4');
  const [podiumKey, setPodiumKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load existing settings on component mount
  useEffect(() => {
    // TODO: Load existing API keys from backend/localStorage
    const loadSettings = async () => {
      try {
        // For now, load from localStorage if available
        const savedOpenAIKey = localStorage.getItem('openai_api_key');
        const savedOpenAIModel = localStorage.getItem('openai_model');
        const savedPodiumKey = localStorage.getItem('podium_api_key');
        
        if (savedOpenAIKey) setOpenaiKey(savedOpenAIKey);
        if (savedOpenAIModel) setOpenaiModel(savedOpenAIModel);
        if (savedPodiumKey) setPodiumKey(savedPodiumKey);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" placeholder="Tell us about yourself..." />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your Podbook experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates about your projects</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>


    </div>
  );

  const renderLLMSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            LLM Configuration
          </CardTitle>
          <CardDescription>Configure your AI and transcription API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OpenAI Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              <Label className="text-base font-medium">OpenAI Configuration</Label>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="openaiKey">OpenAI API Key</Label>
                <Input 
                  id="openaiKey" 
                  type="password" 
                  placeholder="sk-..." 
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Your OpenAI API key is encrypted and never shared
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openaiModel">AI Model</Label>
                <Select value={openaiModel} onValueChange={setOpenaiModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4 (Most Capable)</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Fast & Cost-Effective)</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast & Affordable)</SelectItem>
                    <SelectItem value="gpt-4o">GPT-4o (Latest Model)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose the AI model for content generation and editing
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Podium Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              <Label className="text-base font-medium">Podium Transcription</Label>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="podiumKey">Podium API Key</Label>
                <Input 
                  id="podiumKey" 
                  type="password" 
                  placeholder="podium_..." 
                  value={podiumKey}
                  onChange={(e) => setPodiumKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Used for audio and video transcription services
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button 
              className="w-full" 
              onClick={async () => {
                setIsSaving(true);
                try {
                  // Save to localStorage for now, TODO: Save to backend
                  localStorage.setItem('openai_api_key', openaiKey);
                  localStorage.setItem('openai_model', openaiModel);
                  localStorage.setItem('podium_api_key', podiumKey);
                  
                  // Simulate API call delay
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                  // TODO: Show success toast
                  console.log('Settings saved successfully');
                } catch (error) {
                  console.error('Error saving settings:', error);
                  // TODO: Show error toast
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save API Keys'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBillingAndPlan = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You're currently on the Pro plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold">Pro Plan</h3>
              <p className="text-sm text-muted-foreground">$19/month</p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Manage your payment methods and billing details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Edit</Button>
          </div>
          <Button variant="outline" className="w-full">
            <CreditCard className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Pro Plan - December 2024</p>
                <p className="text-sm text-muted-foreground">Dec 1, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$19.00</p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Pro Plan - November 2024</p>
                <p className="text-sm text-muted-foreground">Nov 1, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$19.00</p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Custom Left Navigation */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Podbook Logo" className="w-8 h-8 logo-svg" />
            <h1 className="text-2xl font-medium text-foreground">Podbook</h1>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div className="px-6 mb-6">
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link to="/dashboard">
              <ChevronLeft className="w-4 h-4 mr-3" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="px-6 mb-6">
          <Separator />
        </div>

        {/* Settings Navigation */}
        <div className="px-6">
          <div className="space-y-2">
            <Button 
              variant={activeSection === 'account' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveSection('account')}
            >
              <User className="w-4 h-4 mr-3" />
              Account Settings
            </Button>
            <Button 
              variant={activeSection === 'billing' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveSection('billing')}
            >
              <CreditCard className="w-4 h-4 mr-3" />
              Billing and Plan
            </Button>
            <Button 
              variant={activeSection === 'llm' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveSection('llm')}
            >
              <Brain className="w-4 h-4 mr-3" />
              LLM Settings
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="max-w-4xl">
            <div className="mb-8">
                          <h1 className="text-3xl font-medium text-foreground mb-2">
              {activeSection === 'account' ? 'Account Settings' : 
               activeSection === 'billing' ? 'Billing and Plan' : 'LLM Settings'}
            </h1>
            <p className="text-muted-foreground">
              {activeSection === 'account' 
                ? 'Manage your account settings and preferences' 
                : activeSection === 'billing'
                ? 'View and manage your subscription and billing information'
                : 'Configure your AI and transcription API keys'
              }
            </p>
            </div>

            {activeSection === 'account' ? renderAccountSettings() : 
             activeSection === 'billing' ? renderBillingAndPlan() : 
             renderLLMSettings()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
