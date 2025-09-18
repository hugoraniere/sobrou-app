-- Fase 1: Estrutura do Banco - Padronizar configurações e estados por usuário

-- Criar tabelas de estado por usuário
CREATE TABLE IF NOT EXISTS user_tour_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  last_step INTEGER DEFAULT 0,
  last_seen_version TEXT DEFAULT NULL,
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_stepper_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  progress JSONB DEFAULT '{}'::jsonb,
  last_seen_version TEXT DEFAULT NULL,
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar configurações de visibilidade ao tour_settings
ALTER TABLE tour_settings 
ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS show_when TEXT CHECK (show_when IN ('first_login','until_complete','always')) DEFAULT 'first_login',
ADD COLUMN IF NOT EXISTS audience TEXT CHECK (audience IN ('new_users','all_users')) DEFAULT 'new_users',
ADD COLUMN IF NOT EXISTS hide_on_dismiss BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0';

-- Adicionar configurações similares para onboarding_config (stepper)
ALTER TABLE onboarding_config
ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_when TEXT CHECK (show_when IN ('first_login','until_complete','always')) DEFAULT 'until_complete',
ADD COLUMN IF NOT EXISTS audience TEXT CHECK (audience IN ('new_users','all_users')) DEFAULT 'all_users',
ADD COLUMN IF NOT EXISTS hide_on_dismiss BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS sync_with_tour BOOLEAN DEFAULT false;

-- RPC para verificar visibilidade do onboarding
CREATE OR REPLACE FUNCTION onboarding_visibility(target_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tour_config RECORD;
  stepper_config RECORD;
  tour_state RECORD;
  stepper_state RECORD;
  user_created_at TIMESTAMPTZ;
  is_new_user BOOLEAN;
  show_tour BOOLEAN := false;
  show_stepper BOOLEAN := false;
  tour_reason TEXT := 'disabled';
  stepper_reason TEXT := 'disabled';
BEGIN
  -- Buscar data de criação do usuário
  SELECT created_at INTO user_created_at 
  FROM auth.users 
  WHERE id = target_user_id;
  
  -- Determinar se é usuário novo (criado nos últimos 7 dias ou sem tour_state)
  is_new_user := (user_created_at >= now() - interval '7 days') OR 
                 NOT EXISTS (SELECT 1 FROM user_tour_state WHERE user_id = target_user_id);
  
  -- Buscar configuração do Product Tour
  SELECT setting_value->>'enabled' AS enabled,
         setting_value->>'show_when' AS show_when,
         setting_value->>'audience' AS audience,
         setting_value->>'hide_on_dismiss' AS hide_on_dismiss,
         setting_value->>'version' AS version
  INTO tour_config
  FROM tour_settings 
  WHERE setting_key = 'general' AND is_active = true
  LIMIT 1;
  
  -- Buscar configuração do Stepper
  SELECT content->>'enabled' AS enabled,
         content->>'show_when' AS show_when,
         content->>'audience' AS audience,
         content->>'hide_on_dismiss' AS hide_on_dismiss,
         content->>'sync_with_tour' AS sync_with_tour,
         content->>'version' AS version
  INTO stepper_config
  FROM onboarding_config 
  WHERE section_key = 'general' AND is_visible = true
  LIMIT 1;
  
  -- Buscar estado do usuário para tour
  SELECT * INTO tour_state
  FROM user_tour_state 
  WHERE user_id = target_user_id;
  
  -- Buscar estado do usuário para stepper
  SELECT * INTO stepper_state
  FROM user_stepper_state 
  WHERE user_id = target_user_id;
  
  -- Lógica de visibilidade do Product Tour
  IF tour_config.enabled::boolean = true THEN
    IF tour_state.dismissed = true AND tour_config.hide_on_dismiss::boolean = true THEN
      tour_reason := 'dismissed';
    ELSIF tour_state.completed = true AND tour_config.show_when != 'always' THEN
      tour_reason := 'completed';
    ELSIF tour_config.audience = 'new_users' AND NOT is_new_user THEN
      tour_reason := 'not-eligible';
    ELSIF tour_config.show_when = 'first_login' AND tour_state.first_seen_at IS NOT NULL THEN
      tour_reason := 'already-seen';
    ELSE
      show_tour := true;
      tour_reason := 'live';
    END IF;
  END IF;
  
  -- Lógica de visibilidade do Stepper
  IF stepper_config.sync_with_tour::boolean = true THEN
    -- Se sincronizado, usar mesma lógica do tour
    show_stepper := show_tour;
    stepper_reason := tour_reason;
  ELSIF stepper_config.enabled::boolean = true THEN
    IF stepper_state.dismissed = true AND stepper_config.hide_on_dismiss::boolean = true THEN
      stepper_reason := 'dismissed';
    ELSIF stepper_state.completed = true AND stepper_config.show_when != 'always' THEN
      stepper_reason := 'completed';
    ELSIF stepper_config.audience = 'new_users' AND NOT is_new_user THEN
      stepper_reason := 'not-eligible';
    ELSIF stepper_config.show_when = 'first_login' AND stepper_state.first_seen_at IS NOT NULL THEN
      stepper_reason := 'already-seen';
    ELSE
      show_stepper := true;
      stepper_reason := 'live';
    END IF;
  END IF;
  
  -- Inserir/atualizar first_seen_at se necessário
  IF show_tour AND tour_state.user_id IS NULL THEN
    INSERT INTO user_tour_state (user_id, first_seen_at) 
    VALUES (target_user_id, now())
    ON CONFLICT (user_id) DO UPDATE SET first_seen_at = COALESCE(user_tour_state.first_seen_at, now());
  END IF;
  
  IF show_stepper AND stepper_state.user_id IS NULL THEN
    INSERT INTO user_stepper_state (user_id, first_seen_at) 
    VALUES (target_user_id, now())
    ON CONFLICT (user_id) DO UPDATE SET first_seen_at = COALESCE(user_stepper_state.first_seen_at, now());
  END IF;
  
  RETURN json_build_object(
    'showProductTour', show_tour,
    'showStepper', show_stepper,
    'tourReason', tour_reason,
    'stepperReason', stepper_reason,
    'version', COALESCE(tour_config.version, '1.0'),
    'isNewUser', is_new_user
  );
END;
$$;

-- RLS para as novas tabelas
ALTER TABLE user_tour_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stepper_state ENABLE ROW LEVEL SECURITY;

-- Políticas para user_tour_state
CREATE POLICY "Users can manage their own tour state" ON user_tour_state
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tour states" ON user_tour_state
  FOR SELECT USING (is_admin());

-- Políticas para user_stepper_state  
CREATE POLICY "Users can manage their own stepper state" ON user_stepper_state
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all stepper states" ON user_stepper_state
  FOR SELECT USING (is_admin());

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_tour_state_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_tour_state_updated_at
  BEFORE UPDATE ON user_tour_state
  FOR EACH ROW EXECUTE FUNCTION update_tour_state_updated_at();

CREATE TRIGGER update_user_stepper_state_updated_at
  BEFORE UPDATE ON user_stepper_state
  FOR EACH ROW EXECUTE FUNCTION update_tour_state_updated_at();