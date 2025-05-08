import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface NewStudentDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NewStudentDialog = ({
  isOpen,
  setIsOpen
}: NewStudentDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newStudent, setNewStudent] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: ""
  });

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: async (student: typeof newStudent) => {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: student.email,
        password: student.password,
      });

      if (authError) throw new Error(authError.message);

      // Then create the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user?.id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email
        }])
        .select();

      if (profileError) throw new Error(profileError.message);

      // Finally create the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user?.id,
          role: 'client'
        }]);

      if (roleError) throw new Error(roleError.message);

      return profileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student added",
        description: "The student has been successfully added to the system.",
      });
      setIsOpen(false);
      // Reset form
      setNewStudent({
        email: "",
        password: "",
        first_name: "",
        last_name: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add student: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleCreateStudent = () => {
    if (!newStudent.email || !newStudent.password || !newStudent.first_name || !newStudent.last_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createStudentMutation.mutate(newStudent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name *</Label>
              <Input 
                id="first-name" 
                value={newStudent.first_name}
                onChange={(e) => setNewStudent({...newStudent, first_name: e.target.value})}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name *</Label>
              <Input 
                id="last-name" 
                value={newStudent.last_name}
                onChange={(e) => setNewStudent({...newStudent, last_name: e.target.value})}
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email"
              value={newStudent.email}
              onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input 
              id="password" 
              type="password"
              value={newStudent.password}
              onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
              placeholder="Enter password"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleCreateStudent} 
            disabled={createStudentMutation.isPending}
          >
            {createStudentMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Add Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewStudentDialog;
