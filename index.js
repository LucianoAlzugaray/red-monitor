const { Sequelize, Model, DataTypes } = require('sequelize');
const ping = require ("net-ping");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
  });

const target = process.env.TARGET_URL

// Create the data model
class Register extends Model {}
Register.init({
    to_host: DataTypes.STRING,
    sended_at: DataTypes.DATE,
    interface: DataTypes.STRING, 
    success: DataTypes.BOOLEAN,
    ms: DataTypes.INTEGER
}, { sequelize, modelName: 'register' });

// Run ping and get data
let session = ping.createSession();
let runPing = () => {
    return new Promise((resolve, reject) => {
        session.pingHost(target, (error, target, sent, rcvd) => {
            if (error)
                reject({
                    error
                })
            else
                resolve({
                    target, 
                    sent,
                    rcvd
                })
        });
    })    
}

let saveData = data => {
    if (data.error){
        Register.create({
            to_host: target,
            sended_at: data.date,
            interface: 'DEFAULT',
            success: false,
        })
        console.log(`No hay conexión con ${target}`)
    } else {
        Register.create({
            to_host: target,
            sended_at: data.date,
            interface: 'DEFAULT',
            success: true,
            ms: data.rcvd  - data.sent
        })
        console.log({...data, ms:  data.rcvd  - data.sent})
    }
}

sequelize.sync().then(async ()=> {
    now = new Date()
    for (let i=0; i<=10; i++){
        ping_data = await runPing()
        response = await saveData({...ping_data, date:now})
    }
}).catch(err => {
    console.log('No se puede iniciar la base de datos.  Abortando.')
    console.log(err)
})
