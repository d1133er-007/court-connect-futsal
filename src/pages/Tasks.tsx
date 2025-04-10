
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import AnimatedPage from '@/components/AnimatedPage';
import { useTasks } from '@/hooks/useTasks';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { TaskFilter } from '@/components/tasks/TaskFilter';
import { TaskHeader } from '@/components/tasks/TaskHeader';
import { TaskList } from '@/components/tasks/TaskList';
import { Task, TaskFormValues, PriorityLevel } from '@/types/tasks';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Tasks = () => {
  const { 
    tasks, 
    loading, 
    error, 
    isRefreshing, 
    fetchTasks, 
    addTask, 
    updateTaskItem, 
    removeTask,
    filterTasks
  } = useTasks();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Task dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityLevel[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  
  // Filtered tasks
  const filteredTasks = filterTasks(tasks, searchQuery, selectedPriorities, showCompleted);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view and manage your tasks",
        variant: "destructive"
      });
      // TODO: Consider redirecting to login page
    } else {
      fetchTasks();
    }
  }, [user, fetchTasks, toast]);

  const handleRefresh = () => {
    fetchTasks(true);
  };

  const handleCreateTask = () => {
    setCurrentTask(undefined);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = async (task: Task) => {
    await removeTask(task.id);
  };

  const handleToggleComplete = async (task: Task) => {
    await updateTaskItem(task.id, { completed: !task.completed });
  };

  const handleSubmitTask = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    
    try {
      let success;
      if (currentTask) {
        // Update existing task
        success = await updateTaskItem(currentTask.id, values);
      } else {
        // Create new task
        success = await addTask(values);
      }
      
      if (success) {
        setDialogOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedPriorities([]);
    setShowCompleted(false);
  };

  return (
    <AnimatedPage className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <TaskHeader 
          onRefresh={handleRefresh}
          onCreateTask={handleCreateTask}
          isLoading={loading}
          isRefreshing={isRefreshing}
          isUserLoggedIn={!!user}
        />
        
        {/* Filter Controls */}
        <TaskFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPriorities={selectedPriorities}
          onPriorityChange={setSelectedPriorities}
          showCompleted={showCompleted}
          onShowCompletedChange={setShowCompleted}
        />
        
        {/* Task List */}
        <TaskList 
          tasks={tasks}
          filteredTasks={filteredTasks}
          loading={loading}
          error={error}
          onCreateTask={handleCreateTask}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onClearFilters={handleClearFilters}
          fetchTasks={fetchTasks}
        />
        
        {/* Task Create/Edit Dialog */}
        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmitTask}
          task={currentTask}
          isSubmitting={isSubmitting}
        />
      </main>
    </AnimatedPage>
  );
};

export default Tasks;
