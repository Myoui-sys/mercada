# language: pt

Funcionalidade: Login
  Como um usuário do sistema
  Eu quero fazer login na minha conta
  Para acessar funcionalidades restritas e realizar compras

  # ============================================
  # CT012 - Realizar login com sucesso
  # ============================================
  Cenário: Realizar login com sucesso
    Dado que eu tenho uma conta cadastrada com e-mail "maria@exemplo.com" e senha "senha123"
    E estou na página de login
    Quando eu preencher com os dados
    E clicar em "Entrar"
    Então o sistema deve autenticar o usuário
    E redirecionar para a página inicial ou página da conta
    E o usuário deve estar logado
    # RESULTADO: FALHA - Sistema apresenta mensagem de erro mesmo com credenciais válidas

  # ============================================
  # CT013 - Tentar login com senha inválida
  # ============================================
  Cenário: Tentar login com senha inválida
    Dado que eu tenho uma conta cadastrada com e-mail "maria@exemplo.com" e senha "senha123"
    E estou na página de login
    Quando eu preencher o e-mail com os dados
    E clicar em "Entrar"
    Então o sistema deve exibir a mensagem de erro "E-mail ou senha inválidos"
    E o usuário deve permanecer na página de login

  # ============================================
  # CT014 - Tentar login com e-mail não cadastrado
  # ============================================
  Cenário: Tentar login com e-mail não cadastrado
    Dado que eu estou na página de login
    Quando eu preencher com os dados
    E clicar em "Entrar"
    Então o sistema deve exibir uma mensagem de erro em vermelho
    E a mensagem deve ser "E-mail ou senha inválidos"
    E o usuário deve permanecer na página de login