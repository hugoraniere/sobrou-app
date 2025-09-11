# Como Configurar Usuários no Sistema de Blog

Para acessar o gerenciador do blog em `/admin-blog`, você precisa criar usuários com os privilégios apropriados.

## Tipos de Usuário:

- **Admin**: Acesso total. Pode gerenciar posts e usuários.
- **Editor**: Pode criar, editar e excluir posts, mas não gerencia usuários.
- **Usuário Padrão**: Sem acesso à área administrativa.

## Passos para criar um administrador:

### 1. Encontrar o Email do Usuário
Se você já tem o ID do usuário (`a1b2c3d4-e5f6-7890-1234-567890abcdef`), execute esta query no SQL Editor do Supabase para encontrar o email:

```sql
SELECT email FROM auth.users WHERE id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
```

### 2. Redefinir a Senha (se necessário)
Se você não sabe a senha, pode redefini-la usando a função de recuperação de senha ou executar esta query no SQL Editor:

```sql
-- Redefinir senha para 'admin123' (exemplo)
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf'))
WHERE id = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
```

### 3. Atribuir a Role de Admin
Execute esta query no SQL Editor do Supabase para dar privilégios de administrador ao usuário:

```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 4. Para criar um Editor (opcional)
Se você quiser criar um usuário editor ao invés de admin:

```sql
INSERT INTO public.user_roles (user_id, role) 
VALUES ('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'editor')
ON CONFLICT (user_id, role) DO NOTHING;
```

### 5. Fazer Login
Agora você pode fazer login em `/admin-blog` usando:
- **Email**: O email retornado da query do passo 1
- **Senha**: A senha que você definiu no passo 2

## Gerenciamento via Interface (Admins)
Depois que você tiver um usuário admin configurado, poderá:
1. Fazer login no `/admin-blog`
2. Acessar a aba "Gerenciador de Usuários"
3. Buscar usuários pelo email ou nome
4. Atribuir ou remover roles (admin/editor) diretamente pela interface

## Verificar se funciona
Após o login:
- **Admins**: Verão tanto "Gerenciador de Conteúdo" quanto "Gerenciador de Usuários"
- **Editores**: Verão apenas "Gerenciador de Conteúdo"

## Links Úteis
- [SQL Editor do Supabase](https://supabase.com/dashboard/project/jevsazpwfowhmjupuuzw/sql/new)
- [Usuários no Auth](https://supabase.com/dashboard/project/jevsazpwfowhmjupuuzw/auth/users)