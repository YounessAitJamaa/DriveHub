import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AddStudentDialog from "@/components/admin/students/AddStudentDialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Student {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  cin: string | null;
}

const Students = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch students
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('first_name', { ascending: true });
      
      if (error) throw new Error(error.message);
      return data;
    }
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student deleted",
        description: "The student has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete student: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: async (student: Student) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          phone: student.phone,
          address: student.address,
          notes: student.notes,
          cin: student.cin
        })
        .eq('id', student.id);
      
      if (error) throw new Error(error.message);
      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Student updated",
        description: "The student information has been successfully updated.",
      });
      setIsEditDialogOpen(false);
      setEditingStudent(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update student: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Filter students based on search query
  const filteredStudents = students?.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    return (
      student.first_name?.toLowerCase().includes(searchLower) ||
      student.last_name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.phone?.toLowerCase().includes(searchLower) ||
      student.cin?.toLowerCase().includes(searchLower)
    );
  });

  // Handle student deletion
  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      deleteStudentMutation.mutate(id);
    }
  };

  // Handle student edit
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsEditDialogOpen(true);
  };

  // Handle student update
  const handleUpdateStudent = () => {
    if (editingStudent) {
      updateStudentMutation.mutate(editingStudent);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CIN</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredStudents?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents?.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.cin || '-'}</TableCell>
                  <TableCell>
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone || '-'}</TableCell>
                  <TableCell>{student.address || '-'}</TableCell>
                  <TableCell>{student.notes || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditStudent(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleDeleteStudent(student.id)}
                        disabled={deleteStudentMutation.isPending}
                      >
                        {deleteStudentMutation.isPending && deleteStudentMutation.variables === student.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddStudentDialog 
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
      />

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          
          {editingStudent && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <Input 
                    id="edit-first-name" 
                    value={editingStudent.first_name || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, first_name: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <Input 
                    id="edit-last-name" 
                    value={editingStudent.last_name || ''}
                    onChange={(e) => setEditingStudent({...editingStudent, last_name: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={editingStudent.email || ''}
                  onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input 
                  id="edit-phone" 
                  type="tel"
                  value={editingStudent.phone || ''}
                  onChange={(e) => setEditingStudent({...editingStudent, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-cin">CIN</Label>
                <Input 
                  id="edit-cin" 
                  value={editingStudent.cin || ''}
                  onChange={(e) => setEditingStudent({...editingStudent, cin: e.target.value})}
                  placeholder="Enter CIN number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea 
                  id="edit-address" 
                  value={editingStudent.address || ''}
                  onChange={(e) => setEditingStudent({...editingStudent, address: e.target.value})}
                  placeholder="Enter address"
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  value={editingStudent.notes || ''}
                  onChange={(e) => setEditingStudent({...editingStudent, notes: e.target.value})}
                  placeholder="Enter any additional notes"
                  className="resize-none"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStudent}
              disabled={updateStudentMutation.isPending}
            >
              {updateStudentMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students; 