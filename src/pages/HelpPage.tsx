import { Link } from "react-router-dom";
const questions = [
  [
    "Como funciona esta loja?",
    "A EYI Store é um projeto demonstrativo integrado à API DummyJSON. Os produtos são fictícios e os preços são ilustrativos, exibidos em reais sem conversão cambial. Nenhuma compra ou entrega real acontece.",
  ],
  [
    "Qual é o prazo de entrega?",
    "As opções econômica, padrão e expressa têm prazos e preços simulados. Experimente o cálculo de frete com um CEP válido no carrinho.",
  ],
  [
    "Como funciona a troca ou devolução?",
    "Como não há compras reais, também não há trocas ou devoluções reais. Os produtos adicionados podem ser removidos do carrinho a qualquer momento.",
  ],
  [
    "Quais são as formas de pagamento?",
    "O checkout permite simular Pix ou cartão em 6 parcelas sem juros. Não há integração com um meio de pagamento e não solicitamos dados de cartão.",
  ],
  [
    "Como uso o cupom de desconto?",
    "Digite EYI10 no campo de cupom do carrinho para aplicar 10% de desconto sobre o subtotal dos produtos.",
  ],
  [
    "Onde encontro meus pedidos?",
    "Abra Minha conta no cabeçalho ou Conta no menu inferior. Seu histórico de pedidos demonstrativos fica salvo apenas no navegador atual.",
  ],
  [
    "Meus dados são enviados?",
    "O checkout é simulado no navegador. O endereço e o e-mail digitados não são armazenados no histórico nem enviados a um servidor de pedidos. A lista de novidades também é apenas demonstrativa.",
  ],
];
export default function HelpPage() {
  return (
    <section className="page faq">
      <div className="breadcrumb">
        <Link to="/">Início</Link> / Atendimento
      </div>
      <div className="section-head">
        <div>
          <h2>Como podemos ajudar?</h2>
          <p>Uma experiência simples, do começo ao fim.</p>
        </div>
      </div>
      {questions.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </section>
  );
}
