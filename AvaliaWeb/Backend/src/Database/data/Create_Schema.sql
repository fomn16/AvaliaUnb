
-- -----------------------------------------------------
-- Schema AvaliaUnb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema AvaliaUnb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `AvaliaUnb` DEFAULT CHARACTER SET utf8 ;
USE `AvaliaUnb` ;

-- -----------------------------------------------------
-- Table `AvaliaUnb`.`USUARIO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`USUARIO` (
  `MATRICULA` INT UNSIGNED NOT NULL,
  `EMAIL` VARCHAR(100) NOT NULL,
  `NOME` VARCHAR(100) NOT NULL,
  `SENHA_HASH` VARCHAR(80) NOT NULL,
  `SENHA_SALT` VARCHAR(80) NOT NULL,
  `ADMINISTRADOR` TINYINT NOT NULL DEFAULT 0,
  `ATIVO` TINYINT NOT NULL DEFAULT 0,
  `AVATAR` MEDIUMBLOB NOT NULL,
  PRIMARY KEY (`MATRICULA`),
  UNIQUE INDEX `EMAIL_UNIQUE` (`EMAIL` ASC) VISIBLE,
  UNIQUE INDEX `MATRICULA_UNIQUE` (`MATRICULA` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`DEPARTAMENTO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`DEPARTAMENTO` (
  `CODIGO` INT UNSIGNED NOT NULL,
  `NOME` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`CODIGO`),
  UNIQUE INDEX `NOME_UNIQUE` (`NOME` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`PROFESSOR`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`PROFESSOR` (
  `CODIGO` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `NOME` VARCHAR(80) NOT NULL,
  `DEPARTAMENTO_CODIGO` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`CODIGO`),
  INDEX `fk_PROFESSOR_DEPARTAMENTO1_idx` (`DEPARTAMENTO_CODIGO` ASC) VISIBLE,
  UNIQUE INDEX `NOME_UNIQUE` (`NOME` ASC) VISIBLE,
  CONSTRAINT `fk_PROFESSOR_DEPARTAMENTO1`
    FOREIGN KEY (`DEPARTAMENTO_CODIGO`)
    REFERENCES `AvaliaUnb`.`DEPARTAMENTO` (`CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`DISCIPLINA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`DISCIPLINA` (
  `CODIGO` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `CODIGO_TXT` VARCHAR(45) NOT NULL,
  `NOME` VARCHAR(100) NOT NULL,
  `DEPARTAMENTO_CODIGO` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`CODIGO`),
  INDEX `fk_DISCIPLINA_DEPARTAMENTO1_idx` (`DEPARTAMENTO_CODIGO` ASC) VISIBLE,
  UNIQUE INDEX `CODIGO_TXT_UNIQUE` (`CODIGO_TXT` ASC) VISIBLE,
  CONSTRAINT `fk_DISCIPLINA_DEPARTAMENTO1`
    FOREIGN KEY (`DEPARTAMENTO_CODIGO`)
    REFERENCES `AvaliaUnb`.`DEPARTAMENTO` (`CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`PERIODO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`PERIODO` (
  `CODIGO` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `NOME` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`CODIGO`),
  UNIQUE INDEX `NOME_UNIQUE` (`NOME` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`LOCAL`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`LOCAL` (
  `CODIGO` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `NOME` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`CODIGO`),
  UNIQUE INDEX `NOME_UNIQUE` (`NOME` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`TURMA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`TURMA` (
  `CODIGO` VARCHAR(10) NOT NULL,
  `PERIODO_CODIGO` INT UNSIGNED NOT NULL,
  `DISCIPLINA_CODIGO` INT UNSIGNED NOT NULL,
  `VAGAS_OCUPADAS` INT UNSIGNED NOT NULL,
  `TOTAL_VAGAS` INT UNSIGNED NOT NULL,
  `LOCAL_CODIGO` INT UNSIGNED NOT NULL,
  `TURNO` CHAR(1) NOT NULL,
  PRIMARY KEY (`PERIODO_CODIGO`, `DISCIPLINA_CODIGO`, `CODIGO`),
  INDEX `fk_TURMA_PERIODO1_idx` (`PERIODO_CODIGO` ASC) VISIBLE,
  INDEX `fk_TURMA_LOCAL1_idx` (`LOCAL_CODIGO` ASC) VISIBLE,
  INDEX `fk_TURMA_DISCIPLINA1_idx` (`DISCIPLINA_CODIGO` ASC) VISIBLE,
  CONSTRAINT `fk_TURMA_PERIODO1`
    FOREIGN KEY (`PERIODO_CODIGO`)
    REFERENCES `AvaliaUnb`.`PERIODO` (`CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TURMA_LOCAL1`
    FOREIGN KEY (`LOCAL_CODIGO`)
    REFERENCES `AvaliaUnb`.`LOCAL` (`CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TURMA_DISCIPLINA1`
    FOREIGN KEY (`DISCIPLINA_CODIGO`)
    REFERENCES `AvaliaUnb`.`DISCIPLINA` (`CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`AVALIACAO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`AVALIACAO` (
  `USUARIO_MATRICULA` INT UNSIGNED NOT NULL,
  `TURMA_PERIODO_CODIGO` INT UNSIGNED NOT NULL,
  `TURMA_DISCIPLINA_CODIGO` INT UNSIGNED NOT NULL,
  `TURMA_CODIGO` VARCHAR(10) NOT NULL,
  `NOTA` TINYINT(2) UNSIGNED NOT NULL,
  `TEXTO` VARCHAR(500) NULL,
  `ATIVO` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`USUARIO_MATRICULA`, `TURMA_PERIODO_CODIGO`, `TURMA_DISCIPLINA_CODIGO`, `TURMA_CODIGO`),
  INDEX `fk_AVALIACAO_USUARIO1_idx` (`USUARIO_MATRICULA` ASC) VISIBLE,
  INDEX `fk_AVALIACAO_TURMA1_idx` (`TURMA_PERIODO_CODIGO` ASC, `TURMA_DISCIPLINA_CODIGO` ASC, `TURMA_CODIGO` ASC) VISIBLE,
  CONSTRAINT `fk_AVALIACAO_USUARIO1`
    FOREIGN KEY (`USUARIO_MATRICULA`)
    REFERENCES `AvaliaUnb`.`USUARIO` (`MATRICULA`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AVALIACAO_TURMA1`
    FOREIGN KEY (`TURMA_PERIODO_CODIGO` , `TURMA_DISCIPLINA_CODIGO` , `TURMA_CODIGO`)
    REFERENCES `AvaliaUnb`.`TURMA` (`PERIODO_CODIGO` , `DISCIPLINA_CODIGO` , `CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`DENUNCIA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`DENUNCIA` (
  `USUARIO_MATRICULA` INT UNSIGNED NOT NULL,
  `AVALIACAO_USUARIO_MATRICULA` INT UNSIGNED NOT NULL,
  `AVALIACAO_TURMA_PERIODO_CODIGO` INT UNSIGNED NOT NULL,
  `AVALIACAO_TURMA_DISCIPLINA_CODIGO` INT UNSIGNED NOT NULL,
  `AVALIACAO_TURMA_CODIGO` VARCHAR(10) NOT NULL,
  `TEXTO` VARCHAR(500) NULL,
  `ACEITA` TINYINT NOT NULL DEFAULT 0,
  INDEX `fk_DENUNCIA_USUARIO1_idx` (`USUARIO_MATRICULA` ASC) VISIBLE,
  PRIMARY KEY (`USUARIO_MATRICULA`, `AVALIACAO_USUARIO_MATRICULA`, `AVALIACAO_TURMA_PERIODO_CODIGO`, `AVALIACAO_TURMA_DISCIPLINA_CODIGO`, `AVALIACAO_TURMA_CODIGO`),
  INDEX `fk_DENUNCIA_AVALIACAO1_idx` (`AVALIACAO_USUARIO_MATRICULA` ASC, `AVALIACAO_TURMA_PERIODO_CODIGO` ASC, `AVALIACAO_TURMA_DISCIPLINA_CODIGO` ASC, `AVALIACAO_TURMA_CODIGO` ASC) VISIBLE,
  CONSTRAINT `fk_DENUNCIA_USUARIO1`
    FOREIGN KEY (`USUARIO_MATRICULA`)
    REFERENCES `AvaliaUnb`.`USUARIO` (`MATRICULA`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_DENUNCIA_AVALIACAO1`
    FOREIGN KEY (`AVALIACAO_USUARIO_MATRICULA` , `AVALIACAO_TURMA_PERIODO_CODIGO` , `AVALIACAO_TURMA_DISCIPLINA_CODIGO` , `AVALIACAO_TURMA_CODIGO`)
    REFERENCES `AvaliaUnb`.`AVALIACAO` (`USUARIO_MATRICULA` , `TURMA_PERIODO_CODIGO` , `TURMA_DISCIPLINA_CODIGO` , `TURMA_CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`TURMA_DIA`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`TURMA_DIA` (
  `CODIGO` TINYINT(2) UNSIGNED NOT NULL,
  `TURMA_PERIODO_CODIGO` INT UNSIGNED NOT NULL,
  `TURMA_DISCIPLINA_CODIGO` INT UNSIGNED NOT NULL,
  `TURMA_CODIGO` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`CODIGO`, `TURMA_PERIODO_CODIGO`, `TURMA_DISCIPLINA_CODIGO`, `TURMA_CODIGO`),
  INDEX `fk_TURMA_DIA_TURMA1_idx` (`TURMA_PERIODO_CODIGO` ASC, `TURMA_DISCIPLINA_CODIGO` ASC, `TURMA_CODIGO` ASC) VISIBLE,
  CONSTRAINT `fk_TURMA_DIA_TURMA1`
    FOREIGN KEY (`TURMA_PERIODO_CODIGO` , `TURMA_DISCIPLINA_CODIGO` , `TURMA_CODIGO`)
    REFERENCES `AvaliaUnb`.`TURMA` (`PERIODO_CODIGO` , `DISCIPLINA_CODIGO` , `CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`TURMA_HORARIO`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`TURMA_HORARIO` (
  `CODIGO` TINYINT(2) UNSIGNED NOT NULL,
  `TURMA_PERIODO_CODIGO` INT UNSIGNED NOT NULL,
  `TURMA_DISCIPLINA_CODIGO` INT UNSIGNED NOT NULL,
  `TURMA_CODIGO` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`CODIGO`, `TURMA_PERIODO_CODIGO`, `TURMA_DISCIPLINA_CODIGO`, `TURMA_CODIGO`),
  INDEX `fk_TURMA_HORARIO_TURMA1_idx` (`TURMA_PERIODO_CODIGO` ASC, `TURMA_DISCIPLINA_CODIGO` ASC, `TURMA_CODIGO` ASC) VISIBLE,
  CONSTRAINT `fk_TURMA_HORARIO_TURMA1`
    FOREIGN KEY (`TURMA_PERIODO_CODIGO` , `TURMA_DISCIPLINA_CODIGO` , `TURMA_CODIGO`)
    REFERENCES `AvaliaUnb`.`TURMA` (`PERIODO_CODIGO` , `DISCIPLINA_CODIGO` , `CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`TURMA_PROFESSOR`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`TURMA_PROFESSOR` (
  `TURMA_PERIODO_CODIGO` INT UNSIGNED NOT NULL,
  `TURMA_DISCIPLINA_CODIGO` INT UNSIGNED NOT NULL,
  `TURMA_CODIGO` VARCHAR(10) NOT NULL,
  `PROFESSOR_CODIGO` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`TURMA_PERIODO_CODIGO`, `TURMA_DISCIPLINA_CODIGO`, `TURMA_CODIGO`, `PROFESSOR_CODIGO`),
  INDEX `fk_TURMA_has_PROFESSOR_PROFESSOR1_idx` (`PROFESSOR_CODIGO` ASC) VISIBLE,
  INDEX `fk_TURMA_has_PROFESSOR_TURMA1_idx` (`TURMA_PERIODO_CODIGO` ASC, `TURMA_DISCIPLINA_CODIGO` ASC, `TURMA_CODIGO` ASC) VISIBLE,
  CONSTRAINT `fk_TURMA_has_PROFESSOR_TURMA1`
    FOREIGN KEY (`TURMA_PERIODO_CODIGO` , `TURMA_DISCIPLINA_CODIGO` , `TURMA_CODIGO`)
    REFERENCES `AvaliaUnb`.`TURMA` (`PERIODO_CODIGO` , `DISCIPLINA_CODIGO` , `CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_TURMA_has_PROFESSOR_PROFESSOR1`
    FOREIGN KEY (`PROFESSOR_CODIGO`)
    REFERENCES `AvaliaUnb`.`PROFESSOR` (`CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `AvaliaUnb`.`AVALIACAO_PROFESSOR`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`AVALIACAO_PROFESSOR` (
  `AVALIACAO_USUARIO_MATRICULA` INT UNSIGNED NOT NULL,
  `AVALIACAO_TURMA_PERIODO_CODIGO` INT UNSIGNED NOT NULL,
  `AVALIACAO_TURMA_DISCIPLINA_CODIGO` INT UNSIGNED NOT NULL,
  `AVALIACAO_TURMA_CODIGO` VARCHAR(10) NOT NULL,
  `PROFESSOR_CODIGO` INT UNSIGNED NOT NULL,
  `NOTA` TINYINT(2) NOT NULL,
  `TEXTO` VARCHAR(500) NULL,
  PRIMARY KEY (`AVALIACAO_USUARIO_MATRICULA`, `AVALIACAO_TURMA_PERIODO_CODIGO`, `AVALIACAO_TURMA_DISCIPLINA_CODIGO`, `AVALIACAO_TURMA_CODIGO`, `PROFESSOR_CODIGO`),
  INDEX `fk_AVALIACAO_has_PROFESSOR_PROFESSOR1_idx` (`PROFESSOR_CODIGO` ASC) VISIBLE,
  INDEX `fk_AVALIACAO_has_PROFESSOR_AVALIACAO1_idx` (`AVALIACAO_USUARIO_MATRICULA` ASC, `AVALIACAO_TURMA_PERIODO_CODIGO` ASC, `AVALIACAO_TURMA_DISCIPLINA_CODIGO` ASC, `AVALIACAO_TURMA_CODIGO` ASC) VISIBLE,
  CONSTRAINT `fk_AVALIACAO_has_PROFESSOR_AVALIACAO1`
    FOREIGN KEY (`AVALIACAO_USUARIO_MATRICULA` , `AVALIACAO_TURMA_PERIODO_CODIGO` , `AVALIACAO_TURMA_DISCIPLINA_CODIGO` , `AVALIACAO_TURMA_CODIGO`)
    REFERENCES `AvaliaUnb`.`AVALIACAO` (`USUARIO_MATRICULA` , `TURMA_PERIODO_CODIGO` , `TURMA_DISCIPLINA_CODIGO` , `TURMA_CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_AVALIACAO_has_PROFESSOR_PROFESSOR1`
    FOREIGN KEY (`PROFESSOR_CODIGO`)
    REFERENCES `AvaliaUnb`.`PROFESSOR` (`CODIGO`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `AvaliaUnb` ;

-- -----------------------------------------------------
-- Placeholder table for view `AvaliaUnb`.`TURMA_VIEW`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `AvaliaUnb`.`TURMA_VIEW` (`CODIGO` INT, `PERIODO_CODIGO` INT, `DISCIPLINA_CODIGO` INT, `PERIODO` INT, `PROFESSOR_CODIGO` INT, `PROFESSOR_NOME` INT, `DISCIPLINA_NOME` INT, `DISCIPLINA_SIGLA` INT, `DEPARTAMENTO_NOME` INT);

-- -----------------------------------------------------
-- View `AvaliaUnb`.`TURMA_VIEW`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `AvaliaUnb`.`TURMA_VIEW`;
USE `AvaliaUnb`;
CREATE  OR REPLACE VIEW `TURMA_VIEW` AS
SELECT 	T.CODIGO, T.PERIODO_CODIGO, T.DISCIPLINA_CODIGO,
		P.NOME as PERIODO,
        PR.CODIGO AS PROFESSOR_CODIGO, PR.NOME AS PROFESSOR_NOME,
        D.NOME AS DISCIPLINA_NOME, D.CODIGO_TXT AS DISCIPLINA_SIGLA,
        DP.NOME AS DEPARTAMENTO_NOME
FROM TURMA T
JOIN PERIODO P ON T.PERIODO_CODIGO = P.CODIGO
JOIN TURMA_PROFESSOR TP ON T.PERIODO_CODIGO = TP.TURMA_PERIODO_CODIGO AND T.DISCIPLINA_CODIGO = TP.TURMA_DISCIPLINA_CODIGO AND T.CODIGO = TP.TURMA_CODIGO
JOIN PROFESSOR PR ON TP.PROFESSOR_CODIGO = PR.CODIGO
JOIN DISCIPLINA D ON T.DISCIPLINA_CODIGO = D.CODIGO
JOIN DEPARTAMENTO DP ON D.DEPARTAMENTO_CODIGO = DP.CODIGO;
