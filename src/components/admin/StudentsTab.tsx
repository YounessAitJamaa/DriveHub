import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Edit, Trash2, Plus, Search, Loader2, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NewStudentDialog from "./students/NewStudentDialog";
import { useIsMobile } from "@/hooks/use-mobile";
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

const StudentsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewStudentDialogOpen, setIsNewStudentDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // Fetch students from Supabase
  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data || [];
    }
  });
  
  // Fetch instructors from Supabase (assuming you'll add this table later)
  const { data: instructors, isLoading: isLoadingInstructors } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      // For now returning mock data - you can create an instructors table later
      return [
        { id: 1, name: "David Wilson", email: "david@example.com", phone: "(123) 456-8890", specialties: ["Beginner", "Defensive Driving"], students: 12, rating: 4.8 },
        { id: 2, name: "Laura Miller", email: "laura@example.com", phone: "(123) 456-8891", specialties: ["Advanced", "Highway"], students: 8, rating: 4.9 },
        { id: 3, name: "James Taylor", email: "james@example.com", phone: "(123) 456-8892", specialties: ["Intensive", "Parking"], students: 10, rating: 4.7 },
      ];
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
  const filteredStudents = students?.filter(student => 
    (student.first_name && student.first_name.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (student.last_name && student.last_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.email && student.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (student.cin && student.cin.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
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
    <>
      <Card className="mb-4">
        <CardHeader className="pb-3 pt-4 md:pb-4 md:pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div>
              <CardTitle className="text-xl md:text-2xl">Students</CardTitle>
              <CardDescription className="text-xs md:text-sm">Manage student records and progress</CardDescription>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500" />
                <Input 
                  className="pl-8 h-9 md:h-10 text-sm md:w-[250px]" 
                  placeholder="Search students..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 h-9 md:h-10 text-xs md:text-sm"
                onClick={() => setIsNewStudentDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" />
                Add Student
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
          {isLoadingStudents ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs md:text-sm">CIN</TableHead>
                    <TableHead className="text-xs md:text-sm">Name</TableHead>
                    <TableHead className="text-xs md:text-sm">Email</TableHead>
                    <TableHead className="text-xs md:text-sm">Phone</TableHead>
                    <TableHead className="text-xs md:text-sm">Address</TableHead>
                    <TableHead className="text-xs md:text-sm">Notes</TableHead>
                    <TableHead className="text-xs md:text-sm">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents && filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.cin || '-'}</TableCell>
                        <TableCell className="font-medium text-xs md:text-sm py-2 md:py-4">
                          {student.first_name || ''} {student.last_name || ''}
                        </TableCell>
                        <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.email || '-'}</TableCell>
                        <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.phone || '-'}</TableCell>
                        <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.address || '-'}</TableCell>
                        <TableCell className="text-xs md:text-sm py-2 md:py-4">{student.notes || '-'}</TableCell>
                        <TableCell className="py-2 md:py-4">
                          <div className="flex gap-1 md:gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 md:h-8 md:w-8 p-0"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-3.5 w-3.5 md:h-4 md:w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 h-6 w-6 md:h-8 md:w-8 p-0"
                              onClick={() => handleDeleteStudent(student.id)}
                              disabled={deleteStudentMutation.isPending}
                            >
                              {deleteStudentMutation.isPending && deleteStudentMutation.variables === student.id ? (
                                <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 md:py-8 text-gray-500 text-xs md:text-sm">
                        {searchQuery ? 'No students found matching your search' : 'No students found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="pb-3 pt-4 md:pb-4 md:pt-6">
            <CardTitle className="text-lg md:text-xl">Instructors</CardTitle>
            <CardDescription className="text-xs md:text-sm">Manage your teaching staff</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            {isLoadingInstructors ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto -mx-3 md:mx-0">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs md:text-sm whitespace-nowrap">Name</TableHead>
                        <TableHead className="text-xs md:text-sm whitespace-nowrap">Students</TableHead>
                        <TableHead className="text-xs md:text-sm whitespace-nowrap">Rating</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {instructors?.map(instructor => (
                        <TableRow key={instructor.id}>
                          <TableCell className="font-medium text-xs md:text-sm py-2 md:py-3">{instructor.name}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-3">{instructor.students}</TableCell>
                          <TableCell className="text-xs md:text-sm py-2 md:py-3">{instructor.rating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button variant="outline" className="w-full mt-3 md:mt-4 text-xs md:text-sm py-1 md:py-2">View All Instructors</Button>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-3 pt-4 md:pb-4 md:pt-6">
            <CardTitle className="text-lg md:text-xl">Student Statistics</CardTitle>
            <CardDescription className="text-xs md:text-sm">Overview of student performance and progress</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3 md:px-6 md:pb-6">
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
              <div className="bg-blue-50 p-2 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm text-blue-600 mb-0.5 md:mb-1">Total Students</p>
                <p className="text-xl md:text-3xl font-bold text-blue-800">{students?.length || 0}</p>
              </div>
              <div className="bg-green-50 p-2 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm text-green-600 mb-0.5 md:mb-1">Pass Rate</p>
                <p className="text-xl md:text-3xl font-bold text-green-800">87%</p>
              </div>
              <div className="bg-purple-50 p-2 md:p-4 rounded-lg">
                <p className="text-xs md:text-sm text-purple-600 mb-0.5 md:mb-1">Avg. Lessons</p>
                <p className="text-xl md:text-3xl font-bold text-purple-800">18</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg flex items-start gap-2 md:gap-3">
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-xs md:text-sm">Upcoming Tests This Week</h4>
                <p className="text-xs md:text-sm text-gray-700">
                  5 students have driving tests scheduled this week. 
                  <Button variant="link" className="h-auto p-0 text-blue-600 text-xs md:text-sm">View details</Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NewStudentDialog 
        isOpen={isNewStudentDialogOpen}
        setIsOpen={setIsNewStudentDialogOpen}
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
    </>
  );
};

export default StudentsTab;
