export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string | null
          event_name: string
          event_params: Json | null
          id: string
          page: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_name: string
          event_params?: Json | null
          id?: string
          page?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_name?: string
          event_params?: Json | null
          id?: string
          page?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      article_votes: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          ip_address: string | null
          is_helpful: boolean
          user_id: string | null
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_helpful: boolean
          user_id?: string | null
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_helpful?: boolean
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_votes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "support_articles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      blog_comments: {
        Row: {
          author_email: string | null
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author_email?: string | null
          author_name: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_featured_posts: {
        Row: {
          created_at: string | null
          cta_text: string | null
          cta_url: string | null
          display_order: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          post_id: string
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          post_id: string
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          cta_url?: string | null
          display_order?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          post_id?: string
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_featured_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_likes: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          post_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          post_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          post_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_post_shares: {
        Row: {
          id: string
          post_id: string
          share_type: string | null
          shared_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          post_id: string
          share_type?: string | null
          shared_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          share_type?: string | null
          shared_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_blog_post_tags_post_id"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_blog_post_tags_tag_id"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_views: {
        Row: {
          id: string
          ip_address: string | null
          post_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          post_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          post_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          cover_image_url: string | null
          created_at: string
          id: string
          published_at: string
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published_at?: string
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published_at?: string
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
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
      faq_entries: {
        Row: {
          answer_md: string
          created_at: string | null
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          answer_md: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          answer_md?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
          tags?: string[] | null
          updated_at?: string | null
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
      landing_page_config: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_visible: boolean
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      modal_informativo_config: {
        Row: {
          auto_transition: boolean
          colors: Json | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          show_indicators: boolean
          show_navigation: boolean
          transition_time: number | null
          updated_at: string
          visibility_rules: Json | null
        }
        Insert: {
          auto_transition?: boolean
          colors?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          show_indicators?: boolean
          show_navigation?: boolean
          transition_time?: number | null
          updated_at?: string
          visibility_rules?: Json | null
        }
        Update: {
          auto_transition?: boolean
          colors?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          show_indicators?: boolean
          show_navigation?: boolean
          transition_time?: number | null
          updated_at?: string
          visibility_rules?: Json | null
        }
        Relationships: []
      }
      modal_informativo_slides: {
        Row: {
          created_at: string
          cta_text: string | null
          cta_url: string | null
          description: string | null
          id: string
          is_active: boolean
          media_type: string | null
          media_url: string | null
          modal_id: string
          slide_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          media_type?: string | null
          media_url?: string | null
          modal_id: string
          slide_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_text?: string | null
          cta_url?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          media_type?: string | null
          media_url?: string | null
          modal_id?: string
          slide_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          day_bucket: string
          id: string
          metadata: Json | null
          read_at: string | null
          source_id: string | null
          source_table: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          day_bucket?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          source_id?: string | null
          source_table?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          day_bucket?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          source_id?: string | null
          source_table?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_anchors: {
        Row: {
          anchor_id: string
          created_at: string
          friendly_name: string
          height: number | null
          id: string
          kind: string | null
          last_verified_at: string | null
          route: string
          selector: string | null
          tags: string[] | null
          thumb_url: string | null
          updated_at: string
          width: number | null
        }
        Insert: {
          anchor_id: string
          created_at?: string
          friendly_name: string
          height?: number | null
          id?: string
          kind?: string | null
          last_verified_at?: string | null
          route: string
          selector?: string | null
          tags?: string[] | null
          thumb_url?: string | null
          updated_at?: string
          width?: number | null
        }
        Update: {
          anchor_id?: string
          created_at?: string
          friendly_name?: string
          height?: number | null
          id?: string
          kind?: string | null
          last_verified_at?: string | null
          route?: string
          selector?: string | null
          tags?: string[] | null
          thumb_url?: string | null
          updated_at?: string
          width?: number | null
        }
        Relationships: []
      }
      onboarding_config: {
        Row: {
          audience: string | null
          content: Json
          created_at: string
          enabled: boolean | null
          hide_on_dismiss: boolean | null
          id: string
          is_visible: boolean
          section_key: string
          show_when: string | null
          sync_with_tour: boolean | null
          updated_at: string
          version: string | null
        }
        Insert: {
          audience?: string | null
          content?: Json
          created_at?: string
          enabled?: boolean | null
          hide_on_dismiss?: boolean | null
          id?: string
          is_visible?: boolean
          section_key: string
          show_when?: string | null
          sync_with_tour?: boolean | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          audience?: string | null
          content?: Json
          created_at?: string
          enabled?: boolean | null
          hide_on_dismiss?: boolean | null
          id?: string
          is_visible?: boolean
          section_key?: string
          show_when?: string | null
          sync_with_tour?: boolean | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed: Json | null
          created_at: string | null
          minimized: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: Json | null
          created_at?: string | null
          minimized?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: Json | null
          created_at?: string | null
          minimized?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      onboarding_steps: {
        Row: {
          action_hint: string | null
          action_path: string
          active: boolean | null
          completion_event: string
          created_at: string | null
          description: string
          icon: string | null
          id: number
          key: string
          sort_order: number | null
          target_count: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          action_hint?: string | null
          action_path: string
          active?: boolean | null
          completion_event: string
          created_at?: string | null
          description: string
          icon?: string | null
          id?: number
          key: string
          sort_order?: number | null
          target_count?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          action_hint?: string | null
          action_path?: string
          active?: boolean | null
          completion_event?: string
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: number
          key?: string
          sort_order?: number | null
          target_count?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payables: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          due_date: string
          id: string
          repeats_monthly: boolean | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          repeats_monthly?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          repeats_monthly?: boolean | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_tour_steps: {
        Row: {
          anchor_id: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          page_route: string
          step_key: string
          step_order: number
          title: string
          updated_at: string
          visible_when: string | null
        }
        Insert: {
          anchor_id: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          page_route: string
          step_key: string
          step_order: number
          title: string
          updated_at?: string
          visible_when?: string | null
        }
        Update: {
          anchor_id?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          page_route?: string
          step_key?: string
          step_order?: number
          title?: string
          updated_at?: string
          visible_when?: string | null
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
      shopping_list_items: {
        Row: {
          created_at: string
          id: string
          is_checked: boolean | null
          name: string
          quantity: number | null
          shopping_list_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_checked?: boolean | null
          name: string
          quantity?: number | null
          shopping_list_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_checked?: boolean | null
          name?: string
          quantity?: number | null
          shopping_list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_items_shopping_list_id_fkey"
            columns: ["shopping_list_id"]
            isOneToOne: false
            referencedRelation: "shopping_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_lists: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_articles: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          helpful_votes: number | null
          id: string
          is_featured: boolean | null
          not_helpful_votes: number | null
          reading_time_minutes: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          topic_id: string | null
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          helpful_votes?: number | null
          id?: string
          is_featured?: boolean | null
          not_helpful_votes?: number | null
          reading_time_minutes?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          topic_id?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          helpful_votes?: number | null
          id?: string
          is_featured?: boolean | null
          not_helpful_votes?: number | null
          reading_time_minutes?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          topic_id?: string | null
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "support_articles_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "support_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      support_topics: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ticket_attachments: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number | null
          filename: string
          id: string
          message_id: string | null
          mime_type: string | null
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          message_id?: string | null
          mime_type?: string | null
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          message_id?: string | null
          mime_type?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ticket_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assignee_id: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          sla_due_at: string | null
          status: string | null
          subcategory: string | null
          subject: string
          ticket_number: string | null
          type: string
          updated_at: string | null
          url_context: string | null
          user_id: string
        }
        Insert: {
          assignee_id?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string | null
          subcategory?: string | null
          subject: string
          ticket_number?: string | null
          type: string
          updated_at?: string | null
          url_context?: string | null
          user_id: string
        }
        Update: {
          assignee_id?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          sla_due_at?: string | null
          status?: string | null
          subcategory?: string | null
          subject?: string
          ticket_number?: string | null
          type?: string
          updated_at?: string | null
          url_context?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tour_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          page_route: string | null
          session_id: string | null
          step_key: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          page_route?: string | null
          session_id?: string | null
          step_key?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          page_route?: string | null
          session_id?: string | null
          step_key?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tour_settings: {
        Row: {
          audience: string | null
          created_at: string
          enabled: boolean | null
          hide_on_dismiss: boolean | null
          id: string
          is_active: boolean
          setting_key: string
          setting_value: Json
          show_when: string | null
          updated_at: string
          version: string | null
        }
        Insert: {
          audience?: string | null
          created_at?: string
          enabled?: boolean | null
          hide_on_dismiss?: boolean | null
          id?: string
          is_active?: boolean
          setting_key: string
          setting_value?: Json
          show_when?: string | null
          updated_at?: string
          version?: string | null
        }
        Update: {
          audience?: string | null
          created_at?: string
          enabled?: boolean | null
          hide_on_dismiss?: boolean | null
          id?: string
          is_active?: boolean
          setting_key?: string
          setting_value?: Json
          show_when?: string | null
          updated_at?: string
          version?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          installment_index: number | null
          installment_total: number | null
          is_recurring: boolean | null
          next_due_date: string | null
          recurrence_end_date: string | null
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
          installment_index?: number | null
          installment_total?: number | null
          is_recurring?: boolean | null
          next_due_date?: string | null
          recurrence_end_date?: string | null
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
          installment_index?: number | null
          installment_total?: number | null
          is_recurring?: boolean | null
          next_due_date?: string | null
          recurrence_end_date?: string | null
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
          notification_settings: Json | null
          optional_pages: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          optional_pages?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          optional_pages?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stepper_state: {
        Row: {
          completed: boolean | null
          dismissed: boolean | null
          first_seen_at: string | null
          last_seen_version: string | null
          progress: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          dismissed?: boolean | null
          first_seen_at?: string | null
          last_seen_version?: string | null
          progress?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          dismissed?: boolean | null
          first_seen_at?: string | null
          last_seen_version?: string | null
          progress?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_tour_progress: {
        Row: {
          completed_at: string | null
          completed_steps: number
          created_at: string
          current_step_key: string | null
          id: string
          skipped_at: string | null
          started_at: string | null
          total_steps: number
          tour_version: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: number
          created_at?: string
          current_step_key?: string | null
          id?: string
          skipped_at?: string | null
          started_at?: string | null
          total_steps?: number
          tour_version?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: number
          created_at?: string
          current_step_key?: string | null
          id?: string
          skipped_at?: string | null
          started_at?: string | null
          total_steps?: number
          tour_version?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_tour_state: {
        Row: {
          completed: boolean | null
          dismissed: boolean | null
          first_seen_at: string | null
          last_seen_version: string | null
          last_step: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          dismissed?: boolean | null
          first_seen_at?: string | null
          last_seen_version?: string | null
          last_step?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          dismissed?: boolean | null
          first_seen_at?: string | null
          last_seen_version?: string | null
          last_step?: number | null
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
      anchor_mark_verified: {
        Args: { p_anchor_id: string }
        Returns: undefined
      }
      anchor_upsert: {
        Args: {
          p_anchor_id: string
          p_friendly_name: string
          p_height?: number
          p_kind?: string
          p_route: string
          p_selector?: string
          p_thumb_url?: string
          p_width?: number
        }
        Returns: {
          anchor_id: string
          created_at: string
          friendly_name: string
          height: number | null
          id: string
          kind: string | null
          last_verified_at: string | null
          route: string
          selector: string | null
          tags: string[] | null
          thumb_url: string | null
          updated_at: string
          width: number | null
        }
      }
      anchors_search: {
        Args: {
          p_kind?: string
          p_limit?: number
          p_offset?: number
          p_q?: string
          p_route?: string
        }
        Returns: {
          anchor_id: string
          created_at: string
          friendly_name: string
          height: number | null
          id: string
          kind: string | null
          last_verified_at: string | null
          route: string
          selector: string | null
          tags: string[] | null
          thumb_url: string | null
          updated_at: string
          width: number | null
        }[]
      }
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      get_active_featured_post: {
        Args: Record<PropertyKey, never>
        Returns: {
          cta_text: string
          cta_url: string
          id: string
          post_content: string
          post_cover_image_url: string
          post_id: string
          post_published_at: string
          post_slug: string
          post_subtitle: string
          post_title: string
        }[]
      }
      get_active_users_stats: {
        Args: { period_days?: number }
        Returns: {
          daily_active_users: number
          date: string
          weekly_active_users: number
        }[]
      }
      get_app_interaction_totals: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_saved_dishes: number
          total_shopping_lists: number
          total_transactions: number
        }[]
      }
      get_blog_overall_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_comments: number
          total_posts: number
          total_views: number
        }[]
      }
      get_blog_post_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          author_id: string
          comment_count: number
          created_at: string
          id: string
          published_at: string
          title: string
          view_count: number
        }[]
      }
      get_blog_views_over_time: {
        Args: { days_back?: number }
        Returns: {
          date: string
          views_count: number
        }[]
      }
      get_content_metrics: {
        Args: { date_from: string; date_to: string }
        Returns: Json
      }
      get_detailed_user_stats: {
        Args: { target_user_id: string }
        Returns: {
          content_views: number
          join_date: string
          last_access: string
          posts_created: number
          saved_dishes: number
          shopping_lists_count: number
          total_post_comments: number
          total_post_views: number
        }[]
      }
      get_product_usage_metrics: {
        Args: { date_from: string; date_to: string }
        Returns: Json
      }
      get_public_blog_comments: {
        Args: { target_post_id?: string }
        Returns: {
          author_email: string
          author_name: string
          content: string
          created_at: string
          id: string
          post_id: string
          status: string
          updated_at: string
          user_id: string
        }[]
      }
      get_public_blog_post: {
        Args: { target_post_id: string }
        Returns: {
          content: string
          cover_image_url: string
          created_at: string
          id: string
          like_count: number
          published_at: string
          slug: string
          subtitle: string
          tags: Json
          title: string
          updated_at: string
          user_id: string
        }[]
      }
      get_public_blog_post_by_slug: {
        Args: { target_slug: string }
        Returns: {
          content: string
          cover_image_url: string
          created_at: string
          id: string
          like_count: number
          published_at: string
          slug: string
          subtitle: string
          tags: Json
          title: string
          updated_at: string
          user_id: string
        }[]
      }
      get_public_blog_posts: {
        Args: { page_offset?: number; page_size?: number; search_term?: string }
        Returns: {
          content: string
          cover_image_url: string
          created_at: string
          id: string
          like_count: number
          published_at: string
          slug: string
          subtitle: string
          tags: Json
          title: string
          updated_at: string
          user_id: string
        }[]
      }
      get_signup_metrics: {
        Args: { date_from: string; date_to: string }
        Returns: Json
      }
      get_support_metrics: {
        Args: { date_from: string; date_to: string }
        Returns: Json
      }
      get_user_blog_stats: {
        Args: { target_user_id: string }
        Returns: {
          avg_views_per_post: number
          total_comments: number
          total_posts: number
          total_views: number
        }[]
      }
      get_user_metrics: {
        Args: { period_days?: number }
        Returns: {
          active_users: number
          prev_active_users: number
          prev_subscribers: number
          prev_total_users: number
          subscribers: number
          total_users: number
        }[]
      }
      get_user_metrics_by_dates: {
        Args: {
          comparison_end_date: string
          comparison_start_date: string
          end_date: string
          start_date: string
        }
        Returns: {
          active_users: number
          prev_active_users: number
          prev_subscribers: number
          prev_total_users: number
          subscribers: number
          total_users: number
        }[]
      }
      get_user_retention_cohorts: {
        Args: { weeks_back?: number }
        Returns: {
          cohort_week: string
          users_count: number
          week_0: number
          week_1: number
          week_2: number
          week_3: number
          week_4: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_editor: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_support_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_support_agent: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      manage_user_role: {
        Args: {
          action: string
          target_role: Database["public"]["Enums"]["app_role"]
          target_user_id: string
        }
        Returns: boolean
      }
      mask_email: {
        Args: { email: string; show_full?: boolean }
        Returns: string
      }
      onboarding_visibility: {
        Args: { target_user_id: string }
        Returns: Json
      }
      search_users: {
        Args:
          | {
              role_filter?: string
              search_term?: string
              sort_by?: string
              sort_order?: string
            }
          | { search_term: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          id: string
          roles: string[]
        }[]
      }
      toggle_blog_post_like: {
        Args: {
          ip_address_param?: string
          target_post_id: string
          user_id_param?: string
        }
        Returns: boolean
      }
      unaccent: {
        Args: { "": string }
        Returns: string
      }
      unaccent_init: {
        Args: { "": unknown }
        Returns: unknown
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "editor"
        | "support_agent"
        | "support_admin"
      support_role: "support_agent" | "support_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "editor",
        "support_agent",
        "support_admin",
      ],
      support_role: ["support_agent", "support_admin"],
    },
  },
} as const
