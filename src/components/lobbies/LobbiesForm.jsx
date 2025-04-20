import { useState } from "react";
import Button from "../utils/Button";

function LobbiesForm(props) {
    return (
        <div>
            <div>
                <h2>{props.action} sala</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        props.onSubmit();
                    }}
                >
                    <input
                        type="text"
                        placeholder="Nombre de la sala"
                        value={props.lobbyName}
                        onChange={(e) => props.setLobbyName(e.target.value)}
                    />
                    <div style={{ marginTop: 10 }}>
                        <Button text={props.action} onSubmit={() => props.onSubmit()} />
                        <Button text="Cancelar" onClick={() => props.onCancel()} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LobbiesForm