export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bill_transactions: {
        Row: {
          amount: number
          bill_id: string
          created_at: string
          description: string
          id: string
          transaction_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          bill_id: string
          created_at?: string
          description: string
          id?: string
          transaction_date?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          bill_id?: string
          created_at?: string
          description?: string
          id?: string
          transaction_date?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bill_transactions_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills_to_pay"
            referencedColumns: ["id"]
          },
        ]
      }
      bills_to_pay: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          due_date: string
          id: string
          is_paid: boolean
          is_recurring: boolean | null
          next_due_date: string | null
          notes: string | null
          paid_date: string | null
          recurrence_frequency: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          is_paid?: boolean
          is_recurring?: boolean | null
          next_due_date?: string | null
          notes?: string | null
          paid_date?: string | null
          recurrence_frequency?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          is_paid?: boolean
          is_recurring?: boolean | null
          next_due_date?: string | null
          notes?: string | null
          paid_date?: string | null
          recurrence_frequency?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dish_ingredients: {
        Row: {
          created_at: string | null
          dish_id: string
          id: string
          ingredient_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          dish_id: string
          id?: string
          ingredient_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          dish_id?: string
          id?: string
          ingredient_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "dish_ingredients_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dish_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      dishes: {
        Row: {
          created_at: string | null
          description: string | null
          desired_margin_percentage: number
          id: string
          name: string
          operational_cost_percentage: number
          tax_percentage: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          desired_margin_percentage?: number
          id?: string
          name: string
          operational_cost_percentage?: number
          tax_percentage?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          desired_margin_percentage?: number
          id?: string
          name?: string
          operational_cost_percentage?: number
          tax_percentage?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ingredients: {
        Row: {
          created_at: string | null
          id: string
          name: string
          price: number
          quantity_purchased: number | null
          total_price: number | null
          unit: string
          updated_at: string | null
          user_id: string
          waste_percentage: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          price: number
          quantity_purchased?: number | null
          total_price?: number | null
          unit: string
          updated_at?: string | null
          user_id: string
          waste_percentage?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          price?: number
          quantity_purchased?: number | null
          total_price?: number | null
          unit?: string
          updated_at?: string | null
          user_id?: string
          waste_percentage?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      saving_goals: {
        Row: {
          completed: boolean
          created_at: string
          current_amount: number
          id: string
          name: string
          target_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          current_amount?: number
          id?: string
          name: string
          target_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          current_amount?: number
          id?: string
          name?: string
          target_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saving_transactions: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          saving_goal_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date?: string
          id?: string
          saving_goal_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          saving_goal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saving_transactions_saving_goal_id_fkey"
            columns: ["saving_goal_id"]
            isOneToOne: false
            referencedRelation: "saving_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          is_recurring: boolean | null
          next_due_date: string | null
          recurrence_frequency: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date?: string
          description: string
          id?: string
          is_recurring?: boolean | null
          next_due_date?: string | null
          recurrence_frequency?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          is_recurring?: boolean | null
          next_due_date?: string | null
          recurrence_frequency?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          optional_pages: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          optional_pages?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          optional_pages?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
