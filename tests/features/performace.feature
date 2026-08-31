# language: pt

Funcionalidade: Performance do Sistema
  Como um administrador do sistema
  Eu quero que o sistema suporte diferentes cargas de usuários
  Para garantir uma boa experiência durante picos de acesso

  # ============================================
  # CT023 - Teste de Carga com 500 usuários simultâneos
  # ============================================
  Cenário: Validar performance aceitável com 500 usuários simultâneos
    Dado que o ambiente de teste está configurado com monitoramento
    E o catálogo está populado com dados de teste
    E a ferramenta de carga está configurada
    Quando eu executar o teste de carga com 500 usuários simultâneos
    E a carga for mantida por 10 minutos
    Então o tempo de resposta médio da página inicial deve ser ≤ 2 segundos
    E o tempo de resposta da busca deve ser ≤ 2 segundos
    E a taxa de erros deve ser ≤ 1%
    E a CPU do servidor deve ser ≤ 70% durante o pico
    E o sistema deve operar dentro das margens definidas

  # ============================================
  # CT031 - Teste de Estresse no checkout
  # ============================================
  Cenário: Identificar o limite máximo de usuários no fluxo de checkout
    Dado que o ambiente de teste está isolado com monitoramento ativo
    E a ferramenta de carga está configurada
    E cada usuário virtual executará o fluxo completo de compra
    Quando eu iniciar o teste com 50 usuários
    E aumentar a carga em 50 usuários a cada 2 minutos
    E monitorar as métricas: taxa de sucesso, tempo de resposta, erros, memória
    E continuar aumentando até que o tempo de resposta ultrapasse 10 segundos
    Então o sistema deve suportar pelo menos 500 usuários simultâneos
    E ao atingir o limite, deve retornar erro amigável "Serviço indisponível, tente novamente"
    E após a carga ser reduzida, o sistema deve se recuperar sozinho
    E o ponto de ruptura deve ser registrado para análise