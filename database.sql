CREATE DATABASE monitoria_db;

USE monitoria_db;


-- Usuário
CREATE TABLE IF NOT EXISTS `Usuario` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `senha_hash` VARCHAR(255) NOT NULL,
    `tipo` ENUM('aluno', 'monitor', 'professor') NOT NULL,
    `curso` VARCHAR(255),
    `foto_perfil_url` VARCHAR(255),
    `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Disciplina
CREATE TABLE IF NOT EXISTS `Disciplina` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `codigo` VARCHAR(50) NOT NULL UNIQUE,
    `descricao` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--Monitoria
CREATE TABLE IF NOT EXISTS `Monitoria` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `disciplina_id` INT NOT NULL,
    `monitor_id` INT NOT NULL,
    `horarios_disponiveis` JSON,
    `local` VARCHAR(255),
    `status` ENUM('ativa', 'inativa') NOT NULL DEFAULT 'ativa',
    FOREIGN KEY (`disciplina_id`) REFERENCES `Disciplina`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`monitor_id`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--Agendamento
CREATE TABLE IF NOT EXISTS `Agendamento` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `monitoria_id` INT NOT NULL,
    `aluno_id` INT NOT NULL,
    `data_hora_inicio` DATETIME NOT NULL,
    `data_hora_fim` DATETIME NOT NULL,
    `status` ENUM('confirmado', 'cancelado_pelo_aluno', 'cancelado_pelo_monitor', 'realizado') NOT NULL DEFAULT 'confirmado',
    `observacoes` TEXT,
    FOREIGN KEY (`monitoria_id`) REFERENCES `Monitoria`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`aluno_id`) REFERENCES `Usuario`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--Avaliação
CREATE TABLE IF NOT EXISTS `Avaliacao` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `agendamento_id` INT NOT NULL UNIQUE, -- Garante uma avaliação por agendamento
    `avaliador_id` INT NOT NULL, -- O aluno que fez a avaliação
    `avaliado_id` INT NOT NULL, -- O monitor que foi avaliado
    `nota` INT NOT NULL CHECK (`nota` >= 1 AND `nota` <= 5),
    `comentario` TEXT,
    `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`agendamento_id`) REFERENCES `Agendamento`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`avaliador_id`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`avaliado_id`) REFERENCES `Usuario`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;