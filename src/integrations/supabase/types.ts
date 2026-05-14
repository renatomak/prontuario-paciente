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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      calendario: {
        Row: {
          cd_calendario: number
          ds_calendario: string
        }
        Insert: {
          cd_calendario?: number
          ds_calendario: string
        }
        Update: {
          cd_calendario?: number
          ds_calendario?: string
        }
        Relationships: []
      }
      cidade: {
        Row: {
          cod_cid: number
          cod_est: number
          descricao: string
        }
        Insert: {
          cod_cid?: number
          cod_est: number
          descricao: string
        }
        Update: {
          cod_cid?: number
          cod_est?: number
          descricao?: string
        }
        Relationships: [
          {
            foreignKeyName: "cidade_cod_est_fkey"
            columns: ["cod_est"]
            isOneToOne: false
            referencedRelation: "estado"
            referencedColumns: ["cod_est"]
          },
        ]
      }
      endereco_usuario_cadsus: {
        Row: {
          cd_endereco: number
          cd_tipo_logradouro: number | null
          cep: string | null
          cod_cid: number | null
          keyword: string | null
          nm_bairro: string | null
          nm_comp_logradouro: string | null
          nm_logradouro: string | null
          nr_logradouro: string | null
        }
        Insert: {
          cd_endereco?: number
          cd_tipo_logradouro?: number | null
          cep?: string | null
          cod_cid?: number | null
          keyword?: string | null
          nm_bairro?: string | null
          nm_comp_logradouro?: string | null
          nm_logradouro?: string | null
          nr_logradouro?: string | null
        }
        Update: {
          cd_endereco?: number
          cd_tipo_logradouro?: number | null
          cep?: string | null
          cod_cid?: number | null
          keyword?: string | null
          nm_bairro?: string | null
          nm_comp_logradouro?: string | null
          nm_logradouro?: string | null
          nr_logradouro?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "endereco_usuario_cadsus_cd_tipo_logradouro_fkey"
            columns: ["cd_tipo_logradouro"]
            isOneToOne: false
            referencedRelation: "tipo_logradouro_cadsus"
            referencedColumns: ["cd_tipo_logradouro"]
          },
          {
            foreignKeyName: "endereco_usuario_cadsus_cod_cid_fkey"
            columns: ["cod_cid"]
            isOneToOne: false
            referencedRelation: "cidade"
            referencedColumns: ["cod_cid"]
          },
        ]
      }
      estado: {
        Row: {
          cod_est: number
          nome: string
          sigla: string
        }
        Insert: {
          cod_est?: number
          nome: string
          sigla: string
        }
        Update: {
          cod_est?: number
          nome?: string
          sigla?: string
        }
        Relationships: []
      }
      fabricante: {
        Row: {
          cd_fabricante: number
          cnpj: string | null
          ds_fabricante: string
        }
        Insert: {
          cd_fabricante?: number
          cnpj?: string | null
          ds_fabricante: string
        }
        Update: {
          cd_fabricante?: number
          cnpj?: string | null
          ds_fabricante?: string
        }
        Relationships: []
      }
      profissional: {
        Row: {
          cd_profissional: number
          cns: string | null
          conselho: string | null
          nome: string
          registro: string | null
        }
        Insert: {
          cd_profissional?: number
          cns?: string | null
          conselho?: string | null
          nome: string
          registro?: string | null
        }
        Update: {
          cd_profissional?: number
          cns?: string | null
          conselho?: string | null
          nome?: string
          registro?: string | null
        }
        Relationships: []
      }
      tipo_logradouro_cadsus: {
        Row: {
          cd_tipo_logradouro: number
          ds_tipo_logradouro: string
        }
        Insert: {
          cd_tipo_logradouro?: number
          ds_tipo_logradouro: string
        }
        Update: {
          cd_tipo_logradouro?: number
          ds_tipo_logradouro?: string
        }
        Relationships: []
      }
      tipo_vacina: {
        Row: {
          cd_tipo_vacina: number
          ds_vacina: string
        }
        Insert: {
          cd_tipo_vacina?: number
          ds_vacina: string
        }
        Update: {
          cd_tipo_vacina?: number
          ds_vacina?: string
        }
        Relationships: []
      }
      unidade: {
        Row: {
          cd_unidade: number
          cnes: string | null
          nome: string
        }
        Insert: {
          cd_unidade?: number
          cnes?: string | null
          nome: string
        }
        Update: {
          cd_unidade?: number
          cnes?: string | null
          nome?: string
        }
        Relationships: []
      }
      usuario_cadsus: {
        Row: {
          cd_endereco: number | null
          cd_usu_cadsus: number
          cpf: string | null
          dt_nascimento: string | null
          nm_mae: string | null
          nm_pai: string | null
          nm_usuario: string
          nr_telefone: string | null
          sg_sexo: string | null
        }
        Insert: {
          cd_endereco?: number | null
          cd_usu_cadsus?: number
          cpf?: string | null
          dt_nascimento?: string | null
          nm_mae?: string | null
          nm_pai?: string | null
          nm_usuario: string
          nr_telefone?: string | null
          sg_sexo?: string | null
        }
        Update: {
          cd_endereco?: number | null
          cd_usu_cadsus?: number
          cpf?: string | null
          dt_nascimento?: string | null
          nm_mae?: string | null
          nm_pai?: string | null
          nm_usuario?: string
          nr_telefone?: string | null
          sg_sexo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuario_cadsus_cd_endereco_fkey"
            columns: ["cd_endereco"]
            isOneToOne: false
            referencedRelation: "endereco_usuario_cadsus"
            referencedColumns: ["cd_endereco"]
          },
        ]
      }
      vac_aplicacao: {
        Row: {
          cd_calendario: number | null
          cd_doses: number | null
          cd_fabricante: number | null
          cd_profissional: number | null
          cd_tipo_vacina: number | null
          cd_unidade: number | null
          cd_usu_cadsus: number
          cd_vac_aplicacao: number
          ds_vacina: string | null
          dt_aplicacao: string
          dt_validade: string | null
          fora_esquema: boolean | null
          gestante: boolean | null
          grupo_atendimento: string | null
          historico: boolean | null
          local_aplicacao: string | null
          local_atendimento: string | null
          lote: string | null
          novo_frasco: boolean | null
          nr_atendimento: string | null
          observacao: string | null
          puerpera: boolean | null
          rnds_situacao: string | null
          rnds_uuid: string | null
          status: number | null
          turno: string | null
          via_administracao: string | null
          viajante: boolean | null
        }
        Insert: {
          cd_calendario?: number | null
          cd_doses?: number | null
          cd_fabricante?: number | null
          cd_profissional?: number | null
          cd_tipo_vacina?: number | null
          cd_unidade?: number | null
          cd_usu_cadsus: number
          cd_vac_aplicacao?: number
          ds_vacina?: string | null
          dt_aplicacao: string
          dt_validade?: string | null
          fora_esquema?: boolean | null
          gestante?: boolean | null
          grupo_atendimento?: string | null
          historico?: boolean | null
          local_aplicacao?: string | null
          local_atendimento?: string | null
          lote?: string | null
          novo_frasco?: boolean | null
          nr_atendimento?: string | null
          observacao?: string | null
          puerpera?: boolean | null
          rnds_situacao?: string | null
          rnds_uuid?: string | null
          status?: number | null
          turno?: string | null
          via_administracao?: string | null
          viajante?: boolean | null
        }
        Update: {
          cd_calendario?: number | null
          cd_doses?: number | null
          cd_fabricante?: number | null
          cd_profissional?: number | null
          cd_tipo_vacina?: number | null
          cd_unidade?: number | null
          cd_usu_cadsus?: number
          cd_vac_aplicacao?: number
          ds_vacina?: string | null
          dt_aplicacao?: string
          dt_validade?: string | null
          fora_esquema?: boolean | null
          gestante?: boolean | null
          grupo_atendimento?: string | null
          historico?: boolean | null
          local_aplicacao?: string | null
          local_atendimento?: string | null
          lote?: string | null
          novo_frasco?: boolean | null
          nr_atendimento?: string | null
          observacao?: string | null
          puerpera?: boolean | null
          rnds_situacao?: string | null
          rnds_uuid?: string | null
          status?: number | null
          turno?: string | null
          via_administracao?: string | null
          viajante?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "vac_aplicacao_cd_calendario_fkey"
            columns: ["cd_calendario"]
            isOneToOne: false
            referencedRelation: "calendario"
            referencedColumns: ["cd_calendario"]
          },
          {
            foreignKeyName: "vac_aplicacao_cd_fabricante_fkey"
            columns: ["cd_fabricante"]
            isOneToOne: false
            referencedRelation: "fabricante"
            referencedColumns: ["cd_fabricante"]
          },
          {
            foreignKeyName: "vac_aplicacao_cd_profissional_fkey"
            columns: ["cd_profissional"]
            isOneToOne: false
            referencedRelation: "profissional"
            referencedColumns: ["cd_profissional"]
          },
          {
            foreignKeyName: "vac_aplicacao_cd_tipo_vacina_fkey"
            columns: ["cd_tipo_vacina"]
            isOneToOne: false
            referencedRelation: "tipo_vacina"
            referencedColumns: ["cd_tipo_vacina"]
          },
          {
            foreignKeyName: "vac_aplicacao_cd_unidade_fkey"
            columns: ["cd_unidade"]
            isOneToOne: false
            referencedRelation: "unidade"
            referencedColumns: ["cd_unidade"]
          },
          {
            foreignKeyName: "vac_aplicacao_cd_usu_cadsus_fkey"
            columns: ["cd_usu_cadsus"]
            isOneToOne: false
            referencedRelation: "usuario_cadsus"
            referencedColumns: ["cd_usu_cadsus"]
          },
        ]
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
    Enums: {},
  },
} as const
