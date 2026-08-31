# language: pt

Funcionalidade: Busca de Produtos
  Como um usuário do sistema
  Eu quero buscar produtos de diferentes formas
  Para encontrar rapidamente o item que desejo

  # ============================================
  # CT001 - Buscar produto por nome exato
  # ============================================
Cenário: Buscar produto por nome exato
Dado que eu estou na página inicial do sistema
    E existe um produto cadastrado com o nome "Air Fryer Digital 5L"
    Quando eu digitar "Air Fryer Digital 5L" no campo de busca
    E pressionar Enter ou clicar no botão de busca
    Então o sistema deve exibir o produto "Air Fryer Digital 5L" como primeiro ou único resultado
    E o resultado deve conter as informações corretas do produto

  # ============================================
  # CT002 - Buscar termo com acentuação
  # ============================================
  Cenário: Buscar termo com acentuação
    Dado que eu estou na página inicial do sistema
    E existe um produto cadastrado com o nome "O Poder do Hábito"
    Quando eu digitar "hábito" no campo de busca
    E pressionar Enter
    Então o sistema deve retornar o produto "O Poder do Hábito" como resultado
    E a busca deve ser insensível a acentos

  # ============================================
  # CT003 - Buscar termo com caracteres especiais
  # ============================================
  Cenário: Buscar termo com caracteres especiais (aspas)
    Dado que eu estou na página inicial do sistema
    E existem produtos com aspas duplas no nome: "Notebook UltraBook 14\" i5" e "Monitor 27\" 144Hz UltraView"
    Quando eu digitar " (aspas duplas) no campo de busca
    E pressionar Enter
    Então o sistema deve retornar os produtos que contêm aspas duplas no texto
    E não deve apresentar erro ou mensagem de falha

  # ============================================
  # CT004 - Buscar por subtítulos
  # ============================================
  Cenário: Buscar por subtítulo
    Dado que eu estou na página inicial do sistema
    E existe um produto "O Poder do Hábito" com subtítulo/editora "Editora Objetiva"
    Quando eu digitar "Editora Objetiva" no campo de busca
    E pressionar Enter
    Então o sistema deve retornar o produto "O Poder do Hábito" como resultado
    E a busca deve considerar subtítulos como termo válido