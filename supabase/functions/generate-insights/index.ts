import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    console.log(`Generating insights for user: ${user.id}`)

    // Get user transactions for analysis
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(100)

    if (transactionsError) {
      throw new Error('Failed to fetch transactions')
    }

    // Generate basic insights
    const insights = {
      totalTransactions: transactions.length,
      totalExpenses: transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      totalIncome: transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      categorySummary: transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount
          return acc
        }, {} as Record<string, number>),
      monthlyAverage: calculateMonthlyAverage(transactions),
      topCategories: getTopCategories(transactions),
      trend: calculateTrend(transactions)
    }

    console.log('Generated insights:', insights)

    return new Response(
      JSON.stringify({
        success: true,
        data: insights
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error generating insights:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

function calculateMonthlyAverage(transactions: any[]): number {
  if (transactions.length === 0) return 0
  
  const expenses = transactions.filter(t => t.type === 'expense')
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)
  
  // Get unique months
  const months = new Set(expenses.map(t => t.date.substring(0, 7)))
  
  return months.size > 0 ? totalExpenses / months.size : 0
}

function getTopCategories(transactions: any[]): Array<{category: string, amount: number}> {
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount: Number(amount) }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
}

function calculateTrend(transactions: any[]): string {
  if (transactions.length < 2) return 'insufficient_data'
  
  const expenses = transactions.filter(t => t.type === 'expense')
  if (expenses.length < 2) return 'insufficient_data'
  
  // Compare last month vs previous month
  const now = new Date()
  const currentMonth = now.getMonth()
  const previousMonth = currentMonth - 1
  
  const currentMonthExpenses = expenses.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() === currentMonth
  })
  
  const previousMonthExpenses = expenses.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate.getMonth() === previousMonth
  })
  
  const currentTotal = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0)
  const previousTotal = previousMonthExpenses.reduce((sum, t) => sum + t.amount, 0)
  
  if (previousTotal === 0) return 'insufficient_data'
  
  const change = ((currentTotal - previousTotal) / previousTotal) * 100
  
  if (change > 10) return 'increasing'
  if (change < -10) return 'decreasing'
  return 'stable'
}