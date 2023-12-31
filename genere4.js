const cheerio = require("cheerio");
const axios = require("axios");
const readline = require("readline");
const fs = require("fs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const data_producto = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Inserta la URL: ', (answer) => {
    const url = answer;
      getGenre(url);
      console.log(`>>> Trabajo LISTO!`);
    rl.close(); 
  });

async function getGenre(url){
    try{

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const descripcion = $("div.font-weight-light:nth-child(3)").text() + " " +
                   "Autor: " + $("#metadata-autor > a").text() + " " +
                   "Editorial: " + $("#metadata-editorial > a").text();

        const Autor = $("#metadata-autor > a").text();
        const Editorial = $("#metadata-editorial > a").text();
        const link = $('#producto > div.row.product-info > div.col-xs-12.col-md-3 > div > div > div > div > div > div.row.center-xs > div > div > div > img').attr('data-src');
       
        const isb = $("#metadata-isbn13").text();
        const cleanedIsb = parseInt(isb, 10);


        data_producto.push({descripcion, Autor: Autor, Editorial: Editorial});

        console.log(data_producto);

        console.log(cleanedIsb);


await axios({
  method: 'GET',
  url: link,
  responseType: 'stream'
}).then(response => {
  const folderName = `${cleanedIsb}`;
  const filePath = `./${folderName}/${cleanedIsb}.jpg`; // Ruta completa del archivo
  fs.mkdirSync(folderName, { recursive: true }); // Crear la carpeta si no existe
  response.data.pipe(fs.createWriteStream(filePath));
});

const csvWriter = createCsvWriter({
  path: 'datos.csv',
  header: [
    { id: 'descripcion', title: 'DESCRIPCION' },
    { id: 'Autor', title: 'AUTOR' },
    { id: 'Editorial', title: 'EDITORIAL' },
  ],
  append: true 
});

// Escribir los nuevos datos en el archivo CSV
await csvWriter.writeRecords(data_producto)
  .then(() => {
    console.log('Datos agregados al archivo CSV correctamente.');
  })
  .catch((err) => {
    console.error('Error al guardar el archivo CSV:', err);
  });

    }

    catch(error){
        console.error(error);
    }

  };





