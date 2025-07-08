-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 08/07/2025 às 13:32
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `monitoria_db`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `agendamento`
--

CREATE TABLE `agendamento` (
  `id` int(11) NOT NULL,
  `monitoria_id` int(11) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `data_hora_inicio` datetime NOT NULL,
  `data_hora_fim` datetime NOT NULL,
  `status` enum('confirmado','cancelado','realizado','ausente') NOT NULL DEFAULT 'confirmado',
  `observacoes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Agendamentos de sessões de monitoria.';

--
-- Despejando dados para a tabela `agendamento`
--

INSERT INTO `agendamento` (`id`, `monitoria_id`, `aluno_id`, `data_hora_inicio`, `data_hora_fim`, `status`, `observacoes`) VALUES
(1, 1, 2, '2025-07-14 14:00:00', '2025-07-14 15:00:00', 'confirmado', 'Gostaria de revisar os exercícios sobre SQL.');

-- --------------------------------------------------------

--
-- Estrutura para tabela `disciplina`
--

CREATE TABLE `disciplina` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `codigo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Disciplinas acadêmicas disponíveis para monitoria.';

--
-- Despejando dados para a tabela `disciplina`
--

INSERT INTO `disciplina` (`id`, `nome`, `codigo`) VALUES
(1, 'Desenvolvimento de Serviços e API', 'DSAPI'),
(2, 'Algoritmo e Estrutura de Dados', 'AED'),
(3, 'Engenharia de Software', 'ES'),
(4, 'Tópicos Avançados de Tecnologia', 'TAT'),
(5, 'Gestão Ágil de Projetos', 'GAP');

-- --------------------------------------------------------

--
-- Estrutura para tabela `monitoria`
--

CREATE TABLE `monitoria` (
  `id` int(11) NOT NULL,
  `disciplina_id` int(11) NOT NULL,
  `monitor_id` int(11) NOT NULL,
  `horarios_disponiveis` text DEFAULT NULL COMMENT 'Ex: Seg 14h-16h, Qua 10h-12h',
  `local` varchar(255) DEFAULT NULL COMMENT 'Local físico ou link para a sala virtual.',
  `status` enum('ativa','inativa') NOT NULL DEFAULT 'ativa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registros de monitorias ativas para cada disciplina.';

--
-- Despejando dados para a tabela `monitoria`
--

INSERT INTO `monitoria` (`id`, `disciplina_id`, `monitor_id`, `horarios_disponiveis`, `local`, `status`) VALUES
(1, 1, 1, '{\"seg\": [\"14:00-16:00\"], \"qua\": [\"10:00-13:00\"]}', 'Laboratório de Informática', 'ativa'),
(2, 2, 1, '{\"ter\": [\"18:00-20:00\"]}', 'https://meet.google.com/xyz-abc-def', 'ativa'),
(3, 3, 1, '{\"sex\": [\"09:00-11:00\"]}', 'Laboratório de Informática 3', 'ativa'),
(4, 1, 1, '{\"segunda\":[\"14:00-15:00\",\"15:00-16:00\"],\"quarta\":[\"10:00-11:00\"]}', 'Sala A-203, Bloco A', 'ativa');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL COMMENT 'Identificador único do usuário.',
  `googleId` varchar(255) NOT NULL COMMENT 'ID único fornecido pelo Google para autenticação.',
  `nome` varchar(255) NOT NULL COMMENT 'Nome completo do usuário.',
  `email` varchar(255) NOT NULL COMMENT 'E-mail do usuário, também usado para login.',
  `curso` varchar(255) DEFAULT NULL COMMENT 'Curso ao qual o aluno pertence. Opcional.',
  `semestre` int(11) DEFAULT NULL COMMENT 'Semestre atual do aluno no curso. Opcional.',
  `tipo` enum('aluno','monitor') NOT NULL DEFAULT 'aluno' COMMENT 'Define o papel do usuário no sistema (a API atual só lida com aluno e monitor).',
  `ativo` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'Permite desativar um usuário sem excluí-lo (soft delete).',
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Data e hora da criação do registro.',
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Data e hora da última atualização do registro.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela central de usuários do sistema de monitoria.';

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id`, `googleId`, `nome`, `email`, `curso`, `semestre`, `tipo`, `ativo`, `criado_em`, `atualizado_em`) VALUES
(1, '110477090825274672863', 'Interessantemente', 'dukevikcanvas@gmail.com', 'Engenharia de Software', 4, 'monitor', 1, '2025-07-07 19:18:33', '2025-07-08 01:10:06'),
(2, '101453103308945829440', 'Nada Não', 'dukevik13@gmail.com', 'Engenharia de Software', 4, 'aluno', 1, '2025-07-07 19:54:37', '2025-07-07 22:39:41');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `agendamento`
--
ALTER TABLE `agendamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_agendamento_monitoria` (`monitoria_id`),
  ADD KEY `fk_agendamento_aluno` (`aluno_id`);

--
-- Índices de tabela `disciplina`
--
ALTER TABLE `disciplina`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Índices de tabela `monitoria`
--
ALTER TABLE `monitoria`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_monitoria_disciplina` (`disciplina_id`),
  ADD KEY `fk_monitoria_monitor` (`monitor_id`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `googleId` (`googleId`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_usuario_tipo` (`tipo`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agendamento`
--
ALTER TABLE `agendamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `disciplina`
--
ALTER TABLE `disciplina`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `monitoria`
--
ALTER TABLE `monitoria`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificador único do usuário.', AUTO_INCREMENT=3;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `agendamento`
--
ALTER TABLE `agendamento`
  ADD CONSTRAINT `fk_agendamento_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agendamento_monitoria` FOREIGN KEY (`monitoria_id`) REFERENCES `monitoria` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `monitoria`
--
ALTER TABLE `monitoria`
  ADD CONSTRAINT `fk_monitoria_disciplina` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_monitoria_monitor` FOREIGN KEY (`monitor_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
