import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/hooks/useAdmin';
import { Navigate } from 'react-router-dom';
import UsersTab from './tabs/UsersTab';
import CoachesTab from './tabs/CoachesTab';
import InvitationsTab from './tabs/InvitationsTab';
import BookingsTab from './tabs/BookingsTab';
import ContactsTab from './tabs/ContactsTab';

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
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-serif font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage users, coaches, and platform activity</p>
      </div>

      <Tabs defaultValue="users" className="px-4">
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
  );
};

export default AdminDashboard;
