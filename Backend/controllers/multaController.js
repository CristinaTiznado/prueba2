const Multa= require('../models/multa');
const Vecino = require('../models/vecino');

const createMulta = (req, res) => {
    const{valor, tipo, dia, mes, year, cod_multa, vecino} = req.body;
    const { codigo } = req.params
    const newMulta = new Multa({
        valor,
        tipo,
        dia,
        mes,
        year,
        cod_multa,
        vecino
    });

    newMulta.save((error, multa) =>{
        if(error){
            console.log(error)
            return res.status(400).send({ message: "No se ha podido crear la multa"})
        }
        Vecino.updateOne({ codigo: codigo }, { $push: { multas: multa._id } }, (error) => {
            if (error) {
                console.log(error)
                return res.status(400).send({ message: "Error al actualizar el vecino" })
            }
        })
        return res.status(201).send(multa)
    })
}

const getMultas =  (req, res) => {
    Multa.find({}).populate({ path: 'vecino'}).exec((error, multas) => {
        if (error) {
            return res.status(400).send({ message: 'Error al obtener las multas' });
        }
        if(multas.length === 0){
            return res.status(404).send({ message: "No se encontraron multas"})
        }
        return res.status(200).send(multas);
    })
}

const getMulta = (req, res) => {
    const { cod_multa } = req.params;
    Multa.find({cod_multa}).populate({ path: 'vecino'}).exec((error, multa) => {
        if (error) {
            return res.status(400).send({ message: 'Error al obtener multa' });
        }
        if (!multa) {
            return res.status(404).send({ message: 'No se encontrĂ³ multa' });
        }
        return res.status(200).send(multa);
    })
}

const getMultaF = (req, res) => {
    const {dia, mes, year} = req.params
    Multa.find({dia ,mes, year}).populate({ path: 'vecino'}).exec((error, multa) => {
        if(error){
            return res.status(400).send({ message: "No se ha podido realizar la busqueda"})
        }
        if(!multa){
            return res.status(404).send({ message: "No se ha encontrado la multa"})
        }
        return res.status(200).send(multa)
    })
}


const deleteMulta =  (req, res) => {
    const { cod_multa } = req.params;
    Multa.findOneAndDelete({cod_multa}, (error, multa) => {
        if (error) {
            return res.status(400).send({ message: 'Error al eliminar multa' });
        }
        if (!multa) {
            return res.status(404).send({ message: 'No se encontrĂ³ multa' });
        }
        return res.status(200).send(multa);
    })
}

module.exports={
    createMulta,
    getMultas,
    getMulta,
    getMultaF,
    deleteMulta
}