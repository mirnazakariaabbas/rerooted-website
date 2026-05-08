import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/hooks/useAdmin';
import { Navigate } from 'react-router-dom';
import UsersTab from './tabs/UsersTab';
import CoachesTab from './tabs/CoachesTab';
import InvitationsTab from './tabs/InvitationsTab';
import BookingsTab from './tabs/BookingsTab';
import ContactsTab from './tabs/ContactsTab';
import { PageHeader } from '@/components/layout/PageHeader';

const AdminDashboard = () => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/app/home" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background pb-24"
    >
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage users, coaches, and platform activity"
      />
      <div className="max-w-2xl mx-auto px-6 -mt-10 relative">
      <Tabs defaultValue="users">
        <TabsList className="w-full grid grid-cols-5 mb-4">
          <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
          <TabsTrigger value="coaches" className="text-xs">Coaches</TabsTrigger>
          <TabsTrigger value="invitations" className="text-xs">Invites</TabsTrigger>
          <TabsTrigger value="bookings" className="text-xs">Bookings</TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="coaches"><CoachesTab /></TabsContent>
        <TabsContent value="invitations"><InvitationsTab /></TabsContent>
        <TabsContent value="bookings"><BookingsTab /></TabsContent>
        <TabsContent value="contacts"><ContactsTab /></TabsContent>
      </Tabs>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
