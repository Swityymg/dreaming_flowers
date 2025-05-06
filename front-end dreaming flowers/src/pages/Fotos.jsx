import Footer from "../layout/Footer"
import Header from "../layout/Header"
import { useState } from "react"
import axios from "axios"

function Fotos(){
    // use state
    const [archivos, setArchivo]=useState(null)
    const [cargando, setCargando]=useState(false)

    const subirFoto=async()=>{
        if (!archivos){
            console.log("no se ha seleccionado una imagen")
            return;
        }
        const datosFormulario=new FormData()
        datosFormulario.append('file',archivos)
        try{
            setCargando(true)
            const respuesta=await axios.post('http://localhost:3000/procesar-foto',datosFormulario,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
        }catch (error){
            console.log("hubo un error al subir la foto", error)
        }finally{
            setCargando(false)
        }
    }

    const cargarArchivo=(event)=>{
        setArchivo(event.target.files[0])
    }

    return(
        <>
        <Header/>
        <h1>Subir foto</h1>
        <input type="file" onChange={cargarArchivo}/>
        <button onClick={subirFoto} disabled={cargando}>
            {cargando? 'cargando archivo':'Subir foto'}
        </button>
        <Footer/>
        </>
    )
}

export default Fotos