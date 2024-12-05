import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'colocar a url do banco'; // URL do projeto
const supabaseAnonKey = 'chave key do banco de dados'; // Chave pública anon na sua imagem

const supabase = createClient(supabaseUrl, supabaseAnonKey);