from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

font_path = Path(r"C:\Windows\Fonts\arial.ttf")
bold_path = Path(r"C:\Windows\Fonts\arialbd.ttf")
pdfmetrics.registerFont(TTFont("Arial", str(font_path)))
pdfmetrics.registerFont(TTFont("Arial-Bold", str(bold_path)))

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="RptTitle", fontName="Arial-Bold", fontSize=19, leading=23, textColor=colors.HexColor("#172B4D"), alignment=TA_CENTER, spaceAfter=9))
styles.add(ParagraphStyle(name="RptSub", fontName="Arial", fontSize=9, leading=12, textColor=colors.HexColor("#5E6C84"), alignment=TA_CENTER, spaceAfter=14))
styles.add(ParagraphStyle(name="RptH2", fontName="Arial-Bold", fontSize=13, leading=16, textColor=colors.HexColor("#172B4D"), spaceBefore=8, spaceAfter=7))
styles.add(ParagraphStyle(name="RptBody", fontName="Arial", fontSize=8.5, leading=12, textColor=colors.HexColor("#172B4D")))
styles.add(ParagraphStyle(name="RptCell", fontName="Arial", fontSize=7, leading=9, textColor=colors.HexColor("#172B4D")))
styles.add(ParagraphStyle(name="RptCellBold", fontName="Arial-Bold", fontSize=7, leading=9, textColor=colors.HexColor("#172B4D")))

GREEN = colors.HexColor("#22A06B")
RED = colors.HexColor("#C9372C")
AMBER = colors.HexColor("#E2B203")
BLUE = colors.HexColor("#0C66E4")
LIGHT = colors.HexColor("#F4F5F7")

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Arial", 7)
    canvas.setFillColor(colors.HexColor("#6B778C"))
    canvas.drawString(15 * mm, 9 * mm, "Mercatta - Evidencia de execucao de testes")
    canvas.drawRightString(doc.pagesize[0] - 15 * mm, 9 * mm, f"Pagina {doc.page}")
    canvas.restoreState()

def p(text, bold=False):
    return Paragraph(str(text).replace("&", "&amp;"), styles["RptCellBold" if bold else "RptCell"])

cases = [
 (1,"Buscar produto por nome exato","Sucesso",""),
 (2,"Buscar termo com acentuacao","Sucesso",""),
 (3,"Buscar termo com caracteres especiais (aspas)","Falha","A busca por aspas retornou produtos sem aspas no nome."),
 (4,"Buscar por subtitulo","Sucesso",""),
 (5,"Adicionar produto ao carrinho com estoque esgotado","Falha","Botao esperado 'Produto indisponivel' nao foi localizado."),
 (6,"Tentar adicionar quantidade maior que o estoque","Falha","Timeout ao realizar a segunda adicao."),
 (7,"Aumentar quantidade com estoque limitado","Falha","Timeout ao alterar a quantidade de 1 para 3."),
 (8,"Checkout com dados validos","Falha","Timeout ao acionar Finalizar Pedido."),
 (9,"Checkout com carrinho vazio","Falha","Mensagem/indicador de bloqueio esperado nao foi localizado."),
 (10,"Cadastrar com dados validos","Sucesso",""),
 (11,"Cadastrar com nome incluindo numeros","Falha","Mensagem 'O nome deve conter apenas letras' nao foi exibida."),
 (12,"Cadastrar com e-mail ja utilizado","Sucesso",""),
 (13,"Cadastrar deixando campos obrigatorios vazios","Falha","Indicador esperado de bloqueio do cadastro nao foi localizado."),
 (14,"Estoque atualiza apos compra","Falha","Checkout permaneceu na pagina, sem redirecionar ao pedido."),
 (15,"Sistema limita quantidade conforme estoque","Sucesso",""),
 (16,"Ordenar produtos por menor preco","Falha","Valores exibidos nao ficaram em ordem crescente."),
 (17,"Ordenar produtos por data de lancamento","Sucesso",""),
 (18,"Validar filtro da categoria Hardware","Falha","Timeout ao selecionar a categoria Hardware."),
 (19,"Realizar login com sucesso","Sucesso",""),
 (20,"Tentar login com senha invalida","Sucesso",""),
 (21,"Tentar login com e-mail nao cadastrado","Falha","Step buscou o texto literal 'em vermelho', nao a mensagem real."),
 (22,"Logout acessivel independentemente da tela","Sucesso",""),
 (23,"Visualizar historico de pedidos e status","Falha","Nenhum item com o padrao 'Pedido #' foi localizado."),
 (26,"Adicionar avaliacao na pagina do produto","Sucesso",""),
 (27,"Remover avaliacao do usuario","Bloqueado","Step de preparacao da avaliacao anterior nao implementado."),
 (28,"Avaliar produto sem ter comprado","Falha","Indicador esperado de bloqueio nao foi localizado."),
 (29,"Avaliar produto recem-comprado","Falha","Timeout ao acionar Avaliar."),
 (30,"Atualizacao da descricao preserva avaliacoes","Bloqueado","Steps de preparacao/atualizacao ainda nao implementados."),
 (31,"Responsividade em diferentes resolucoes","Sucesso",""),
]

