# language: pt

Funcionalidade: Responsividade e Acessibilidade
  Como um usuário do sistema
  Eu quero que o sistema se adapte a diferentes resoluções de tela
  Para ter uma boa experiência em qualquer dispositivo

  # ============================================
  # CT028 - Verificar layout em diferentes resoluções
  # ============================================
  Cenário: Verificar se a página mantém organização em diferentes resoluções
    Dado que eu estou na página inicial do sistema
    Quando eu ajustar o zoom do navegador para 230%
    Então o layout deve se adaptar sem quebras significativas
    Quando eu ajustar para 160%
    Então o layout deve se adaptar sem quebras significativas
    Quando eu ajustar para 80%
    Então o layout deve se adaptar sem quebras significativas
    Quando eu ajustar para 60%
    Então o layout deve se adaptar sem quebras significativas
    E o sistema deve manter a usabilidade em todas as escalas