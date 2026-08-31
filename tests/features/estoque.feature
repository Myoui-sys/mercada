# language: pt

Funcionalidade: Contagem de Estoque
  Como um usuário do sistema
  Eu quero ver o estoque atualizado e ser limitado por ele
  Para saber se há produtos disponíveis e não tentar comprar mais do que existe

  # ============================================
  # CT010 - Estoque atualiza após compra
  # ============================================
  Cenário: Estoque atualiza após compra
    Dado que eu estou logado no sistema
    E o produto "Bicicleta Ergométrica ProSpin" possui estoque = 5
    Quando eu adicionar 3 unidades ao carrinho
    E finalizar a compra com sucesso
    Então o sistema deve atualizar o estoque disponível para 2 unidades
    E o catálogo deve mostrar "Últimas 2 unidades"
    E a página do produto deve mostrar estoque = 2
    # RESULTADO: FALHA - Estoque atualizado no catálogo mas NÃO na página do produto

  # ============================================
  # CT011 - Limitar quantidade de acordo com o estoque
  # ============================================
  Cenário: Sistema limita quantidade do item de acordo com o estoque
    Dado que eu estou logado no sistema
    E o produto "SSD NVMe 1TB SpeedDrive" possui estoque = 1
    Quando eu acessar a página do produto
    E tentar selecionar a quantidade
    Então o sistema deve limitar as opções de quantidade a 1
    E não deve permitir selecionar números maiores que o estoque disponível