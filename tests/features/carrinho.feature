# language: pt

Funcionalidade: Carrinho de Compras
  Como um usuário do sistema
  Eu quero gerenciar os produtos no meu carrinho
  Para comprar os itens que desejo com as quantidades corretas

  # ============================================
  # CT020 - Adicionar produto ao carrinho com estoque esgotado
  # ============================================
  Cenário: Adicionar produto ao carrinho com estoque esgotado
    Dado que eu estou logado no sistema
    E o produto possui estoque = 0 (esgotado)
    Quando eu acessar a página do produto
    E clicar em "Adicionar ao Carrinho"
    Então o sistema deve informar que o produto está indisponível
    E NÃO deve permitir a adição ao carrinho
    # RESULTADO: FALHA - Foi possível tentar adicionar ao carrinho mesmo sem estoque

  # ============================================
  # CT021 - Tentar adicionar quantidade maior que o estoque
  # ============================================
  Cenário: Tentar adicionar quantidade maior que o estoque
    Dado que eu estou logado no sistema
    E o produto possui estoque = 5
    Quando eu tentar adicionar 5 unidades ao carrinho pela primeira vez
    E tentar adicionar mais 5 unidades (totalizando 10)
    Então o sistema deve permitir a adição inicial de 5 unidades
    Mas deve bloquear a segunda adição
    E exibir a mensagem "Quantidade indisponível em estoque (estoque: 5)"
    # RESULTADO: FALHA - Sistema permite a adição mas bloqueia apenas no checkout

  # ============================================
  # CT022 - Aumentar quantidade de item com estoque limitado
  # ============================================
  Cenário: Aumentar quantidade de item com estoque limitado no carrinho
    Dado que eu estou logado no sistema
    E o produto possui estoque = 1
    E eu já adicionei 1 unidade ao carrinho
    Quando eu tentar alterar a quantidade de 1 para 3
    E clicar em "Atualizar"
    Então o sistema deve impedir a atualização
    E exibir a mensagem "Quantidade indisponível em estoque (estoque: 1)"
    # RESULTADO: FALHA - Foi possível adicionar o produto novamente