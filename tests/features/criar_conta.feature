#language: pt

Funcionalidade: Criar Conta
  Como um novo usuário
  Eu quero criar uma conta no sistema
  Para acessar funcionalidades exclusivas e realizar compras

  # ============================================
  # CT016 - Cadastrar com dados válidos
  # ============================================
  Cenário: Cadastrar com dados válidos
    Dado que eu estou na página de criação de conta
    Quando eu preencher os campos:
      | Nome      | João Wolf                    |
      | E-mail    | joao@wolf.com               |
      | Senha     | senha456                    |
      | Endereço  | Rua Boca de Lobo, 459, Matilha |
    E clicar em "Cadastrar"
    Então a conta deve ser criada com sucesso
    E o usuário deve ser logado automaticamente
    E deve ser redirecionado para a página inicial

  # ============================================
  # CT017 - Cadastrar com nome incluindo números
  # ============================================
  Cenário: Cadastrar com nome incluindo números
    Dado que eu estou na página de criação de conta
    Quando eu preencher os campos:
      | Nome      | João da Silva 4223 2346      |
      | E-mail    | joao32@wolf.com              |
      | Senha     | 123senha                     |
      | Endereço  | Rua Exemplo, 123             |
    E clicar em "Cadastrar"
    Então o sistema deve exibir a mensagem de erro "O nome deve conter apenas letras"
    E a conta NÃO deve ser criada
    # RESULTADO: FALHA - Criação de conta permitida mesmo com números no nome

  # ============================================
  # CT018 - Cadastrar com e-mail já utilizado
  # ============================================
  Cenário: Cadastrar com e-mail já utilizado
    Dado que já existe uma conta com o e-mail "joao@exemplo.com"
    E eu estou na página de criação de conta
    Quando eu preencher os campos:
      | Nome      | João Silva Lobo              |
      | E-mail    | joao@exemplo.com             |
      | Senha     | senha890                     |
      | Endereço  | Rua do coiote, 32, Casa Amarela |
    E clicar em "Cadastrar"
    Então o sistema deve bloquear a criação da conta
    E exibir a mensagem em vermelho "Já existe uma conta com este e-mail"

  # ============================================
  # CT019 - Cadastrar deixando campos obrigatórios vazios
  # ============================================
  Cenário: Cadastrar deixando campos obrigatórios vazios
    Dado que eu estou na página de criação de conta
    Quando eu preencher os campos:
      | Nome      | (deixar em branco)          |
      | E-mail    | joao@exemplo.com             |
      | Senha     | senha890                     |
      | Endereço  | Rua do coiote, 32, Casa Amarela |
    E clicar em "Cadastrar"
    Então o sistema deve bloquear o cadastro
    E destacar o campo "Nome" com borda vermelha
    E exibir a mensagem "Por favor, preencha o campo"