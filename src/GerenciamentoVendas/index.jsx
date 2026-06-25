import axios from "axios"
import { useEffect, useState } from "react"
import VisualizacaoPedidos from "./VisualizacaoPedidos"

export default function GerenciamentoVendas() {
    const [dadosProdutos, setDadosProdutos] = useState(null)
    const [dadosClientes, setDadosClienets] = useState(null)
    const [dadosPedidos, setDadosPedidos] = useState(null)
    const [carrinho, setCarrinho] = useState([])
    const [valorCarrinho, setValorCarrinho] = useState(0)
    const [clienteSelecionado, setClienteSelecionado] = useState('')
    const [dataPedido, setDataPedido] = useState('')

    async function buscardados() {
        let retornoProdutos = await axios.get('http://localhost:3000/produtos')
        setDadosProdutos(retornoProdutos.data)

        let retornoClientes = await axios.get('http://localhost:3000/clientes')
        setDadosClienets(retornoClientes.data)
        console.log(dadosClientes)

        let retornoPedidos = await axios.get('http://localhost:3000/pedidos')
        setDadosPedidos(retornoPedidos.data)
    }

    useEffect(()=> {
        buscardados()
        return()=> {
            console.log('Aqui fica o cleanUp')
        }
    }, [])

    async function registrarPedido() {
        let listaIdPedidos = []
        carrinho.forEach((pedido) => listaIdPedidos.push({'produto_id': pedido.id}))

        let novoPedido = {
            'id': 310,
            'cliente_id': clienteSelecionado.id,
            'data_pedido': dataPedido,
            'produtos': listaIdPedidos
        }
        let retorno = await axios.post('http://localhost:3000/pedidos', novoPedido)
        console.log(novoPedido)
    }

    async function atualizarEstoque() {

        for (const produto of carrinho) {
            let produtoAtualizado = {
                "id": produto.id,
                "nome": produto.nome,
                "valor": produto.valor,
                "estoque": produto.estoque - 1
            }

            await axios.put(`http://localhost:3000/produtos/${produto.id}`, produtoAtualizado)
        }

        buscardados()
    }

    function adicionarCarrinho(produto) {
        setCarrinho([...carrinho, produto])
        setValorCarrinho(valorCarrinho + produto.valor)

    }

    function finalizarCompra() {
        if (clienteSelecionado != '' && dataPedido != '' && carrinho.length > 0) {
            registrarPedido()
            atualizarEstoque()
            alert('Compra finalizada com sucesso!')
        } else {
            alert('Preencha todos os campos antes de finalizar a compra!')
        }
    }

    return (
    <>
    <h1>Sistema de Vendas</h1>
    <br /><br />
    {dadosProdutos === null?<span>⏳ Carregando...</span>:
    <div>
        {dadosClientes === null ? null :
        <div>
            <VisualizacaoPedidos pedidos = {dadosPedidos} cliente = {dadosClientes}/>
            <br /><br />
            <label>Selecione o Cliente</label>
            <select value={clienteSelecionado} onChange={(valorId) => {
                let clienteRecuperado = dadosClientes.find(cliente => cliente.id === valorId.target.value)
                setClienteSelecionado(clienteRecuperado)
                }}>
                <option value="" disabled>Escolha um cliente</option>
                {dadosClientes.map(cliente => <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                )}
            </select>
            <br /><br />
            <label>Data do Pedido</label>
            <input type="date" value={dataPedido} onChange={(dados) => setDataPedido(dados.target.value)}/>
        </div>
        }
        <br />
        <h2>Carrinho</h2>
        {carrinho.length === 0 ? <span>Carrinho vazio</span>:
        <ul>
            {carrinho.map((produto) => 
            <li key={produto.id}> {produto.nome} - R$ {produto.valor.toFixed(2)}</li>
            )}
        </ul>
        }
        <br />
        Total: R$ {valorCarrinho.toFixed(2)}
        <br /><br />
        <button onClick={() => finalizarCompra()}>Finalizar Compra</button>
        <br /><br />
        <h1>Produtos</h1>
        <ul>
            {dadosProdutos.map((produto)=>
            <li key={produto.id}>
                {produto.nome} - R$ {produto.valor.toFixed(2)} (Estoque: {produto.estoque})
                <button onClick={()=> adicionarCarrinho(produto)}>Adicionar</button>
            </li>
            )}
        </ul>
    </div>
    }

    </>
    )
}