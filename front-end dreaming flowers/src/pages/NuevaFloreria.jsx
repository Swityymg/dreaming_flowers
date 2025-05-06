import axios from "axios";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function NuevaFloreria() {
    const [floreria, setfloreria] = useState({
        nombre: '',
        ubicacion: '',
        telefono: ''
    })

    const capturaDatos = (e) => {
        const { name, value } = e.target;
        setfloreria(
            {
                ...floreria,
                [name]: value
            }
        )
    }
    const limpiarForm = (e) => {
        e.preventDefault();
        setfloreria({
            nombre: '',
            ubicacion: '',
            telefono: ''
        })
    }

    const guardarFloreria = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/guardar', floreria)
            .then(response => {
                console.log(response.data)
                mostrarMensaje(response.data)

            })
            .catch(error => {
                console.error(error)
            })
    }

    const mostrarMensaje = (mensaje) => {
        withReactContent(Swal).fire({
            icon: "success",
            title: "mensaje",
            showConfirmButton: false,
            timer: 1500
        })
    }

    return (
        <>
            <Header />
            <main>
                <div ClassName="album py-5 bg-body-tertiary">
                    <div className="container">
                        <h1>Nueva Floreria</h1>
                        <form onSubmit={guardarFloreria}>
                            <div className="mb-3">
                                <label className="form-label">Nombre de la floreria</label>
                                <input type='text' name='nombre' className="form-control" placeholder="ingresa nombre" required value={floreria.nombre} onChange={capturaDatos} />

                            </div>
                            <div className="mb-3">
                                <label className="form-label">Ubicación</label>
                                <input type='text' name='ubicacion' className="form-control" placeholder="ingresa nombre" required value={floreria.ubicacion} onChange={capturaDatos} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Teléfono</label>
                                <input type='text' name='telefono' className="form-control" placeholder="ingresa nombre" required value={floreria.telefono} onChange={capturaDatos} />
                            </div>
                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary">Guardar</button>
                                <button onClick={limpiarForm} type="reset" className="btn btn-secondary">Limpiar</button>
                            </div>
                        </form>
                    </div></div>
            </main>
            <Footer />
        </>
    )
}