def functional_pdf():
    path = OUT / "relatorio-testes-funcionais-mercatta.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=landscape(A4), rightMargin=12*mm, leftMargin=12*mm, topMargin=13*mm, bottomMargin=16*mm, title="Relatorio de Testes Funcionais Mercatta")
    story = [Paragraph("Relatorio de Testes Funcionais - Mercatta", styles["RptTitle"]), Paragraph("Execucao BDD/Playwright | Ciclo Zephyr KAN-R1 | 31/08/2026", styles["RptSub"])]
    summary = Table([[p("12", True), p("15", True), p("2", True), p("29", True)], [p("Sucesso"), p("Falha"), p("Bloqueado"), p("Cenarios funcionais")]], colWidths=[40*mm]*4)
    summary.setStyle(TableStyle([("BACKGROUND",(0,0),(0,0),colors.HexColor("#DCFFF1")),("BACKGROUND",(1,0),(1,0),colors.HexColor("#FFECEB")),("BACKGROUND",(2,0),(2,0),colors.HexColor("#FFF7D6")),("BACKGROUND",(3,0),(3,0),colors.HexColor("#E9F2FF")),("ALIGN",(0,0),(-1,-1),"CENTER"),("BOX",(0,0),(-1,-1),0.5,colors.HexColor("#B3B9C4")),("INNERGRID",(0,0),(-1,-1),0.25,colors.HexColor("#DFE1E6")),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
    story += [summary, Spacer(1,8*mm), Paragraph("Resultado por caso", styles["RptH2"])]
    data = [[p("Caso",True),p("Cenario",True),p("Status",True),p("Evidencia / causa",True)]]
    for n,title,status,note in cases:
        data.append([p(f"KAN-T{n}",True),p(title),p(status,True),p(note or "Executado sem falha na assercao principal.")])
    table=Table(data, colWidths=[20*mm,75*mm,24*mm,145*mm], repeatRows=1)
    commands=[("BACKGROUND",(0,0),(-1,0),colors.HexColor("#172B4D")),("TEXTCOLOR",(0,0),(-1,0),colors.white),("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#B3B9C4")),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),4),("RIGHTPADDING",(0,0),(-1,-1),4),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4)]
    for row,(_,_,status,_) in enumerate(cases,1):
        commands.append(("BACKGROUND",(2,row),(2,row), {"Sucesso":colors.HexColor("#DCFFF1"),"Falha":colors.HexColor("#FFECEB"),"Bloqueado":colors.HexColor("#FFF7D6")}[status]))
        if row%2==0: commands.append(("BACKGROUND",(0,row),(1,row),LIGHT)); commands.append(("BACKGROUND",(3,row),(3,row),LIGHT))
    table.setStyle(TableStyle(commands)); story += [table, Spacer(1,5*mm), Paragraph("Observacao: os resultados refletem a rodada valida em ambiente Next.js dev isolado, com API configurada para a origem http://localhost:3020. O caso visual KAN-T32 permaneceu nao executado e nao integra a contagem funcional acima.", styles["RptBody"])]
    doc.build(story,onFirstPage=footer,onLaterPages=footer)

def performance_pdf():
    path = OUT / "relatorio-testes-performance-mercatta.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm, topMargin=18*mm, bottomMargin=18*mm, title="Relatorio de Testes de Performance Mercatta")
    story=[Paragraph("Relatorio de Testes de Performance - Mercatta",styles["RptTitle"]),Paragraph("Perfil Cucumber @performance | Ciclo Zephyr KAN-R1 | 31/08/2026",styles["RptSub"]),Paragraph("Resumo executivo",styles["RptH2"]),Paragraph("Os dois cenarios foram iniciados, mas permaneceram bloqueados porque os steps atuais apenas marcam a necessidade de uma ferramenta de carga e de monitoramento. Nao houve medicao valida de usuarios simultaneos, latencia, taxa de erro, CPU ou ponto de ruptura.",styles["RptBody"]),Spacer(1,7*mm)]
    data=[[p("Caso",True),p("Cenario",True),p("Status",True),p("Motivo",True)],
          [p("KAN-T24",True),p("Validar performance aceitavel com 500 usuarios simultaneos"),p("Bloqueado",True),p("Ambiente de monitoramento e gerador de carga nao implementados nos steps.")],
          [p("KAN-T25",True),p("Identificar limite maximo de usuarios no checkout"),p("Bloqueado",True),p("Cenario requer carga incremental, metricas e registro do ponto de ruptura.")]]
    table=Table(data,colWidths=[25*mm,65*mm,28*mm,60*mm],repeatRows=1)
    table.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#172B4D")),("TEXTCOLOR",(0,0),(-1,0),colors.white),("BACKGROUND",(2,1),(2,-1),colors.HexColor("#FFF7D6")),("GRID",(0,0),(-1,-1),0.4,colors.HexColor("#B3B9C4")),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
    story += [table,Spacer(1,8*mm),Paragraph("Condicoes para uma nova execucao",styles["RptH2"]),Paragraph("1. Configurar ferramenta de carga (por exemplo, k6 ou JMeter).<br/>2. Isolar o ambiente e habilitar monitoramento de CPU, memoria e erros.<br/>3. Definir massa de dados e limpeza entre iteracoes.<br/>4. Executar 500 usuarios por 10 minutos e depois carga incremental de 50 usuarios.<br/>5. Anexar series temporais e metricas ao Zephyr.",styles["RptBody"])]
    doc.build(story,onFirstPage=footer,onLaterPages=footer)

functional_pdf()
performance_pdf()
