-- Atualizar benefits do hero para incluir descriptions
UPDATE landing_page_config 
SET content = jsonb_set(
    content, 
    '{benefits}', 
    '[
        {
            "icon": "Shield", 
            "title": "Segurança dos seus dados em primeiro lugar",
            "description": "Proteção avançada para suas informações financeiras"
        },
        {
            "icon": "Smartphone", 
            "title": "Acesse quando quiser, no celular ou computador",
            "description": "Sincronizado em todos os seus dispositivos"
        }
    ]'::jsonb
)
WHERE section_key = 'hero';