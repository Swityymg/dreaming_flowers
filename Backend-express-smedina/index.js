const express = require ('express')
const swaggerJsDocs= require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")
const app=express()
const port=3000
const mysql = require ("mysql2")
// para postman 
const cors=require('cors')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))


// definir conecion a mysql
const bd=mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'ingeswity',
    database: 'dreaming_flowers',
})

// conectar sql
bd.connect((err)=>{
    if (err){
        console.log("Error al conectarse a mysql" + err.stack)
        return;
    }
    console.log("Conectado a mysql")
})

// creando nuestra primera ruta
app.get('/', (req, res)=>{
    res.send("Bienvenidos al servicio")
})
//                                         GETS
/**
 * @swagger
 * /florerias:
 *  get:
 *      tags: [Florerias]
 *      summary: Listado de Florerias
 *      responses:
 *          200:
 *              description: Muestra la lista de florerias
 */



app.get('/florerias', (req, res)=>{
    bd.query('select * from florerias',(err,results)=>{
        if(err){
            console.log('error al ejecutar la consulta')
            return;
        }
        res.json(results)
    })
})



//                                      BUSQUEDA DE FLORERIA POR ID  
/**
 * @swagger
 * /florerias/(id):
 *  get:
 *      summary: Detalle de florerias
 *      tags: [Florerias]
 *      parameters:
 *          - in: path
 *          name: id de la floreria
 *          description: path
 * 
 *      responses:
 *          200:
 *              description: Muestra la lista de florerias
 */
app.get('/florerias/:id',(req, res) => {
    const idFloreria = parseInt(req.params.id)
    bd.query("SELECT * FROM florerias WHERE idflorerias=?",[idFloreria],(err,results) => {
        if(err) {
            res.status(400).send("Error al obtener la floreria")
            return
        }
        res.json(results)
    })
})


app.delete('/florerias/:id',(req, res) => {
    const idfloreria = parseInt(req.params.id)
bd.query('DELETE FROM florerias WHERE idfloreria = ?', [idfloreria], (err, result) =>{
    if (err){
        res.status(400).send("Error al eliminar una floreria")
        return;
    }
    res.send('Floreria eliminada correctamente');
    });
});


                                 //  ELIMINAR DATOS
/**
 * @swagger
 * /florerias/{id}:
 *  delete:
 *      summary: Eliminacion de Floreria
 *      tags: [Florerias]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: ID de la floreria
 *            requiered: true
 *      responses:
 *          200:
 *              description: Elimina una floreria
 *          400:
 *              description: Error al eliminar floreria 
 */


//                                      PROCESAR DATOS

/**
 * @swagger
 * components:
 *      schemas:
 *          Floreria:
 *             type: object
 *             required:
 *                  - nombre
 *                  - ubicacion
 *                  - telefono
 *             properties:
 *                  id:
 *                      type: integer
 *                      description: ID autoincrementable de la floreria
 *                  nombre:
 *                      type: string
 *                      description: Nombre de la floreria
 *                  ubicacion:
 *                      type: string
 *                      description: Lugar  de la floerira
 *                  telefono:
 *                      type: string
 *                      description: No.telefono de la floreria
 *             example:
 *                  nombre: "El girasol de Benja"
 *                  ubicacion: "Av 125"
 *                  telefono: "1222345"
 */
 
/**
 * @swagger
 * tags: 
 *      name: Florerias
 *      description: API del catagolo de florerias
 * /guardar:
 *  post:
 *      summary: Crear florerias 
 *      tags: [Florerias]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Floreria'
 *      responses:
 *          200: 
 *              description: Guardar nueva floreria
 *          400:
 *              description: Datos incompletos
 */



