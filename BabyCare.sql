-- =========================================================
-- BABYCARE DATABASE SCHEMA
-- PostgreSQL script para criação local
-- =========================================================

-- Remove o banco anterior (opcional)
DROP DATABASE IF EXISTS babycare;

-- Cria o banco de dados
CREATE DATABASE babycare;

-- =========================================================
-- TABELA: usuarios
-- =========================================================
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE,
  senha VARCHAR(255),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- TABELA: criancas
-- =========================================================
CREATE TABLE criancas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  idade INT,
  avatar_url TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- TABELA: remedios
-- =========================================================
CREATE TABLE remedios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crianca_id UUID REFERENCES criancas(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  horario TIME,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- TABELA: localizacao
-- =========================================================
CREATE TABLE localizacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crianca_id UUID REFERENCES criancas(id) ON DELETE CASCADE,
  endereco VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  data_hora TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- TABELA: eventos_calendario
-- =========================================================
CREATE TABLE eventos_calendario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crianca_id UUID REFERENCES criancas(id) ON DELETE CASCADE,
  titulo VARCHAR(100) NOT NULL,
  descricao TEXT,
  data_evento DATE NOT NULL,
  hora_evento TIME,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- TABELA: refeicoes
-- =========================================================
CREATE TABLE refeicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crianca_id UUID REFERENCES criancas(id) ON DELETE CASCADE,
  tipo_refeicao VARCHAR(50),
  descricao TEXT,
  horario TIME,
  data DATE DEFAULT CURRENT_DATE
);

-- =========================================================
-- TABELA: sono
-- =========================================================
CREATE TABLE sono (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crianca_id UUID REFERENCES criancas(id) ON DELETE CASCADE,
  hora_inicio TIMESTAMP,
  hora_fim TIMESTAMP,
  duracao_minutos INT GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (hora_fim - hora_inicio)) / 60
  ) STORED,
  observacoes TEXT
);

-- =========================================================
-- TABELA: faq
-- =========================================================
CREATE TABLE faq (
  id SERIAL PRIMARY KEY,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL,
  ativo BOOLEAN DEFAULT TRUE
);

-- =========================================================
-- TABELA: telefones_emergencia
-- =========================================================
CREATE TABLE telefones_emergencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  nome_contato VARCHAR(100),
  telefone VARCHAR(20) NOT NULL,
  tipo VARCHAR(50),
  favorito BOOLEAN DEFAULT FALSE
);

-- =========================================================
-- VIEWS / CONSULTAS (opcional)
-- =========================================================
CREATE VIEW resumo_crianca AS
SELECT
  c.id AS crianca_id,
  c.nome AS nome_crianca,
  c.idade,
  COUNT(DISTINCT r.id) AS qtd_remedios,
  COUNT(DISTINCT e.id) AS qtd_eventos,
  COUNT(DISTINCT s.id) AS qtd_registros_sono
FROM criancas c
LEFT JOIN remedios r ON r.crianca_id = c.id
LEFT JOIN eventos_calendario e ON e.crianca_id = c.id
LEFT JOIN sono s ON s.crianca_id = c.id
GROUP BY c.id, c.nome, c.idade;
