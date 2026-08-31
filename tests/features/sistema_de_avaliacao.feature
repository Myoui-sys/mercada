# language: pt

Funcionalidade: Avaliação de Produtos
  Como um usuário do sistema
  Eu quero avaliar produtos e gerenciar minhas avaliações
  Para compartilhar minha experiência com outros compradores

  # ============================================
  # CT008 - Adicionar avaliação na página do produto
  # ============================================
  Cenário: Adicionar avaliação na página do produto
    Dado que eu estou logado no sistema
    E estou na página do produto "Fone de Ouvido Bluetooth XZ200"
    Quando eu selecionar a nota "5" estrelas
    E digitar o comentário "Fone de ouvido brabo, parece que estou ouvindo a banda do meu lado!"
    E clicar em "Enviar avaliação"
    Então o sistema deve validar o comentário
    E a avaliação deve ser adicionada à página do produto
    E o nome do usuário deve aparecer junto com a avaliação
    # RESULTADO: FALHA - Comentário adicionado sem validação prévia

  # ============================================
  # CT009 - Remover avaliação do usuário
  # ============================================
  Cenário: Remover avaliação do usuário
    Dado que eu estou logado no sistema
    E eu já avaliei o produto anteriormente
    E estou na página do produto avaliado
    Quando eu clicar em "Remover comentário"
    Então o sistema deve permitir que o autor remova sua avaliação
    E a avaliação deve desaparecer da página do produto
    # RESULTADO: FALHA - Não há opção para remover avaliações

  # ============================================
  # CT024 - Avaliar produto sem ter comprado
  # ============================================
  Cenário: Avaliar produto sem ter comprado
    Dado que eu estou logado no sistema
    E eu NUNCA comprei o produto "Fone de Ouvido Bluetooth XZ200"
    Quando eu acessar a página do produto
    E selecionar a nota "5" estrelas
    E escrever o comentário "Ótimo!"
    E tentar enviar a avaliação
    Então o sistema deve bloquear a avaliação
    E exibir a mensagem "Apenas compradores podem avaliar este produto"
    # RESULTADO: FALHA - Funcionalidade liberada para qualquer usuário

  # ============================================
  # CT025 - Avaliar produto recém-comprado
  # ============================================
  Cenário: Avaliar produto recém-comprado
    Dado que eu estou logado no sistema
    E eu comprei o produto "Teclado Mecânico ClickPro"
    E a compra foi finalizada com sucesso
    Quando eu acessar a página do produto "Teclado Mecânico ClickPro"
    E selecionar a nota "4" estrelas
    E digitar o comentário "Teclado é bom mas, não é tudo isso que dizem"
    E clicar em "Avaliar"
    Então a avaliação deve ser salva com sucesso
    E deve aparecer na página do produto
    E deve conter: nome do usuário, nota, comentário e data de postagem

  # ============================================
  # CT026 - Atualização não afeta avaliações
  # ============================================
  Cenário: Atualização na descrição não afeta avaliações existentes
    Dado que o produto possui avaliações registradas anteriormente
    E eu estou logado como administrador
    Quando eu atualizar a descrição do produto
    Então o sistema deve manter todas as avaliações existentes
    E a descrição deve ser a única informação alterada
    E nenhuma avaliação deve ser perdida ou modificada