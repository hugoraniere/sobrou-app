
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
  user_id: string;
  saving_goal_id: string;
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
  async createSavingGoal(name: string, targetAmount: number): Promise<SavingGoal> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create a saving goal');
    }
    
    const { data, error } = await supabase
      .from('saving_goals')
      .insert([{
        name,
        target_amount: targetAmount,
        current_amount: 0,
        completed: false,
        user_id: user.id
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating saving goal:', error);
      throw error;
    }
    
    return data as SavingGoal;
  },
  
  // Add money to a saving goal
  async addToSavingGoal(goalId: string, amount: number, date: string = new Date().toISOString().split('T')[0]): Promise<SavingGoal> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to add to a saving goal');
    }
    
    // Start a transaction
    // 1. Add a saving transaction
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
    
    // 2. Update the saving goal's current amount
    // First get the current amount
    const { data: goalData, error: getGoalError } = await supabase
      .from('saving_goals')
      .select('current_amount')
      .eq('id', goalId)
      .single();
      
    if (getGoalError) {
      console.error('Error getting saving goal:', getGoalError);
      throw getGoalError;
    }
    
    const currentAmount = goalData.current_amount as number;
    const newAmount = currentAmount + amount;
    
    // Then update the goal with the new amount
    const { data: goal, error: updateError } = await supabase
      .from('saving_goals')
      .update({ current_amount: newAmount })
      .eq('id', goalId)
      .select()
      .single();
      
    if (updateError) {
      console.error('Error updating saving goal:', updateError);
      throw updateError;
    }
    
    return goal as SavingGoal;
  },
  
  // Find a saving goal by name, or create it if it doesn't exist
  async findOrCreateSavingGoal(name: string, targetAmount: number = 1000): Promise<SavingGoal> {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to find or create a saving goal');
    }
    
    // Try to find the goal by name
    const { data: goals } = await supabase
      .from('saving_goals')
      .select('*')
      .eq('name', name)
      .eq('user_id', user.id);
      
    // If the goal exists, return it
    if (goals && goals.length > 0) {
      return goals[0] as SavingGoal;
    }
    
    // Otherwise, create a new goal
    return this.createSavingGoal(name, targetAmount);
  },
  
  // Update a saving goal
  async updateSavingGoal(id: string, updates: Partial<SavingGoal>): Promise<SavingGoal> {
    const { data, error } = await supabase
      .from('saving_goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating saving goal:', error);
      throw error;
    }
    
    return data as SavingGoal;
  },
  
  // Toggle the completion status of a saving goal
  async toggleSavingGoalCompletion(id: string, completed: boolean): Promise<SavingGoal> {
    return this.updateSavingGoal(id, { completed });
  },
  
  // Get all transactions for a saving goal
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
  }
};
