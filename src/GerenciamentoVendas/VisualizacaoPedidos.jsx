import { useState } from "react"

export default function VisualizacaoPedidos(props) {
    const [exibirModal, setExibirModal] = useState(false)
    const [pedidoSelecionado, setPedidoSelecionado] = useState('')
    const [exibirInfo, setExibirInfo] = useState(false)
    const [clienteSelecionado, setClienteSelecionado] = useState('')

    async function recuperarInfo(cliente_id) {
        let clienteEncontrado =  await props.cliente.find(cliente => cliente.id === cliente_id)
        setClienteSelecionado(clienteEncontrado)
    }

    return (
        <div>
            <button onClick={() => setExibirModal(true)}>Visualizar pedidos</button>
            {exibirModal === false ? null:
            <dialog open>

                <label>Selecione um pedido: </label>
                <select value={pedidoSelecionado} onChange={(event) => {
                    let pedidoRecuperado = props.pedidos.find(pedido => pedido.id === event.target.value)
                    setPedidoSelecionado(pedidoRecuperado)
                    recuperarInfo(pedidoRecuperado.cliente_id)
                    setExibirInfo(true)
                }}>

                    <option value="" disabled>Escolha um pedido</option>
                    {props.pedidos.map(pedido => <option key={pedido.id} value={pedido.id} >ID: {pedido.id}, Data: {pedido.data_pedido}</option>)}
                    
                </select>

                <br /><br />

                {exibirInfo ? 
                <div>
                    <h1>Dados do Cliente</h1><br />
                    <label>Nome:</label> {clienteSelecionado.nome}

                </div>
                : null}
                <button onClick={() => setExibirModal(false)}>Fechar</button>
            </dialog>
            }
        </div>
    )
}