-- Inserir dados de teste para âncoras
INSERT INTO public.onboarding_anchors 
  (route, anchor_id, friendly_name, selector, width, height, kind, tags)
VALUES 
  ('/', 'home-hero-button', 'Botão Principal Hero', '[data-tour-id="hero-cta"]', 200, 50, 'button', ARRAY['hero', 'cta']),
  ('/', 'home-features-section', 'Seção de Recursos', '.features-section', 800, 400, 'card', ARRAY['features', 'home']),
  ('/dashboard', 'dashboard-menu', 'Menu Principal', '[role="navigation"]', 250, 300, 'list', ARRAY['navigation', 'menu']),
  ('/dashboard', 'dashboard-stats', 'Estatísticas Dashboard', '.stats-container', 600, 200, 'chart', ARRAY['stats', 'dashboard']),
  ('/profile', 'profile-form', 'Formulário Perfil', 'form[data-testid="profile-form"]', 400, 500, 'input', ARRAY['form', 'profile']),
  ('/settings', 'settings-tabs', 'Abas Configurações', '[role="tablist"]', 500, 50, 'tabs', ARRAY['settings', 'navigation']);