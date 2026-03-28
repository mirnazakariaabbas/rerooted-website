
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages they sent or received
CREATE POLICY "Users can read own messages" ON public.messages
  FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Users can send messages (insert where they are the sender)
CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Users can mark messages as read (only recipient)
CREATE POLICY "Recipients can update read status" ON public.messages
  FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid());

-- Coaches can read messages from assigned coachees
CREATE POLICY "Coaches can read assigned coachee messages" ON public.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM coach_assignments ca
      JOIN coaches c ON c.id = ca.coach_id
      WHERE c.user_id = auth.uid()
      AND (ca.user_id = messages.sender_id OR ca.user_id = messages.recipient_id)
    )
  );

-- Admins can read all messages
CREATE POLICY "Admins can read all messages" ON public.messages
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
