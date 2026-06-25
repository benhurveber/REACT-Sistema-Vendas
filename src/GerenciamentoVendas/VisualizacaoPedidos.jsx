import { useState } from "react"

export default function VisualizacaoPedidos(props) {
    const [exibirModal, setExibirModal] = useState(false)
    const [pedidoSelecionado, setPedidoSelecionado] = useState('')
    const [exibirInfo, setExibirInfo] = useState(false)

    return (
        <div>
            <button onClick={() => setExibirModal(true)}>Visualizar pedidos</button>
            {exibirModal === false ? null:
            <dialog open>

                <label>Selecione um pedido: </label>
                <select value={pedidoSelecionado} onChange={(valorId) => {
                    let pedidoRecuperado = props.pedidos.find(pedido => pedido.id === valorId.target.value)
                    setPedidoSelecionado(pedidoRecuperado)
                }}>

                    <option value="" disabled>Escolha um pedido</option>
                    {props.pedidos.map(pedido => <option key={pedido.id} value={pedido.id} >ID: {pedido.id}, Data: {pedido.data_pedido}</option>)}
                    
                </select>

                <br /><br />

                <button onClick={() => setExibirModal(false)}>Fechar</button>
            </dialog>
            }
        </div>
    )
}