# language: pt

Funcionalidade: Filtros de Produtos
  Como um usuário do sistema
  Eu quero filtrar e ordenar produtos de diferentes formas
  Para encontrar exatamente o que procuro

  # ============================================
  # CT005 - Ordenar produtos por preço ascendente
  # ============================================
  Cenário: Ordenar produtos por preço ascendente (menor ao maior)
    Dado que eu estou na página da categoria "Casa e Cozinha"
    E existem pelo menos 3 produtos com preços diferentes
    Quando eu selecionar o filtro "Menor preço"
    Então o sistema deve exibir os produtos em ordem crescente de preço
    E o produto de menor valor deve aparecer no topo da lista

  # ============================================
  # CT006 - Ordenar produtos por data de lançamento
  # ============================================
  Cenário: Ordenar produtos por data de lançamento
    Dado que eu estou na página inicial do sistema
    E existem produtos com datas de lançamento diferentes
    Quando eu aplicar o filtro "Produtos Recentes"
    Então o sistema deve organizar os produtos do mais recente para o mais antigo
    E o produto com data de lançamento mais nova deve ser o primeiro da lista

  # ============================================
  # CT007 - Validar filtro de categoria "Hardware"
  # ============================================
  Cenário: Validar filtro de categoria "Hardware"
    Dado que eu estou na página do catálogo de produtos
    E existem produtos de diversas categorias
    Quando eu selecionar a categoria "Hardware" no filtro
    Então a página deve mostrar apenas os produtos pertencentes à categoria "Hardware"
    E nenhum produto de outras categorias deve ser exibido