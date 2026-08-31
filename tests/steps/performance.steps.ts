import { Given, Then, When } from '@cucumber/cucumber';

const pendingLoadTool = () => 'pending' as const;

Given(
  /^(?:que o ambiente de teste está (?:configurado com monitoramento|isolado com monitoramento ativo)|o catálogo está populado com dados de teste|a ferramenta de carga está configurada|cada usuário virtual executará o fluxo completo de compra)$/,
  pendingLoadTool,
);

When(
  /^(?:eu executar o teste de carga com \d+ usuários simultâneos|a carga for mantida por \d+ minutos|eu iniciar o teste com \d+ usuários|aumentar a carga em \d+ usuários a cada \d+ minutos|monitorar as métricas: taxa de sucesso, tempo de resposta, erros, memória|continuar aumentando até que o tempo de resposta ultrapasse \d+ segundos)$/,
  pendingLoadTool,
);

Then(
  /^(?:o tempo de resposta (?:médio da página inicial|da busca) deve ser ≤ \d+ segundos|a taxa de erros deve ser ≤ \d+%|a CPU do servidor deve ser ≤ \d+% durante o pico|o sistema deve operar dentro das margens definidas|o sistema deve suportar pelo menos \d+ usuários simultâneos|ao atingir o limite, deve retornar erro amigável ".+"|após a carga ser reduzida, o sistema deve se recuperar sozinho|o ponto de ruptura deve ser registrado para análise)$/,
  pendingLoadTool,
);
