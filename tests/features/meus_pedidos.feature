# language: pt

Funcionalidade: Meus Pedidos
  Como um usuário logado
  Eu quero visualizar meus pedidos e seus status
  Para acompanhar a entrega dos meus produtos

  # ============================================
  # CT027 - Visualizar histórico e validar status
  # ============================================
  Cenário: Visualizar histórico de pedidos e validar status
    Dado que eu estou logado no sistema
    E eu já realizei pedidos anteriormente
    Quando eu acessar a página "Meus Pedidos"
    Então o sistema deve listar todos os meus pedidos
    E cada pedido deve ter um status coerente
    E pedidos com pagamento aprovado devem ter status "Separação" ou "Enviado"
    E pedidos pendentes devem ter status "Pendente"
    # RESULTADO: FALHA - Pedido permaneceu como "Pendente" após a finalização