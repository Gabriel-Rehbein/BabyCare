-- =============================================================================
--          SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - MONITORIA ACADÊMICA
-- =============================================================================
-- Autor: Gemini
-- Versão: 2.2
-- Descrição: Script com remoção das constraints CHECK para máxima compatibilidade
--            com versões mais antigas de MySQL/MariaDB (XAMPP).
-- =============================================================================

-- Apaga o banco de dados se ele já existir para garantir um ambiente limpo.
DROP DATABASE IF EXISTS `monitoria_db`;

-- Cria o banco de dados com o charset e collation recomendados.
CREATE DATABASE `monitoria_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seleciona o banco de dados recém-criado para executar os comandos seguintes.
USE `monitoria_db`;

-- =============================================================================
-- Tabela: Usuario
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Usuario` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `senha_hash` VARCHAR(255) NOT NULL COMMENT 'Armazena o hash da senha (ex: bcrypt), nunca a senha em texto plano.',
    `tipo` ENUM('aluno', 'monitor', 'professor') NOT NULL COMMENT 'Define o papel do usuário no sistema.',
    `curso` VARCHAR(255) NULL,
    `foto_perfil_url` VARCHAR(255) NULL COMMENT 'URL para a imagem de perfil do usuário.',
    `ativo` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Permite desativar um usuário sem excluí-lo.',
    `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================================================
-- Tabela: Disciplina
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Disciplina` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `codigo` VARCHAR(50) NOT NULL UNIQUE,
    `descricao` TEXT NULL
) ENGINE=InnoDB;

-- =============================================================================
-- Tabela: Monitoria
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Monitoria` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `disciplina_id` INT NOT NULL,
    `monitor_id` INT NOT NULL COMMENT 'Deve ser o ID de um usuário com tipo "monitor". A aplicação deve garantir essa regra.',
    `horarios_disponiveis` JSON NULL COMMENT 'Estrutura flexível para horários. Ex: {"seg": ["14:00-16:00"], "qua": ["10:00-12:00"]}',
    `local` VARCHAR(255) NULL COMMENT 'Local físico ou link para a sala virtual.',
    `status` ENUM('ativa', 'inativa', 'encerrada') NOT NULL DEFAULT 'ativa',
    `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`disciplina_id`) REFERENCES `Disciplina`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`monitor_id`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =============================================================================
-- Tabela: Agendamento
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Agendamento` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `monitoria_id` INT NOT NULL,
    `aluno_id` INT NOT NULL COMMENT 'Deve ser o ID de um usuário com tipo "aluno". A aplicação deve garantir essa regra.',
    `data_hora_inicio` DATETIME NOT NULL,
    `data_hora_fim` DATETIME NOT NULL,
    `status` ENUM('confirmado', 'cancelado_pelo_aluno', 'cancelado_pelo_monitor', 'realizado', 'ausente') NOT NULL DEFAULT 'confirmado',
    `observacoes` TEXT NULL,
    `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (`monitoria_id`) REFERENCES `Monitoria`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`aluno_id`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE
    -- A constraint CHECK foi removida daqui. A validação (data_hora_fim > data_hora_inicio) deve ser feita na aplicação.
) ENGINE=InnoDB;

-- =============================================================================
-- Tabela: Avaliacao
-- =============================================================================
CREATE TABLE IF NOT EXISTS `Avaliacao` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `agendamento_id` INT NOT NULL UNIQUE COMMENT 'Garante uma única avaliação por agendamento.',
    `avaliador_id` INT NULL COMMENT 'O aluno que fez a avaliação. Nulo se o usuário for deletado.',
    `avaliado_id` INT NULL COMMENT 'O monitor que foi avaliado. Nulo se o usuário for deletado.',
    `nota` TINYINT UNSIGNED NOT NULL COMMENT 'Nota de 1 a 5.',
    `comentario` TEXT NULL,
    `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`agendamento_id`) REFERENCES `Agendamento`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`avaliador_id`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`avaliado_id`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL
    -- A constraint CHECK foi removida daqui. A validação (nota entre 1 e 5) deve ser feita na aplicação.
) ENGINE=InnoDB;


-- =============================================================================
--                                  ÍNDICES
-- =============================================================================
CREATE INDEX `idx_usuario_tipo` ON `Usuario`(`tipo`);
CREATE INDEX `idx_monitoria_disciplina_id` ON `Monitoria`(`disciplina_id`);
CREATE INDEX `idx_monitoria_monitor_id` ON `Monitoria`(`monitor_id`);
CREATE INDEX `idx_agendamento_monitoria_id` ON `Agendamento`(`monitoria_id`);
CREATE INDEX `idx_agendamento_aluno_id` ON `Agendamento`(`aluno_id`);
CREATE INDEX `idx_agendamento_data_inicio` ON `Agendamento`(`data_hora_inicio`);
CREATE INDEX `idx_avaliacao_avaliador_id` ON `Avaliacao`(`avaliador_id`);
CREATE INDEX `idx_avaliacao_avaliado_id` ON `Avaliacao`(`avaliado_id`);

-- =============================================================================
--                                FIM DO SCRIPT
-- =============================================================================
