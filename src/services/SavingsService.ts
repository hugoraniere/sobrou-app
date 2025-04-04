
import { supabase } from "@/integrations/supabase/client";

export interface SavingGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SavingTransaction {
  id: string;
  saving_goal_id: string;
  user_id: string;
  amount: number;
  date: string;
  created_at: string;
}

export const SavingsService = {
  // Get all saving goals for the current user
  async getSavingGoals(): Promise<SavingGoal[]> {
    const { data, error } = await supabase
      .from('saving_goals')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching saving goals:', error);
      throw error;
    }
    
    return data as SavingGoal[] || [];
  },
  
  // Add a new saving goal
  async addSavingGoal(goal: Pick<SavingGoal, 'name' | 'target_amount'>): Promise<SavingGoal> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create a saving goal');
    }
    
    const { data, error } = await supabase
      .from('saving_goals')
      .insert([{
        name: goal.name,
        target_amount: goal.target_amount,
        current_amount: 0,
        completed: false,
        user_id: user.id
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error adding saving goal:', error);
      throw error;
    }
    
    return data as SavingGoal;
  },
  
  // Add money to a saving goal
  async addToSavingGoal(goalId: string, amount: number, date: string): Promise<SavingGoal> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to update a saving goal');
    }
    
    // First, add the transaction
    const { error: transactionError } = await supabase
      .from('saving_transactions')
      .insert([{
        saving_goal_id: goalId,
        amount,
        date,
        user_id: user.id
      }]);
      
    if (transactionError) {
      console.error('Error adding saving transaction:', transactionError);
      throw transactionError;
    }
    
    // Then, update the goal's current amount
    const { data: goal, error: goalError } = await supabase
      .from('saving_goals')
      .select('*')
      .eq('id', goalId)
      .single();
      
    if (goalError) {
      console.error('Error fetching saving goal:', goalError);
      throw goalError;
    }
    
    const typedGoal = goal as SavingGoal;
    const newAmount = typedGoal.current_amount + amount;
    const completed = newAmount >= typedGoal.target_amount;
    
    const { data: updatedGoal, error: updateError } = await supabase
      .from('saving_goals')
      .update({
        current_amount: newAmount,
        completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating saving goal:', updateError);
      throw updateError;
    }
    
    return updatedGoal as SavingGoal;
  },
  
  // Find or create a saving goal by name
  async findOrCreateSavingGoal(name: string, targetAmount = 1000): Promise<SavingGoal> {
    // First, try to find the goal by name
    const { data: existingGoals, error: findError } = await supabase
      .from('saving_goals')
      .select('*')
      .ilike('name', name)
      .limit(1);
      
    if (findError) {
      console.error('Error finding saving goal:', findError);
      throw findError;
    }
    
    // If found, return the first match
    if (existingGoals && existingGoals.length > 0) {
      return existingGoals[0] as SavingGoal;
    }
    
    // Otherwise, create a new goal
    return this.addSavingGoal({
      name,
      target_amount: targetAmount
    });
  },
  
  // Get transactions for a specific saving goal
  async getSavingTransactions(goalId: string): Promise<SavingTransaction[]> {
    const { data, error } = await supabase
      .from('saving_transactions')
      .select('*')
      .eq('saving_goal_id', goalId)
      .order('date', { ascending: false });
      
    if (error) {
      console.error('Error fetching saving transactions:', error);
      throw error;
    }
    
    return data as SavingTransaction[] || [];
  },
  
  // Mark a saving goal as complete or incomplete
  async toggleSavingGoalCompletion(goalId: string, completed: boolean): Promise<SavingGoal> {
    const { data, error } = await supabase
      .from('saving_goals')
      .update({
        completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating saving goal completion:', error);
      throw error;
    }
    
    return data as SavingGoal;
  },
  
  // Get total savings amount
  async getTotalSavings(): Promise<number> {
    const { data, error } = await supabase
      .from('saving_goals')
      .select('current_amount');
      
    if (error) {
      console.error('Error fetching total savings:', error);
      throw error;
    }
    
    return (data as SavingGoal[])?.reduce((total, goal) => total + goal.current_amount, 0) || 0;
  }
};
