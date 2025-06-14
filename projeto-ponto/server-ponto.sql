-- CREATE DATABASE pontodb;

USE pontodb;

-- INSERT INTO funcionarios (matricula, nome_completo, senha_hash, perfil) 
-- VALUES ('admin', 'Administrador do Sistema', '$2b$10$GcJoYemh1N3/ma1/UHjk7evIECFvzQnz6RYthAcaTzEBIHsepkkKK', 'admin');
UPDATE funcionarios 
-- SET senha_hash = '$2b$10$GcJoYemh1N3/ma1/UHjk7evIECFvzQnz6RYthAcaTzEBIHsepkkKK' 
-- WHERE matricula = 'admin';

-- SET senha_hash = '123' 
-- WHERE matricula = 'admin';

/*USE pontodb;
DELETE FROM funcionarios WHERE matricula = 'admin';

INSERT INTO funcionarios (matricula, nome_completo, senha_hash, perfil) 
VALUES ('admin', 'Administrador do Sistema', '$2b$10$8.K9uA7aVTnROTj2u9gKFOy..pCj79L5Jd/FwBCYm2a/3DTi8kCjC', 'admin');


-- DROP DATABASE pontodb;
UPDATE funcionarios
SET senha_hash = '123' 
WHERE matricula = 'admin';

USE pontodb;
SELECT 
    f.matricula,
    f.nome_completo,
    r.tipo_registro,
    r.data_registro,
    r.horario_registro
FROM 
    registrosponto r
JOIN 
    funcionarios f ON r.funcionario_id = f.id
ORDER BY 
    r.data_registro DESC, r.horario_registro DESC;*/