app.put('/florerias/:id', (req, res) =>{
    const { nombre, ubicacion, telefono } = req.body // obtiene los datos que se pasan como parametros
    const idfloreria = parseInt (req.params. id)
    bd.query ("UPDATE florerias SET nombre = ?, ubicacion = ?, telefono=? WHERE idfloreria = ?",
        [nombre, ubicacion, telefono, idfloreria], 
        (err, result) => {
            if (err) {
                res.status(400).send("Error al editar una floreria")
                return;
            }
            res.send( 'Floreria actualizadas');
        });
});

/**
 * @swagger
 * /florerias/{id}: 
 *  put:
 *      summary: Editar florerias 
 *      tags: [Florerias]
 *      parameters:
 *          - name: id
 *            in: path
 *            description: id de la floreria
 *            required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Floreria'
 *      responses:
 *          200: 
 *              description: Guardar nueva floreria
 *          400:
 *              description: Datos incompletos
 */


//                                      procesar datos
app.post('/guardar', (req, res)=> {
    const {nombre, ubicacion, telefono}=req.body //descontruccion
    //validar datos
    if (!nombre || !ubicacion || !telefono){
        return res.status(400).json({error:"todos los campos son obligatorios"});
    }
   //const datos= req.body;
   //console.log(datos)
    bd.query("INSERT INTO florerias(nombre, ubicacion, telefono) VALUES (?,?,?)",[nombre, ubicacion, telefono],
    (err,result)=>{
        if (err){
            res.status(400).send("Error")
        }
        res.status(200).send("Floreria creada")
    })
})

// configurar swagger para la documentacion de las API
const swaggerOptions = {
    swaggerDefinition: {
        openapi:"3.1.0",
        info: {
            title: "API de Dreaming Flowers",
            version: "1.0.0",
            descriptions: "API de Dreaming Flowers",
        },
    },
    apis: ['*.js'],
}
const swaggerDocs = swaggerJsDocs(swaggerOptions)
app.use('/apis-docs', swaggerUI.serve,swaggerUI.setup(swaggerDocs))



// hacer disponible el servidor
app.listen(port,()=>{
    console.log("Servidor iniciado")
})



//                                  CRUD DE PRODUCTOS
/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: API del catálogo de productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 */

app.get('/productos', (req, res)=>{
    bd.query('select * from productos',(err,results)=>{
        if(err){
            console.log('error en la consulta')
            return;
        }
        res.json(results)
    })
})


/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Buscar producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no existe
 */

app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    bd.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).send("Error al buscar producto");
            return;
        }
        if (results.length === 0) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        res.json(results[0]);
    });
});



/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - precio
 *               - florería
 *               - categoría
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               foto:
 *                 type: string
 *               florería:
 *                 type: integer
 *               categoría:
 *                 type: integer
 *               estatus:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos incompletos
 */
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, foto, florería, categoría, estatus } = req.body;
    
    if (!nombre || !descripcion || !precio || !florería || !categoría) {
        return res.status(400).json({ error: "Campos obligatorios: nombre, descripcion, precio, florería, categoría" });
    }

    bd.query(
        'INSERT INTO productos (nombre, descripcion, precio, foto, florería, categoría, estatus) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, precio, foto || null, florería, categoría, estatus || 1],
        (err, result) => {
            if (err) {
                res.status(500).send("Error al crear producto: " + err.message);
                return;
            }
            res.status(201).json({ id: result.insertId, message: "Producto creado" });
        }
    );
});

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Datos inválidos
 */
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, descripcion, precio, foto, florería, categoría, estatus } = req.body;

    bd.query(
        'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, foto = ?, florería = ?, categoría = ?, estatus = ? WHERE id = ?',
        [nombre, descripcion, precio, foto, florería, categoría, estatus, id],
        (err, result) => {
            if (err) {
                res.status(500).send("Error al actualizar producto");
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).send("Producto no encontrado");
                return;
            }
            res.json({ message: "Producto actualizado" });
        }
    );
});

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no existe
 */
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    bd.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).send("Error al eliminar producto");
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send("Producto no encontrado");
            return;
        }
        res.json({ message: "Producto eliminado" });
    });
});