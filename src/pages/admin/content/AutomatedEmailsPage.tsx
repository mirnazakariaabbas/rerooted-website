import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

type EmailTemplate = {
  id: string;
  name: string;
  trigger: string;
  subject: string;
  body: string;
  isActive: boolean;
  variables: string[];
};

const defaultTemplates: EmailTemplate[] = [
  {
    id: '1', name: 'Member Sign-Up Welcome', trigger: 'New member registration',
    subject: 'Welcome to Re-Rooted®, {{first_name}}!',
    body: 'Dear {{first_name}},\n\nWelcome to Re-Rooted®! We\'re thrilled to have you on board.\n\nYour account is under review and you\'ll receive access shortly.\n\nWarm regards,\nThe Re-Rooted Team',
    isActive: true, variables: ['first_name', 'email'],
  },
  {
    id: '2', name: 'Contact Form (Individual)', trigger: 'Individual contact form submission',
    subject: 'Thank you for reaching out, {{name}}',
    body: 'Hi {{name}},\n\nThank you for contacting Re-Rooted®. We\'ve received your message and will respond within 48 hours.\n\nBest,\nRe-Rooted Team',
    isActive: true, variables: ['name', 'email', 'message'],
  },
  {
    id: '3', name: 'Contact Form (Organization)', trigger: 'Organization contact form submission',
    subject: 'Re-Rooted® — Your inquiry has been received',
    body: 'Dear {{name}},\n\nThank you for your interest in Re-Rooted® corporate programs. A member of our team will be in touch shortly.\n\nBest regards,\nRe-Rooted Team',
    isActive: true, variables: ['name', 'company_name', 'email'],
  },
  {
    id: '4', name: 'Coach First Login', trigger: 'Coach\'s first platform login',
    subject: 'Welcome to the Re-Rooted® Coach Portal',
    body: 'Dear {{coach_name}},\n\nWelcome to the Re-Rooted® coaching platform. Your profile is ready.\n\nPlease complete your bio and availability settings.\n\nBest,\nRe-Rooted Team',
    isActive: true, variables: ['coach_name'],
  },
  {
    id: '5', name: 'Coach Match Request', trigger: 'Admin matches coach with member',
    subject: 'New coaching opportunity — {{coachee_name}}',
    body: 'Dear {{coach_name}},\n\nYou\'ve been matched with a new coachee:\n\nName: {{coachee_name}}\nJourney Stage: {{journey_stage}}\n\nPlease respond with your availability.\n\nBest,\nRe-Rooted Team',
    isActive: true, variables: ['coach_name', 'coachee_name', 'journey_stage'],
  },
  {
    id: '6', name: 'Match Confirmed — Coach', trigger: 'Admin confirms match after coach accepts',
    subject: 'Match confirmed with {{coachee_name}}',
    body: 'Dear {{coach_name}},\n\nYour match with {{coachee_name}} has been confirmed. You can now schedule your first session.\n\nBest,\nRe-Rooted Team',
    isActive: false, variables: ['coach_name', 'coachee_name'],
  },
  {
    id: '7', name: 'Match Confirmed — Member', trigger: 'Admin confirms match',
    subject: 'Your coach is ready, {{first_name}}!',
    body: 'Dear {{first_name}},\n\nGreat news! You\'ve been matched with {{coach_name}}. Visit the app to book your first session.\n\nBest,\nRe-Rooted Team',
    isActive: false, variables: ['first_name', 'coach_name'],
  },
  {
    id: '8', name: 'Admin Access Approved', trigger: 'New admin approved',
    subject: 'Admin access granted — Re-Rooted®',
    body: 'Dear {{admin_name}},\n\nYour admin access has been approved. You can now log in to the admin dashboard.\n\nBest,\nRe-Rooted Team',
    isActive: true, variables: ['admin_name'],
  },
  {
    id: '9', name: 'Password Reset', trigger: 'User requests password reset',
    subject: 'Reset your Re-Rooted® password',
    body: 'Hi {{first_name}},\n\nClick the link below to reset your password:\n\n{{reset_link}}\n\nThis link expires in 24 hours.\n\nBest,\nRe-Rooted Team',
    isActive: true, variables: ['first_name', 'reset_link'],
  },
];

const AutomatedEmailsPage = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  const toggleActive = (id: string) => {
    setTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ));
    toast.success('Template status updated');
  };

  const openEditor = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditSubject(template.subject);
    setEditBody(template.body);
  };

  const saveTemplate = () => {
    if (!selectedTemplate) return;
    setTemplates(prev => prev.map(t =>
      t.id === selectedTemplate.id ? { ...t, subject: editSubject, body: editBody } : t
    ));
    toast.success('Template saved');
    setSelectedTemplate(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-12 max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Automated Emails</h1>
        <p className="text-muted-foreground mt-1">Manage triggered email templates for your platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <Card
            key={template.id}
            className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openEditor(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold leading-tight">{template.name}</CardTitle>
                </div>
                <div onClick={e => e.stopPropagation()}>
                  <Switch
                    checked={template.isActive}
                    onCheckedChange={() => toggleActive(template.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-2">{template.trigger}</p>
              <Badge variant={template.isActive ? 'default' : 'outline'} className="text-xs">
                {template.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardContent>
          </Card>
        ))}

        {/* Placeholder for custom trigger */}
        <Card className="border-2 border-dashed border-border/50 flex items-center justify-center min-h-[140px] cursor-pointer hover:border-primary/30 transition-colors">
          <div className="text-center text-muted-foreground">
            <Mail className="h-6 w-6 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">+ Add New Trigger</p>
            <p className="text-xs mt-1">Coming in Phase 2</p>
          </div>
        </Card>
      </div>

      {/* Template Editor */}
      <Sheet open={!!selectedTemplate} onOpenChange={open => { if (!open) setSelectedTemplate(null); }}>
        <SheetContent className="w-[560px] sm:max-w-[560px] overflow-y-auto">
          {selectedTemplate && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-display font-bold">{selectedTemplate.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{selectedTemplate.trigger}</p>
              </SheetHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Subject Line</label>
                  <Input value={editSubject} onChange={e => setEditSubject(e.target.value)} />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Available Variables</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.variables.map(v => (
                      <Badge key={v} variant="outline" className="text-xs cursor-pointer hover:bg-muted" onClick={() => setEditBody(prev => prev + `{{${v}}}`)} >
                        {`{{${v}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Body</label>
                  <Textarea
                    value={editBody}
                    onChange={e => setEditBody(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={saveTemplate}>Save Changes</Button>
                  <Button variant="outline" disabled>
                    <Send className="h-4 w-4 mr-1" /> Send Test Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default AutomatedEmailsPage;
