# language: pt

Funcionalidade: Logout
  Como um usuário logado
  Eu quero poder sair da minha conta de qualquer lugar
  Para garantir minha segurança ao encerrar a sessão

  # ============================================
  # CT015 - Logout acessível em todas as telas
  # ============================================
  Cenário: Verificar se a saída de usuário está acessível independente da tela
    Dado que eu estou logado no sistema
    Quando eu navegar para a página de produto
    Então deve existir a opção de "Sair" ou "Logout"
    Quando eu navegar para a página de busca
    Então deve existir a opção de "Sair" ou "Logout"
    Quando eu navegar para a página de carrinho
    Então deve existir a opção de "Sair" ou "Logout"
    E a posição do botão de logout deve ser consistente em todas as páginas