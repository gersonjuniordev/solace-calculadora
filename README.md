# Solace Ateliê — Calculadora de velas

Calculadora responsiva, em português e reais, para estimar custos e recomendar o preço de venda de velas artesanais aromáticas conforme a margem de lucro desejada.

## Recursos

- Cera, essência, conversão entre peso e volume e perdas de insumos.
- Potes, pavios, rótulos, embalagem e frete de insumos.
- Trabalho e energia calculados por lote.
- Despesas fixas rateadas, taxas, impostos, comissões e frete por pedido.
- Margem sobre o preço de venda, comparação de cenários e simulação de descontos.
- Resultado por unidade e lote, impressão e exportação via impressão em PDF.

## Uso

Abra `index.html` ou acesse a publicação do GitHub Pages. Os dados iniciais são exemplos e devem ser substituídos pelos custos reais. Os cálculos são executados no navegador. Não há envio dos valores preenchidos nem salvamento automático; ao recarregar, os exemplos retornam.

Fórmula principal: preço = custo por unidade / (1 − taxas − impostos − comissão − margem). Percentuais em forma decimal. A recomendação é arredondada para cima.

## Publicação

Em Settings → Pages, selecione Deploy from a branch, branch `main` e pasta `/ (root)`. O arquivo `.nojekyll` mantém a publicação estática, sem processamento Jekyll. Os caminhos dos arquivos são relativos para funcionar em uma página de projeto.

## Verificação

Execute `node tests.cjs` para verificar os cálculos. Não são necessárias dependências para executar a aplicação.

## Marca

Solace Ateliê — Criada para o essencial. O logo foi reconstruído a partir da referência fornecida pela marca. As referências de precificação e as premissas estão na seção “Como funciona” da calculadora.
