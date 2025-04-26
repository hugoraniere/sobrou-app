
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { transactions } = await req.json()
    
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No transactions provided or invalid format',
          insights: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    console.log(`Processing ${transactions.length} transactions for insights`)

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      console.error('Error: Missing OpenAI API key')
      throw new Error('Missing OpenAI API key')
    }

    // Calculate basic financial metrics for context
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const balance = totalIncome - totalExpense
    
    // Group transactions by category for expense analysis
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {} as Record<string, number>)
    
    // Sort categories by amount spent
    const topCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    
    // Format transaction data for OpenAI
    const transactionSummary = {
      totalExpense,
      totalIncome,
      balance,
      transactionCount: transactions.length,
      topCategories,
      recentTransactions: transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
    }

    // Call OpenAI to generate insights
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a financial analyst AI that provides personalized insights based on transaction data. 
            Generate 3-5 specific, actionable insights from the user's transaction data. 
            Each insight should be categorized as one of: "warning", "opportunity", "pattern", "suggestion", or "achievement".
            
            Format the response as a JSON array of objects with the following structure:
            [{
              "title": "Brief attention-grabbing title",
              "description": "Detailed explanation with specific amounts and percentages when relevant",
              "category": "warning|opportunity|pattern|suggestion|achievement",
              "priority": 1-5 (1 being highest priority)
            }]
            
            Focus on:
            1. Unusual spending patterns
            2. Budget opportunities
            3. Saving recommendations
            4. Income/expense ratio
            5. Category-specific insights
            
            Be very specific with numbers and actionable advice. Use the actual transaction data.`
          },
          {
            role: 'user',
            content: JSON.stringify(transactionSummary)
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    })

    const data = await response.json()
    
    if (data.error) {
      console.error('OpenAI API error:', data.error)
      throw new Error(`OpenAI API error: ${data.error.message || 'Unknown error'}`)
    }
    
    console.log('Successfully generated insights')
    
    let insights = []
    try {
      const content = data.choices[0].message.content
      insights = JSON.parse(content).insights || []
    } catch (error) {
      console.error('Error parsing OpenAI response:', error)
      throw new Error('Error parsing OpenAI response')
    }

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating insights:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error', 
        insights: [] 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
