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
      admin_settings: {
        Row: {
          id: number
          three_month_cashback: number
          updated_at: string | null
        }
        Insert: {
          id?: number
          three_month_cashback?: number
          updated_at?: string | null
        }
        Update: {
          id?: number
          three_month_cashback?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      emi_transactions: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string
          emi_number: number
          financing_id: string
          id: string
          payment_date: string | null
          payment_status: string
          recharge_id: string
          reminder_sent: boolean | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date: string
          emi_number: number
          financing_id: string
          id?: string
          payment_date?: string | null
          payment_status?: string
          recharge_id: string
          reminder_sent?: boolean | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string
          emi_number?: number
          financing_id?: string
          id?: string
          payment_date?: string | null
          payment_status?: string
          recharge_id?: string
          reminder_sent?: boolean | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emi_transactions_financing_id_fkey"
            columns: ["financing_id"]
            isOneToOne: false
            referencedRelation: "financing_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emi_transactions_recharge_id_fkey"
            columns: ["recharge_id"]
            isOneToOne: false
            referencedRelation: "user_recharges"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_settings: {
        Row: {
          cashback_amount: number
          default_emi_count: number
          default_gst_percentage: number
          default_processing_fee: number
          id: number
          updated_at: string | null
        }
        Insert: {
          cashback_amount?: number
          default_emi_count?: number
          default_gst_percentage?: number
          default_processing_fee?: number
          id?: number
          updated_at?: string | null
        }
        Update: {
          cashback_amount?: number
          default_emi_count?: number
          default_gst_percentage?: number
          default_processing_fee?: number
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      financing_options: {
        Row: {
          created_at: string | null
          discounted_price: number
          emi_amount: number
          emi_count: number
          gst_percentage: number
          id: string
          initial_payment: number
          is_active: boolean | null
          plan_id: string
          processing_fee: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discounted_price: number
          emi_amount: number
          emi_count?: number
          gst_percentage?: number
          id?: string
          initial_payment: number
          is_active?: boolean | null
          plan_id: string
          processing_fee?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discounted_price?: number
          emi_amount?: number
          emi_count?: number
          gst_percentage?: number
          id?: string
          initial_payment?: number
          is_active?: boolean | null
          plan_id?: string
          processing_fee?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financing_options_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: true
            referencedRelation: "recharge_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          full_name: string | null
          id: string
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          full_name?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          full_name?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recharge_plans: {
        Row: {
          amount: number
          calls: string
          created_at: string | null
          data: string
          description: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          operator_id: string
          sms: string
          updated_at: string | null
          validity_days: number
        }
        Insert: {
          amount: number
          calls: string
          created_at?: string | null
          data: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          operator_id: string
          sms: string
          updated_at?: string | null
          validity_days: number
        }
        Update: {
          amount?: number
          calls?: string
          created_at?: string | null
          data?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          operator_id?: string
          sms?: string
          updated_at?: string | null
          validity_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "recharge_plans_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "telecom_operators"
            referencedColumns: ["id"]
          },
        ]
      }
      telecom_operators: {
        Row: {
          created_at: string | null
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      user_recharges: {
        Row: {
          created_at: string | null
          id: string
          is_financing: boolean | null
          payment_status: string
          phone_number: string
          plan_id: string
          total_amount: number
          transaction_id: string | null
          updated_at: string | null
          user_id: string
          wallet_amount_used: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_financing?: boolean | null
          payment_status?: string
          phone_number: string
          plan_id: string
          total_amount: number
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
          wallet_amount_used?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          is_financing?: boolean | null
          payment_status?: string
          phone_number?: string
          plan_id?: string
          total_amount?: number
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_amount_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_recharges_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "recharge_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_balance: {
        Row: {
          balance: number
          id: string
          updated_at: string | null
          use_wallet_for_recharge: boolean
          user_id: string
        }
        Insert: {
          balance?: number
          id?: string
          updated_at?: string | null
          use_wallet_for_recharge?: boolean
          user_id: string
        }
        Update: {
          balance?: number
          id?: string
          updated_at?: string | null
          use_wallet_for_recharge?: boolean
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          reference: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          reference?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          reference?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_emi_schedule: {
        Args: {
          p_recharge_id: string
          p_user_id: string
          p_financing_id: string
          p_emi_amount: number
          p_emi_count: number
        }
        Returns: undefined
      }
      process_financed_recharge: {
        Args: {
          p_user_id: string
          p_plan_id: string
          p_phone_number: string
          p_is_financing: boolean
          p_financing_id?: string
          p_wallet_amount?: number
          p_transaction_id?: string
        }
        Returns: Json
      }
      process_recharge: {
        Args: {
          p_user_id: string
          p_plan_id: string
          p_plan_name: string
          p_plan_amount: number
          p_wallet_amount: number
          p_is_three_month: boolean
          p_provider: string
        }
        Returns: Json
      }
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
