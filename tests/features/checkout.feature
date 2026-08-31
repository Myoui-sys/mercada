# language: pt

Funcionalidade: Finalizar Pedido
  Como um usuário com itens no carrinho
  Eu quero finalizar minha compra
  Para receber meus produtos

  # ============================================
  # CT029 - Checkout com dados válidos
  # ============================================
  Cenário: Checkout com dados válidos
    Dado que eu estou logado no sistema
    E meu carrinho possui itens
    Quando eu acessar a página de finalização de pedido
    E preencher o endereço
    E clicar em "Finalizar Pedido"
    Então o sistema deve processar o pedido
    E deve apresentar uma etapa ou opção para seleção de forma de pagamento
    E o pedido deve ser gerado com sucesso
    # RESULTADO: FALHA - Pedido gerado sem etapa de pagamento

  # ============================================
  # CT030 - Checkout com carrinho vazio
  # ============================================
  Cenário: Checkout com carrinho vazio
    Dado que eu estou logado no sistema
    E meu carrinho está vazio
    Quando eu tentar acessar "Finalizar Pedido"
    Então o sistema deve bloquear a ação
    E o botão "Finalizar Pedido" deve ser substituído por "Continuar Comprando"
    E ao clicar em "Continuar Comprando", o usuário deve ser redirecionado para a página inicial