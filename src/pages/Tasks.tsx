
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { AnimatePresence } from 'framer-motion';
import AnimatedPage from '@/components/AnimatedPage';
import { useTasks } from '@/hooks/useTasks';
import { TasksLoading } from '@/components/tasks/TasksLoading';
import { TasksEmpty } from '@/components/tasks/TasksEmpty';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { TaskFilter } from '@/components/tasks/TaskFilter';
import { Task, TaskFormValues, PriorityLevel } from '@/types/tasks';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
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

  return (
    <AnimatedPage className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Task Management</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="hidden sm:flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button
              onClick={handleCreateTask}
              className="flex items-center gap-2"
              disabled={!user}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>
        
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
        <AnimatePresence mode="wait">
          {loading ? (
            <TasksLoading />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button variant="outline" onClick={() => fetchTasks()}>
                Try Again
              </Button>
            </div>
          ) : filteredTasks.length === 0 ? (
            tasks.length === 0 ? (
              <TasksEmpty onCreateTask={handleCreateTask} />
            ) : (
              <div className="text-center py-12 mt-6">
                <p className="text-gray-500">No tasks match your filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPriorities([]);
                    setShowCompleted(false);
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )
          ) : (
            <div className="space-y-1 mt-4">
              <AnimatePresence initial={false}>
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
        
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
